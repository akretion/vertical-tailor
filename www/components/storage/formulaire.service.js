angular.module('starter')
.factory('Formulaire', ['storage', '$q','remoteStorage', 'storage', function(localStorage, $q, remoteStorage, storage) {

	var formsPromise = null;
	var formsProductsPromise = null;

	return {
		load: function () {
			//for debug
			remoteStorage.get('formsProducts').then(function (formProducts) {
				var formProd = formProducts.map(function (fp) {
					return fp.pop();
				});
				localStorage.set('formsProducts', formProd);
			});
      remoteStorage.get('forms').then(function(forms) {
        localStorage.set('forms', forms);
      });
		},
		getFormsProducts: function () {
			formsProductsPromise = formsProductsPromise || storage.get('formsProducts').then(function (formProducts) {
				var formProd = formProducts.map(function (fp) {
					return fp.pop();
				});
			
				localStorage.set('formsProducts', formProd);
				return formProd;
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
	}
}
]);
