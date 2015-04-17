angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', function($http, jsonRpc, $q) {
	var url = 'localhost';
	return {
		set: function(key, value) {
			return $http.post('key', value);
		},
		get: function(key) {
			var object = "";
			console.log('par la');
			return jsonRpc.call('measure.measure', 'get_form', [], {}).then(function (data) {
				console.log('dans resovle', data);
			}, function (reason) {
				console.log('dans reason', reason);
				if (reason.title === 'session_expired') {
					console.log('session expire, go to loggin');
					return $q.reject('session_expired');
				}
				return $q.reject(reason);
			});
		}
	}
}]);
