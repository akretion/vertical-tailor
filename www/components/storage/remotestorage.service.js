angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', function($http, jsonRpc, $q) {
	var keys = {
		'orders': { domain: 'sale.order' , action: 'get_measure' },
		'formsProducts': { domain: 'product.template', action: 'get_measurable_product' },
		'forms': { domain: 'measure.measure', action: 'get_form'}
	};

	return {
		set: function(key, value) {
			return $http.post('key', value);
		},
		get: function(key) {
			return jsonRpc.call(keys[key].domain, keys[key].action, [], {}).then(function (result) {
				return result;
			}, function (reason) {
				if (reason.title === 'session_expired') {
					return $q.reject('session_expired');
				}
				return $q.reject(reason);
			});
		}
	}
}]);
