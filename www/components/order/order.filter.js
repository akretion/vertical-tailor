angular.module('starter').filter('orderFilter', [function () {
	return function (items, orderFilterTxt) {
		if (!orderFilterTxt)
			return items;

		var orderFilterTxtUpper = orderFilterTxt.toUpperCase();
		return items.filter(function (i) {
			return (i.partner_name.toUpperCase().indexOf(orderFilterTxtUpper) !== -1 || i.partner_matricule.toUpperCase().indexOf(orderFilterTxtUpper) !== -1);
		});
	};
}]).filter('isOrderDone', [function () {
	return function (order) {
		if (!order)
			return false;
		return order.order_line.every(function (measure) {
			return measure.edited; //set in measure.ctrl.saveAndBackToOrder()
		});
	};
}]);