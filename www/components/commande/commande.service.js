angular.module('starter')

.factory('Commande', ['storage','$q', function(storage, $q) {
	var defaultCommandes = [{
		id: 1,
		matricule: '',
		name: 'Monsieur Smith',
		notes: 'What do you want Brad ?',
		mesures: [{
			formulaire: 'vareuse',
			produit: 'Jeans 501',
			data: {}
		}]
	}, {
		id: 2,
		name: 'Madame Smith',
		matricule: 'Pentalon & Veste',
		notes: 'R.A.S.',
		mesures: []
	}];

	storage.get('commandes').then(null, function (result){
		console.log('populate commandes in session');
		storage.set('commandes', defaultCommandes);
	});

	var commandes = null;
	var service = {
		add: function() {
			commandes.push({'coco':'ou'});
		},
		all: function() {
			return storage.get('commandes').then(function (data) {
				commandes = data;
				return commandes;
			});
		},
		remove: function(commande) {
			var pos = commandes.indexOf(commande);
			if (pos === -1)
				return;

			commandes.splice(pos, 1);
			storage.set('commandes', commandes);
		},
		get: function(commandeId) { //remove it ?			
			function search() {
				return commandes.filter(function (c) {
					return c.id == commandeId; //with == cause we want type coercion
				}).pop();
			}

			return $q(function (resolve, reject) {
				if (!commandes)
					resolve(service.all().then(search));
				else
					resolve(search());
			});
		},
		create: function() {
			return {
				id: 'local'+Math.ceil(Math.random()*1000000), //very bad
				mesures: [],
				isLocalOnly: true,
				client: null,
			};
		},
		createMesure: function() {
			return {
				formulaire: null,
				produit: null,
				data: {}
			};
		},
		save: function(commande) {
			//saveAll in fact!
			return storage.set('commandes', commandes);
		},
		terminate: function (commande) {
			commande.terminate = true;
			return strorage.set('toSync', commande).then(
			function (result) {
				service.remove(commande);
				return result;
			}, function (reason) {
				console.log('error !', reason);
				storage.set('commandes', commandes); //save quand même (async)
				return reason;
			});
		}
	};
	return service;
}]);
