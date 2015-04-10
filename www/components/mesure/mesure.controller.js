angular.module('starter')
.controller('MesureDetailCtrl', ['$scope', '$stateParams', '$state', 'Commande', 'Formulaire', function($scope, $stateParams, $state, Commande, Formulaire) {

	$scope.commande = null;
	$scope.mesure = null;
	$scope.formulaire = null;

	Commande.get($stateParams.commandeId).then(function (commande) {
		$scope.commande = commande;
		$scope.mesure = commande.mesures[$stateParams.mesureId];

		loadFormulaire($scope.mesure.formulaire);

	}, function (reason) {
		$state.go('tab.commande');
		console.log('no mesure id');
	});

	function loadFormulaire(formulaireName) {
		Formulaire.get(formulaireName).then(function (formulaire) {
			$scope.formulaire = formulaire;
		}, function (reason) {
			console.log('formulaire introuvable');
			$scope.formulaire = [];
		});
	}


	$scope.click = function (label, e) {
		var val = e.target.textContent.trim();
		if (e.target.nodeName != 'BUTTON')
			return;
		$scope.mesure.data[label] = ($scope.mesure.data[label] == val) ? null : val;
	};

	$scope.validate = function() {
		$scope.mesure.state = 'done';
		Commande.save($scope.commande);
		$state.go('tab.commande', {commandeId: $stateParams.commandeId});
	}
}]);