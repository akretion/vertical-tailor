angular.module('starter')
.factory('storage', ['remoteStorage', 'localStorage', '$q', function(remoteStorage, localStorage, $q) {

		function merge(remote, local) {
			var remoteIds, localIds;
			var toBeKept, toBeAdded;
			remoteIds = remote.map(function (c) {
				return c.id;
			});
			localIds = local.map(function (c) {
				return c.id;
			});

			//2 things to do : 
			//  add into local new  commands
			//  remove from local commands not present in remote
			//		except localCommands
			toBeKept = local.filter(function (c) {
				if (c.isLocalOnly)
					return true; //keep local
				if (remoteIds.indexOf(c.id) === -1)
					return false; //not found in remote
				return true;
			});

			toBeAdded = remote.filter(function (c) {
				if (localIds.indexOf(c.id) === -1)
					return true; //not found in local
				return false;
			});

			return toBeKept.concat(toBeAdded);
		}

		return {
			set: function(key, value) {
				if (key === 'toSync') {
					//remote only
					return remoteStorage.set(key, value);
				} else {
					//local only
					return localStorage.set(key, value);
				}
			},
			get: function(key) {
				var remote = [];
				var local = [];
				
				var rpromise = $q(function (resolve, reject) {
					remoteStorage.get(key).then(function (result) {
						remote = result;
						resolve();
					}, function (reason) {
						resolve();
					});
				});

				var lpromise = localStorage.get(key).then(function (result) {
					local = result;
				});

				return $q.all([lpromise, rpromise]).then(function (result) {
					return merge(remote, local);
				}, function (reason) {
					return [];
				});

			}
		}
}]);