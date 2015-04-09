angular.module('starter')
.controller('MesureDetailCtrl', ['$scope', '$stateParams', '$state', 'Mesure', 'Formulaire', function($scope, $stateParams, $state, Mesure, Formulaire) {

	$scope.mesure = null;
	$scope.formulaire = null;

	Mesure.get($stateParams.mesureId).then(function (mesure) {
		$scope.mesure = mesure;
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
		});
	}


	$scope.click = function (label, e) {
		var val = e.target.textContent.trim();
		if (e.target.nodeName != 'BUTTON')
			return;

		$scope.mesure.data[label] = ($scope.mesure.data[label] == val) ? null : val;

	};

	$scope.validate = function() {
		console.log('va persister', $scope.mesure.data);
		$scope.mesure.state = 'done';
		Mesure.save($scope.mesure);
		$state.go('tab.commande', {commandeId: $stateParams.commandeId});
	}
}]);