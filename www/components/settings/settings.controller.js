angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'localStorage', function($scope, $stateParams, $state, jsonRpc, Formulaire, localStorage) {

	$scope.global = $state.current.data.global;

	$scope.jsonRpc = jsonRpc; //for server url

	$scope.$on('$ionicView.enter', function() { //refresh on load
		//because ctrl is not reloaded
		jsonRpc.isLoggedIn(true).then(function (p) {
			$scope.global.isLoggedIn = p;
		});
	});

	$scope.login = function () {
		console.log("dans login()");
		$scope.error = "";
		jsonRpc.login('db', this.bucheUsername, this.buchePassword).then(function () { //this.buche because of new scope of ion-view
			console.log("login succeed");
			$scope.global.isLoggedIn = true;
			if (jsonRpc.odoo_server)
				localStorage.set('odoo_server', jsonRpc.odoo_server);
		}, function (reason) {
			console.log('login failed');
			console.log(reason);
			console.log(JSON.stringify(reason));
			$scope.global.isLoggedIn = false;
			$scope.error = "Authentication failed";
		});
	};

	$scope.saveLocalServer = function(url) {
		localStorage.set('local_server', url);
		console.log('validate ', url);
	};

	$scope.logout = function () {
		console.log('logout');
		jsonRpc.logout(true);
		$scope.global.isLoggedIn = false;
	};

	$scope.loadForm = function () {
		Formulaire.load();
	};
	$scope.reset = function () { 
		['odoo_server', 'forms', 'orders', 'formsProducts'].map(function(key) { localStorage.remove(key) });
		localStorage.set('orders', []);
	};
}]);
