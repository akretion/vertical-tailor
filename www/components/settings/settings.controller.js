angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'localStorage', function($scope, $stateParams, $state, jsonRpc, Formulaire, localStorage) {

    $scope.global = $state.current.data.global;
    $scope.settings = { localServer: "http://10.47.0.1/", odooServer: "", odooDb: "db"};
    $scope.login = { username: undefined, password: undefined};

    $scope.$on('$ionicView.enter', function() { //refresh on load
        //because ctrl is not reloaded
        jsonRpc.isLoggedIn(true).then(function (p) {
            $scope.global.isLoggedIn = p;
        });

        localStorage.get('settings').then(function (settings) {
            $scope.settings = settings;
        });
    });

    $scope.login = function () {
        console.log("dans login()");
        $scope.error = "";
        if ($scope.settings.odooServer)
            jsonRpc.odoo_server = $scope.settings.odooServer;
        if ($scope.settings.odooDb)
            jsonRpc.odoo_db = $scope.settings.odooDb;
        
        jsonRpc.login(jsonRpc.odoo_db, $scope.login.username, $scope.login.password).then(function () { //this.buche because of new scope of ion-view
            console.log("login succeed");
            $scope.global.isLoggedIn = true;

       
            localStorage.set('settings', $scope.settings);
            $scope.login.password = '';
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
        $scope.resetMsg = "";
        ['settings', 'forms', 'orders', 'formsProducts'].map(function(key) { localStorage.remove(key) });
        localStorage.set('orders', []);

        $scope.resetMsg = "Ok";
    };
}]);
