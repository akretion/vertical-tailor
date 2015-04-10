angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande, Mesure, $ionicModal) {
	console.log('command ctrl');
	Commande.all().then(function (commandes) {
		$scope.commandes = commandes;
	});

	$scope.newCommande = function () {
		$scope.modal.data = Commande.create();
		$scope.openModal();
	};

	$ionicModal.fromTemplateUrl('components/commande/commande-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		//Cleanup the modal when we're done with it!
		$scope.$on('$destroy', function() {
			$scope.modal.remove();
		});
		// Execute action on hide modal
		$scope.$on('modal.hidden', function() {
		// Execute action
		});
		// Execute action on remove modal
		$scope.$on('modal.removed', function() {
		// Execute action
		});
	});
	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};
}).controller('CommandeDetailCtrl', function($scope, $stateParams, $state, $ionicModal, Commande, Mesure) {
	
	$scope.commande = null;	
	$scope.mesures = [];
	$scope.mesureDraft = null;


	Commande.get($stateParams.commandeId).then(function (commande) {
		$scope.commande = commande;

		$scope.commande.mesures.forEach(function (m) {
			Mesure.get(m).then(function (mesure) {
				$scope.mesures.push(mesure);
			}, function (){
				console.log('mesure',m,'pas trouvé');
			});
		});

	}, function (reason) {
		$state.go('tab.commande');
		console.log('no commande id');
	});
	
	$scope.saveMesure = function (mesure, produitFormulaire) {
		mesure.produit = produitFormulaire.produit;
		mesure.formulaire = produitFormulaire.formulaire;

		$scope.commande.mesures.push(mesure.id);
		$scope.mesures.push(mesure);

		Mesure.add(mesure);
		Mesure.save(mesure);

		Commande.save($scope.commande);
	};


	$scope.newMesure = function () {
		$scope.mesureDraft = Mesure.create($scope.commande);
		$scope.produitsFormulaire = [
		{  produit: 'Pentalon H camouflage', formulaire: 'pentalonH'},
		{  produit: 'Pentalon H entrainement', formulaire: 'pentalonH'},
		{  produit: 'T-shirt IronMaiden', formulaire: 'tshrit'},
		{  produit: 'Polo Lacoste', formulaire: 'tshirt'},
		{  produit: 'Survêtement Tacchni', formulaire: 'pentalonH'},
		];
	};

});