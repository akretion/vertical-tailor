angular.module('starter')

.factory('Mesure', function() {
	var mesures = [{
		id: 1,
		profile: 'VesteH',
		name: 'Veste Homme',
		data: {
			'hauteur': '',
			'largeur': ''
		},
		commande: 1
	}, {
		id: 2,
		profile: 'VesteF',
		name: 'Veste Femme',
		data: {
			'hauteur': '',
			'largeur':''
		},
		commande: 2
	}, {
		id: 3,
		profile: 'PentalonF',
		name: 'Pentalon Femme',
		data: {
			'hauteur': '',
			'largeur':'',
			'couleur':'',
		},
		commande: 2
	}, {
		id: 4,
		profile: 'PentalonH',
		name: 'Pentalon Homme',
		data: {
			'hauteur': '40',
			'largeur':'34',
			'couleur':'Kaki',
		},
		commande: 1
	}];

  return {
	all: function() {
	  return mesures;
	},
	remove: function(mesure) {
	  mesures.splice(mesures.indexOf(mesure), 1);
	},
	get: function(mesureId) {
	  for (var i = 0; i < mesures.length; i++) {
		if (mesures[i].id === parseInt(mesureId)) {
		  return mesures[i];
		}
	  }
	  return null;
	}
  };
});
