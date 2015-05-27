angular.module('starter')
.factory('neighbourStorage', ['$http', '$q', function($http, $q) {

	function continueIfLogged() {
		return $q(function(resolve, reject) {
			if (jsonRpc.isLoggedIn() === false) //do not block request if undefined
				return reject('session_expired');
			else
				return resolve();
		});
	};
	function buildUrl(key) {
		return baseUrl + '/' + key;
	};

	return {
		set: function(key, value) {
			throw Error('Neighbour is read only');
		},
		get: function(key) {
			return $http.get(buildUrl(key)).then(function (success) {
				console.log('success', success);
				return success;
			});
		}
	}
}]);
