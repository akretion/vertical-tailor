angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', '$state', function($http, jsonRpc, $q, $state) {
	var keys = {
		'orders': { domain: 'sale.order' , action: 'get_measure' },
		'formsProducts': { domain: 'product.template', action: 'get_measurable_product' },
		'forms': { domain: 'measure.measure', action: 'get_form'}
	};
	var global = $state.current.data.global;

	return {
		set: function(key, value) {
			return $http.post('key', value);
		},
		get: function(key) {
			if (global.isLoggedIn === false) {
				return $q.reject('session_expired');
			}
			return jsonRpc.call(keys[key].domain, keys[key].action, [], {}).then(function (result) {
				global.isLoggedIn = true;
				return result;
			}, function (reason) {
				if (reason.title === 'session_expired') {
					global.isLoggedIn = false;
					return $q.reject('session_expired');
				} else
					global.isLoggedIn = undefined;
				return $q.reject(reason);
			});
		}
	}
}]);
