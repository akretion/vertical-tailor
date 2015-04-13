angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc', function($scope, $stateParams, $state, jsonRpc) {
//.controller('SettingsCtrl', ['$scope', '$stateParams', '$state', function($scope, $stateParams, $state) {

	console.log('coucou !');

	$scope.login = function () {
		$scope.error = "";
		jsonRpc.login('db',$scope.bucheUsername,$scope.buchePassword).then(function () {
			console.log('login succeed');
			$state.go('home.main');
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