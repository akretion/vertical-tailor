angular.module('starter').filter('orderFilter', [function () {
    return function (items, orderFilterTxt) {
        if (!orderFilterTxt)
            return items;

        var orderFilterTxtUpper = orderFilterTxt.toUpperCase();
        return items.filter(function (i) {
            
            return ['partner_matricule', 'partner_name', 'warehouse'].some(function (field) {
                if (!i[field])
                    return false;

                return i[field].toUpperCase().indexOf(orderFilterTxtUpper) !== -1;
            });
 
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