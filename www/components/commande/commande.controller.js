angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande, Mesure) {
	console.log('command ctrl');
	Commande.all().then(function (commandes) {
		$scope.commandes =  commandes;
	});
}).controller('CommandeDetailCtrl', function($scope, $stateParams, $state, $ionicModal, Commande, Mesure) {
	
	$scope.commande = null;	
	$scope.mesures = [];


	Commande.get($stateParams.commandeId).then(function (commande) {
		$scope.commande = commande;
		console.log(commande);
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




	$scope.newMesure = function () {
		$scope.modal.data = Mesure.create($scope.commande);
		$scope.produitsFormulaire = [
		{  produit: 'Pentalon H camouflage', formulaire: 'pentalonH'},
		{  produit: 'Pentalon H entrainement', formulaire: 'pentalonH'},
		{  produit: 'T-shirt IronMaiden', formulaire: 'tshrit'},
		{  produit: 'Polo Lacoste', formulaire: 'tshirt'},
		{  produit: 'Survêtement Tacchni', formulaire: 'pentalonH'},
		];
		$scope.openModal();
	};
	$scope.saveAndClose = function (mesure) {
		mesure.produit = $scope.modal.data.produitFormulaire.produit;
		mesure.formulaire = $scope.modal.data.produitFormulaire.formulaire;
		Mesure.add(mesure);
		$scope.commande.mesures.push(mesure.id);
		Commande.save($scope.commande);
		$scope.closeModal();
	};

	$ionicModal.fromTemplateUrl('components/mesure/mesure-modal.html', {
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
});