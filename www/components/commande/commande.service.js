angular.module('starter')

.factory('Commande', ['storage','$q', function(storage,$q) {
	var defaultCommandes = [{
		id: 1,
		name: 'Monsieur Smith',
		description: 'What do you want Brad ?',
		mesures: [1,4]
	}, {
		id: 2,
		name: 'Madame Smith',
		description: 'Pentalon & Veste',
		descriptionLong: '<ul><li>Il est au milieu de la table</li>'+
		'<li>T\'appelle ça le milieu d\'la table?</li>'+
		'<li>Entre nous deux oui absoluement</li></ul>',
		mesures: [2,3]
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
			commandes.splice(commandes.indexOf(commande), 1);
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
		save: function(commande) {
			return storage.set('commandes', commandes);
		},
  };
}]);
