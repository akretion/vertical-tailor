angular.module('starter').filter('orderFilter', [function () {
	return function (items, orderFilterTxt) {
		console.log('filter', orderFilterTxt)
		if (!orderFilterTxt)
			return items;

		var orderFilterTxtUpper = orderFilterTxt.toUpperCase();
		return items.filter(function (i) {
			console.log(i);
			return (i.partner_name.toUpperCase().indexOf(orderFilterTxtUpper) !== -1 || i.partner_matricule.toUpperCase().indexOf(orderFilterTxtUpper) !== -1);
		});
	};
}]);