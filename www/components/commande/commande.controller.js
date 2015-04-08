angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande, Mesure) {
	console.log('command ctrl');
	$scope.commandes = Commande.all();
}).controller('CommandeDetailCtrl', function($scope, $stateParams, $state, Commande, Mesure) {
	$scope.commande = Commande.get($stateParams.commandeId);
	if (!$scope.commande) {
		$state.go('tab.commande');
		console.log('no commande id');
	}

	$scope.mesures = $scope.commande.mesures.map(function (m) {
		return Mesure.get(m);
	});
});