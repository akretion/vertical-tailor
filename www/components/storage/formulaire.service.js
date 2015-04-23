angular.module('starter')
.factory('Formulaire', ['storage', '$q','remoteStorage', 'storage', function(localStorage, $q, remoteStorage, storage) {

	var formsPromise = null;
	var formsProductsPromise = null;

	return {
		load: function () {
			//for debug
			remoteStorage.get('formsProducts').then(function (formProducts) {
				localStorage.set('formsProducts', formProducts);
			});
			remoteStorage.get('forms').then(function(forms) {
				localStorage.set('forms', forms);
			});
		},
		getFormsProducts: function () {
			formsProductsPromise = formsProductsPromise || storage.get('formsProducts').then(function (formProducts) {
				localStorage.set('formsProducts', formProducts);
				return formProducts;
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
