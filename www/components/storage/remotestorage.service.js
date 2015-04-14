angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', function($http, jsonRpc, $q) {
	var url = 'localhost';
	return {
		set: function(key, value) {
			return $http.post('key', value);
		},
		get: function(key) {
			var object = "";
			return jsonRpc.call('mrp.production.workcenter.line', 'get_sync_data', ['prodoo', null, [['workcenter_id', '=', 1]], 50], {}).then(function (data) {
				console.log('dans resovle', data);
			}, function (reason) {
				console.log('isLogged?', jsonRpc.isLoggedIn());
				if (reason.title === 'session_expired') {
					console.log('session expire, go to loggin');
					return $q.reject();
				}
				return $q.reject();
			});
		}
	}
}]);
