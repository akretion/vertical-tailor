angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', function($scope, $stateParams, $state, jsonRpc, Formulaire) {

	$scope.localSettings = $state.current.data.global; //ion-toggle for offline use

	$scope.login = function () {
		$scope.error = "";
		jsonRpc.login('db', this.bucheUsername, this.buchePassword).then(function () { //this.buche because of new scope of ion-view
			console.log('login succeed');
		}, function () {
			$scope.error = "Authentication failed";
		});
	};
	$scope.logout = function () {
		console.log('logout');
		jsonRpc.logout();
		$state.go('login');
	};
	//$scope.logout();

	$scope.loadForm = function () {
		Formulaire.load();
	};
}]);
