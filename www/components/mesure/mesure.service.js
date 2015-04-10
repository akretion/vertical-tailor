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

	var Mesure = {
		data: null,
		all: function() {
			return storage.get('mesures').then(function (data) {
				Mesure.data = data;
			});
		},
		remove: function(mesure) {
			Mesure.data.splice(Mesure.data.indexOf(mesure), 1);
			return storage.set('mesures', Mesure.data);
		},
		get: function(mesureId) {
			function search(mesureId) {
				return Mesure.data.filter(function (m) {
					return m.id == mesureId; //with == cause we want type coercion
				}).pop();
			}

			return $q(function (resolve, reject) { 
				if (!Mesure.data) {
					storage.get('mesures').then(function (data) {
						Mesure.data = data;
						resolve(search(mesureId));
					});
				} else {
					resolve(search(mesureId));
				}
			});
		},
		save: function(mesure) {
			return storage.set('mesures', Mesure.data);
		},
		create: function(commande) {
			var mesure = {
				id: Math.ceil(Math.random()*1000000), //very bad
				formulaire: null,
				produit: null,
				data: [],
				commande: commande.id,
				isLocalOnly: true, //not persisted yet
			};
			return mesure;
		},
		add: function (mesure) {
			Mesure.data.push(mesure);
			return storage.set('mesures',Mesure.data);
		}
	};
	return Mesure;
}]);
