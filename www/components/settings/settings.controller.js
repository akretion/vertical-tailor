angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'localStorage', function($scope, $stateParams, $state, jsonRpc, Formulaire, localStorage) {

    $scope.global = $state.current.data.global;
    $scope.settings = { localServer: "http://10.47.0.1/", odooServer: "", odooDb: "db"};

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
        jsonRpc.login(jsonRpc.odoo_db || 'db', this.bucheUsername, this.buchePassword).then(function () { //this.buche because of new scope of ion-view
            console.log("login succeed");
            $scope.global.isLoggedIn = true;
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

    $scope.saveSettings = function (settings) {
        console.log('save settings', settings);
        localStorage.set('settings', settings);
        if (settings.odooServer)
            jsonRpc.odoo_server = settings.odooServer;
        if (settings.odooDb)
            jsonRpc.odoo_db = settings.odooDb;
    };

    $scope.loadForm = function () {
        Formulaire.load();
    };

    $scope.reset = function () { 
        ['settings', 'forms', 'orders', 'formsProducts'].map(function(key) { localStorage.remove(key) });
        localStorage.set('orders', []);
    };
}]);
