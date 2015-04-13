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

	return {
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
			return storage.set('commandes', commandes);
		},
		get: function(commandeId) {
			function search(commandeId) {
				return commandes.filter(function (m) {
					return m.id == commandeId; //with == cause we want type coercion
				}).pop();
			}

			return $q(function (resolve, reject) { 
				if (!commandes) {
					storage.get('commandes').then(function (data) {
						commandes = data;
						resolve(search(commandeId));
					});
				} else {
					resolve(search(commandeId));
				}
			});
		},
		create: function() {
			return {
				id: Math.ceil(Math.random()*1000000), //very bad
				mesures: [],
				isLocalOnly: true,
				client: null,
			};
		},
		createMesure: function() {
			return {
				formulaire: null,
				produit: null,
				data: {},
				isLocalOnly: true //not persisted yet
			};
		},
		save: function(commande) {
			return storage.set('commandes', commandes);
		}
	};
}]);
