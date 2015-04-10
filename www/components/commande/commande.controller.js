angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande) {
	console.log('command ctrl');
	Commande.all().then(function (commandes) {
		$scope.commandes = commandes;
	});

	$scope.newCommande = function () {
	};

}).controller('CommandeDetailCtrl', function($scope, $stateParams, $state, Commande) {
	
	$scope.commande = null;	
	$scope.mesureDraft = null;


	Commande.get($stateParams.commandeId).then(function (commande) {
		$scope.commande = commande;

	}, function (reason) {
		$state.go('tab.commande');
		console.log('no commande id');
	});

	$scope.saveMesure = function (mesure, produitFormulaire) {
		mesure.produit = produitFormulaire.produit;
		mesure.formulaire = produitFormulaire.formulaire;

		$scope.commande.mesures.push(mesure);
		Commande.save($scope.commande);
	};


	$scope.newMesure = function () {
		$scope.mesureDraft = Commande.createMesure();
		$scope.produitsFormulaire = [
		{  produit: 'Pentalon H camouflage', formulaire: 'vareuse'},
		{  produit: 'Pentalon H entrainement', formulaire: 'pentalonF'},
		{  produit: 'T-shirt IronMaiden', formulaire: 'tshrit'},
		{  produit: 'Polo Lacoste', formulaire: 'tshirt'},
		{  produit: 'Survêtement Tacchni', formulaire: 'pentalonF'},
		];
	};

});