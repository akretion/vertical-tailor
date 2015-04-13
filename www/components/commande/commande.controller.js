angular.module('starter')
.controller('CommandeCtrl', ['$scope', 'Commande','$state', function($scope, Commande, $state) {
	console.log('command ctrl');
	Commande.all().then(function (commandes) {
		$scope.commandes = commandes;
	});

	$scope.newCommande = function () {
		if (!$scope.commandeDraft)
			$scope.commandeDraft = Commande.create();
		else
			$scope.commandeDraft = null;
	};
	$scope.saveCommande = function () {
		$scope.commandes.push($scope.commandeDraft);
		Commande.save($scope.commande);
		$state.go('tab.commande-detail', { commandeId: $scope.commandeDraft.id});
		$scope.commandeDraft = null;
	};

}]).controller('CommandeDetailCtrl', ['$scope', '$stateParams', '$state', 'Commande', function($scope, $stateParams, $state, Commande) {
	
	$scope.commande = null;	
	$scope.mesureDraft = null;
	$scope.editMode = false;

	Commande.get($stateParams.commandeId).then(function (commande) {
		$scope.commande = commande;
	}, function (reason) {
		$state.go('tab.commande');
		console.log('no commande id');
	});

	$scope.toggleMode = function () {
		if ($scope.editMode) {
			//save all? 
		} else {
			$scope.newMesure();
		}
		$scope.editMode = !$scope.editMode;
	}

	$scope.saveMesure = function (mesure, produitFormulaire) {
		if (produitFormulaire) {
			mesure.produit = produitFormulaire.produit;
			mesure.formulaire = produitFormulaire.formulaire;

			$scope.commande.mesures.push(mesure);
			Commande.save($scope.commande);
		}
		$scope.mesureDraft = Commande.createMesure();
	};


	$scope.newMesure = function () {
		$scope.produitsFormulaire = [
		{  produit: 'Pentalon H camouflage', formulaire: 'vareuse'},
		{  produit: 'Pentalon H entrainement', formulaire: 'pentalonF'},
		{  produit: 'T-shirt IronMaiden', formulaire: 'tshrit'},
		{  produit: 'Polo Lacoste', formulaire: 'tshirt'},
		{  produit: 'Survêtement Tacchni', formulaire: 'pentalonF'},
		];

		$scope.mesureDraft = Commande.createMesure();
	};

	$scope.removeMesure = function(mesure, idx) {
		$scope.commande.mesures.splice(idx, 1);
		Commande.save($scope.commande);
	};

}]);