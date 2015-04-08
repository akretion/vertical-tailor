angular.module('starter')
.controller('MesureCtrl', function($scope, Mesure) {
	console.log('command ctrl');
	$scope.mesures = Mesure.all();
}).controller('MesureDetailCtrl', function($scope, $stateParams, $state, Mesure) {
	$scope.mesure = Mesure.get($stateParams.mesureId);
	if (!$scope.mesure) {
		$state.go('tab.mesure');
		console.log('no mesure id');
	}
});