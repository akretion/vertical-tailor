angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', function($scope, $stateParams, $state, jsonRpc, Formulaire) {

	$scope.localSettings = $state.current.data.global;
	//for isLoggedIn and workOffline (ion-toggle for offline use)

	$scope.jsonRpc = jsonRpc; //for server url

	$scope.$on('$ionicView.enter', function() { //refresh on load
		//because ctrl is not reloaded
		$scope.localSettings.isLoggedIn = jsonRpc.isLoggedIn();
	});

	$scope.login = function () {
		console.log("dans login()");
		$scope.error = "";
		jsonRpc.login('db', this.bucheUsername, this.buchePassword).then(function () { //this.buche because of new scope of ion-view
			console.log("login succeed");
			$scope.localSettings.isLoggedIn = true;
		}, function (reason) {
			console.log('login failed');
			console.log(reason);
			console.log(JSON.stringify(reason));
			$scope.error = "Authentication failed";
		});
	};

	$scope.logout = function () {
		console.log('logout');
		jsonRpc.logout();
		$scope.localSettings.isLoggedIn = false;
	};

	$scope.loadForm = function () {
		Formulaire.load();
	};
}]);
