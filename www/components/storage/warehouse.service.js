angular.module('starter')
.factory('Warehouse', ['storage', '$q','remoteStorage', 'storage', function(localStorage, $q, remoteStorage, storage) {

    var warehousesPromise = null;

    return {
        load: function () {
            warehousesPromise = remoteStorage.get('warehouses').then(function (warehouses) {
                localStorage.set('warehouses', warehouses);
                return warehouses;
            });
        },
        get: function () {
            warehousesPromise = warehousesPromise || storage.get('warehouses').then(function (warehouses) { 
                storage.set('warehouses', warehouses); //keep in local
                return warehouses;
            });
            return warehousesPromise;
        },
    };
}
]);
