angular.module('starter')

.factory('Mesure', ['storage', '$q', function(storage, $q) {
	//just for testing//
	var defaultMesures = [{
		id: 1,
		formulaire: 'vareuse',
		name: 'Veste Homme',
		data: {
			'hauteur': '',
			'largeur': ''
		},
		commande: 1
	}, {
		id: 2,
		formulaire: 'VesteF',
		name: 'Veste Femme',
		data: {
			'hauteur': '',
			'largeur':''
		},
		commande: 2
	}, {
		id: 3,
		formulaire: 'PentalonF',
		name: 'Pentalon Femme',
		data: {
			'hauteur': '',
			'largeur':'',
			'couleur':'',
		},
		commande: 2
	}, {
		id: 4,
		formulaire: 'vareuse',
		name: 'Pentalon Homme',
		data: {
			'hauteur': '40',
			'largeur':'34',
			'couleur':'Kaki',
		},
		commande: 1
	}];
	
	storage.get('mesures').then(null, function (result){
		console.log('populate mesures in session');
		storage.set('mesures', defaultMesures);
	});
	//just for testing//



	var mesures = null;


	return {
		all: function() {
			return storage.get('mesures').then(function (data) {
				mesures = data;
			});
		},
		remove: function(mesure) {
			mesures.splice(mesures.indexOf(mesure), 1);
			return storage.set('mesures', mesures);
		},
		get: function(mesureId) {
			function search(mesureId) {
				return mesures.filter(function (m) {
					return m.id == mesureId; //with == cause we want type coercion
				}).pop();
			}

			return $q(function (resolve, reject) { 
				if (!mesures) {
					storage.get('mesures').then(function (data) {
						mesures = data;
						resolve(search(mesureId));
					});
				} else {
					resolve(search(mesureId));
				}
			});
		},
		save: function(mesure) {
			return storage.set('mesures', mesures);
		}
	};
}]);
