angular.module('starter')
.factory('remoteStorage', ['$q', function($q) {
    var localStorage = {};
      return {
            set: function(key, value) {
                    return $q(function (resolve, reject) {
                              resolve(localStorage[key] = JSON.stringify(value));
                              resolve();
      });
    },
    get: function(key) {
            return $q(function (resolve, reject) {
                      var val = localStorage[key];
                              if (val)
                        resolve(JSON.parse(val));
                    else
                        reject('key not found');
                  });
                }
  }
}]);
