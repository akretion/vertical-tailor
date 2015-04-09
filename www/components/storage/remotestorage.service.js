angular.module('starter')
.factory('remoteStorage', ['$http', function($http) {
	var url = 'localhost';
	return {
		set: function(key, value) {
			return $http.post('key', value);
		},
		get: function(key) {
			return $http.get(url+'key');
		}
	}
}]);