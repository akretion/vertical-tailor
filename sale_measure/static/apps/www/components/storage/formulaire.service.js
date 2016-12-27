angular.module('starter')
.factory('Formulaire', ['storage', '$q','remoteStorage', 'storage', function(localStorage, $q, remoteStorage, storage) {

    var formsPromise = null;
    var formsProductsPromise = null;

    return {
        load: function () {
            //for debug
            formsProductsPromise = remoteStorage.get('formsProducts').then(function (formsProducts) {
                localStorage.set('formsProducts', formsProducts);
                return formsProducts;
            });
            formsPromise = remoteStorage.get('forms').then(function(forms) {
                localStorage.set('forms', forms);
                return forms;
            });
        },
        getFormsProducts: function () {
            formsProductsPromise = formsProductsPromise || storage.get('formsProducts').then(function (formsProducts) {
                localStorage.set('formsProducts', formsProducts);
                return formsProducts;
            });
            return formsProductsPromise;
        },
        get: function (formName) {
            formsPromise = formsPromise || storage.get('forms').then(function (forms) { 
                storage.set('forms', forms); //keep in local
                return forms;
            });
            return formsPromise.then(function (forms) {
                return forms[formName];
            });
        }
    };
}
]);
