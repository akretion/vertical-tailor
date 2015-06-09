angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', function($http, jsonRpc, $q) {
    var getKeys = {
        'orders': { domain: 'sale.order' , action: 'get_measure' },
        'formsProducts': { domain: 'product.template', action: 'get_measurable_product' },
        'forms': { domain: 'product.measure', action: 'get_form'}
    };
    var setKeys = {
        'toSync': { domain: 'sale.order', action:'set_measure'}
    };

    function continueIfLogged() {
        return $q(function(resolve, reject) {
            if (jsonRpc.isLoggedIn() === false) //do not block request if undefined
                return reject('session_expired');
            else
                return resolve();
        });
    };

    return {
        set: function(key, value) {
            return continueIfLogged().then(function () {
                return jsonRpc.call(setKeys[key].domain, setKeys[key].action, [value], {});
            });
        },
        get: function(key) {
            return continueIfLogged().then(function () {
                return jsonRpc.call(getKeys[key].domain, getKeys[key].action, [], {}).then(function (result) {
                    return result;
                });
            });
        }
    }
}]);
