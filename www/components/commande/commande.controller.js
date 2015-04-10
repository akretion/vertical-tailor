angular.module('starter')
.controller('CommandeCtrl', function($scope, Commande, Mesure, $ionicModal) {
	console.log('command ctrl');
	Commande.all().then(function (commandes) {
		$scope.commandes = commandes;
	});

	$scope.newCommande = function () {
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