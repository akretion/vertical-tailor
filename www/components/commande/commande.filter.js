angular.module('starter').filter('commandeFilter', [function () {
	return function (items, commandeFilterTxt) {
		if (!commandeFilterTxt)
			return items;

		var commandeFilterTxtUpper = commandeFilterTxt.toUpperCase();
		return items.filter(function (i) {
			return (i.name.toUpperCase().indexOf(commandeFilterTxtUpper) !== -1 || i.matricule.toUpperCase().indexOf(commandeFilterTxtUpper) !== -1);
		});
	};
}]);