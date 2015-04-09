angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande, Mesure) {
	console.log('command ctrl');
	$scope.commandes = Commande.all();
}).controller('CommandeDetailCtrl', function($scope, $stateParams, $state, Commande, Mesure) {
	$scope.commande = Commande.get($stateParams.commandeId);
	if (!$scope.commande) {
		$state.go('tab.commande');
	}

	$scope.mesures = [];
	$scope.commande.mesures.map(function (m) {
		Mesure.get(m).then(function (mesure) {
			$scope.mesures.push(mesure);
		});
	});
});