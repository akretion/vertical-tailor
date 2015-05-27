angular.module('starter')
.factory('remoteStorage', ['$q','$http', function($q, $http) {
    var localStorage = {};
    return {
        set: function(key, value) {
            return $q(function (resolve, reject) {
                resolve(localStorage[key] = JSON.stringify(value));
                resolve();
            });
        },
        get: function(key) {
            console.log('ask for ', key);
            return $q(function (resolve, reject) {
                var val = localStorage[key];
                if (val)
                    resolve(JSON.parse(val));
                else
                    $http.get(key+'.json').then(function (r) {
                        console.log(r);
                        resolve(r.data.result);
                    }, function () {
                        reject('key not found')
                    });
            });
        }
    }
}]);
