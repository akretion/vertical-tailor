angular.module('starter')
.factory('storage', ['remoteStorage', 'localStorage', '$q', function(remoteStorage, localStorage, $q) {

		function storage() {
			if (window.navigator.onLine)
				return remoteStorage;
			else
				return localStorage;
		}

		return {
			set: function(key, value) {
				return storage().set(key, value).then(null, function (reason) {
					if (storage() == remoteStorage)
						return localStorage.set(key, value);
					return $q.reject(reason);
				});
			},
			get: function(key) {
				return storage().get(key).then(null, function (reason) {
					if (storage() == remoteStorage) {
						return localStorage.get(key);
					}
					return $q.reject(reason);
				});
			}
		}
}]);