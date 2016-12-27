angular.module('starter')
.factory('neighbourStorage', ['$http', '$q', 'localStorage', function($http, $q, localStorage) {


	function buildUrl() {
		return localStorage.get('settings').then(function (settings) {
			var url = settings.localServer;
			console.log('new url : ', url + 'neighbour.json');
			return url + 'neighbour.json';
		});
	}

	return {
		set: function(key, value) {
			throw Error('Neighbour is read only');
		},
		get: function(key) {
			if (key !== 'orders')
				throw Error('Neighbour is only for orders');

			return buildUrl().then(function (url) {
				return $http.get(url).then(function (success) {
					return success.data;
				});
			});
		}
	}
}]);

angular.module('starter')
.factory('neighbourMerge', ['neighbourStorage', 'localStorage', '$q', function(neighbourStorage, localStorage, $q) { 
//merge neighbours and local into localStorage

	function mergeNeighboor(neighbours, locals) {
		//merge locals into neighbours

		var out = neighbours.slice(); //out is a copy
		var ids = out.map(function (n) { 
			n.isLocalOnly = true; //in order to not be removed by storage.merge
			return n.id; //for ids list
		});

		locals.forEach(function (l) {
			var idx;

			idx = ids.indexOf(l.id);
			if (idx !== -1) //it exists in neighbour, erase with local version
				out[idx] = l;
			else
				out.push(l); //because we push at the end, it doesn't infere with ids[];
		});
		return out;
	}

	return {
		refresh: function() {
			var locals, neighbours;

			return $q.all([
				neighbourStorage.get('orders'),
				localStorage.get('orders')
			]).then(function (results) {
				return mergeNeighboor(results[0], results[1]);
			}).then(function (orders) {
				return localStorage.set('orders', orders); //put it directly in localStorage
			});
		}
	};
}])