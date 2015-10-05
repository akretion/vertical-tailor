angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'Warehouse', 'localStorage', 'Config', '$http', function($scope, $stateParams, $state, jsonRpc, Formulaire, Warehouse, localStorage, Config, $http) {

    $scope.global = $state.current.data.global;
    $scope.login = { username: undefined, password: undefined};
    $scope.settings = Config;

    $http.get('manifest.json').then(function (response) {
        $scope.version = response.data.version;
    });

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
        $scope.login.feedback = null;
        jsonRpc.odoo_server = $scope.settings.odooServer || "";
        if ($scope.settings.odooDb)
            jsonRpc.odoo_db = $scope.settings.odooDb;
        
        jsonRpc.login(jsonRpc.odoo_db, $scope.login.username, $scope.login.password).then(function () { //this.buche because of new scope of ion-view
            console.log("login succeed");
            $scope.global.isLoggedIn = true;

            $scope.settings.username = $scope.login.username;
            localStorage.set('settings', $scope.settings);
            $scope.login.feedback = { msg: "Connexion réussie", isError: false };
            Warehouse.load();
            return Formulaire.load();
        }, function (reason) {
            console.log('login failed');
            console.log(reason);

            console.log(JSON.stringify(reason));
            $scope.global.isLoggedIn = false;
            $scope.login.feedback = { error: reason, isError: true };

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
