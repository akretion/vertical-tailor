angular.module('starter')

.factory('Commande', function() {
	var commandes = [{
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

  return {
	all: function() {
	  return commandes;
	},
	remove: function(commande) {
	  commandes.splice(commandes.indexOf(commande), 1);
	},
	get: function(commandeId) {
	  for (var i = 0; i < commandes.length; i++) {
		if (commandes[i].id === parseInt(commandeId)) {
		  return commandes[i];
		}
	  }
	  return null;
	}
  };
});
