angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'localStorage', 'Config', function($scope, $stateParams, $state, jsonRpc, Formulaire, localStorage, Config) {

    $scope.global = $state.current.data.global;
    $scope.login = { username: undefined, password: undefined};
    $scope.settings = Config;
    $scope.version = window.version;

    $scope.$on('$ionicView.enter', function() { //refresh on load
        //because ctrl is not reloaded
        jsonRpc.isLoggedIn(true).then(function (p) {
            $scope.global.isLoggedIn = p;
        });

        localStorage.get('settings').then(function (settings) {
            $scope.settings = settings;
            $scope.login.username = settings.username;
        });

    });

    $scope.login = function () {
        console.log("dans login()");
        $scope.error = "";
        jsonRpc.odoo_server = $scope.settings.odooServer || "";
        if ($scope.settings.odooDb)
            jsonRpc.odoo_db = $scope.settings.odooDb;
        
        jsonRpc.login(jsonRpc.odoo_db, $scope.login.username, $scope.login.password).then(function () { //this.buche because of new scope of ion-view
            console.log("login succeed");
            $scope.global.isLoggedIn = true;

       
            $scope.settings.username = $scope.login.username;
            localStorage.set('settings', $scope.settings);
            $scope.login.password = '';
            $scope.error = "Connexion réussie";
            return Formulaire.load();
        }, function (reason) {
            console.log('login failed');
            console.log(reason);

            console.log(JSON.stringify(reason));
            $scope.global.isLoggedIn = false;
            var message = (reason.message ? reason.message : "")
            var status = (reason.fullTrace && reason.fullTrace.status ? reason.fullTrace.status : "" );
            $scope.error = ["Authentication failed :", message, "(", status, ")"].join(' ');

        });
    };

    $scope.logout = function () {
        console.log('logout');
        jsonRpc.logout(true);
        $scope.global.isLoggedIn = false;
    };


    $scope.reset = function () { 
        $scope.logout();
        $scope.resetMsg = "";
        ['settings', 'forms', 'orders', 'formsProducts', 'warehouses'].map(function(key) { localStorage.remove(key) });
        localStorage.set('orders', []);
        localStorage.set('warehouses', []);
        $scope.global.errors = [];
        $scope.resetMsg = "Réinitialisation terminée. Connectez-vous";
    };

}]);
