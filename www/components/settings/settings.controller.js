angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc', function($scope, $stateParams, $state, jsonRpc) {

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
}]);
