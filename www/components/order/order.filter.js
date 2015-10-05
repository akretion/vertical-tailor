angular.module('starter').filter('orderFilter', ['filterFilter', 'orderByFilter', function (filterFilter, orderByFilter) {
    return function (items, params) {
        if (!items)
            return;

        var orderFiltered = items;

        if (params.warehouse)
            orderFiltered = orderFiltered.filter(function (i) {
                return i.warehouse_id === params.warehouse.id;
            });

        if (params.text) {
            var orderFilterTxtUpper = params.text.toUpperCase();
 
            orderFiltered = orderFiltered.filter(function (i) {
                return ['partner_matricule', 'partner_name', 'name'].some(function (field) {
                    if (!i[field])
                        return false;
                    return i[field].toUpperCase().indexOf(orderFilterTxtUpper) !== -1;
                });
            });
        }

        orderFiltered = filterFilter(orderFiltered, { state: params.state})
        orderFiltered = orderByFilter(orderFiltered, 'state');
        return orderFiltered;
    }
}]).filter('isOrderDone', [function () {
    return function (order) {
        if (!order)
            return false;
        return order.order_line.every(function (measure) {
            return measure.edited; //set in measure.ctrl.saveAndBackToOrder()
        });
    };
}]);