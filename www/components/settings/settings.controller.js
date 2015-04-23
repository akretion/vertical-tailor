angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', function($scope, $stateParams, $state, jsonRpc, Formulaire) {

	$scope.global = $state.current.data.global;

	$scope.jsonRpc = jsonRpc; //for server url

	$scope.$on('$ionicView.enter', function() { //refresh on load
		//because ctrl is not reloaded
		$scope.global.isLoggedIn = jsonRpc.isLoggedIn();
	});

	$scope.login = function () {
		console.log("dans login()");
		$scope.error = "";
		jsonRpc.login('db', this.bucheUsername, this.buchePassword).then(function () { //this.buche because of new scope of ion-view
			console.log("login succeed");
			$scope.global.isLoggedIn = true;
		}, function (reason) {
			console.log('login failed');
			console.log(reason);
			console.log(JSON.stringify(reason));
			$scope.global.isLoggedIn = false;
			$scope.error = "Authentication failed";
		});
	};

	$scope.logout = function () {
		console.log('logout');
		jsonRpc.logout();
		$scope.global.isLoggedIn = false;
	};

	$scope.loadForm = function () {
		Formulaire.load();
	};
}]);
