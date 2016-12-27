angular.module('starter')
.factory('Warehouse', ['localStorage','remoteStorage', 'storage', function(localStorage, remoteStorage, storage) {

    var warehousesPromise = null;

    return {
        load: function () {
            warehousesPromise = remoteStorage.get('warehouses').then(function (warehouses) {
                warehouses = warehouses || [];
                localStorage.set('warehouses', warehouses);
                return warehouses;
            });
            return warehousesPromise;
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
