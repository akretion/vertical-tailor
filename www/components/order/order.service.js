angular.module('starter')

.factory('Order', ['storage','$q', 'neighbourMerge', '$state', function(storage, $q, neighbourMerge, $state) {

    var orders = null;
    var ordersPromise = null;
    var service = {
        all: function(args) {
            ordersPromise = storage.get('orders', args).then(function (results) {
                orders = (results) ? results: [];
                orders.forEach(function (o) {
                    o.order_line.map(function (m) { if (!m.data) m.data = {}; });
                });
                storage.set('orders', orders);
                return orders;
            });
            return ordersPromise;
        },
        remove: function(order) {
            var pos = orders.indexOf(order);
            if (pos === -1)
                return;

            orders.splice(pos, 1);
            storage.set('orders', orders);
        },
        get: function(orderId) {

            function search() {
                return orders.filter(function (c) {
                    return c.id == orderId; //with == cause we want type coercion
                }).pop();
            }
            ordersPromise = ordersPromise || service.all(); //work with cache
            return ordersPromise.then(search);
        },
        create: function() {
            return {
                id: 'local'+Math.ceil(Math.random()*1000000), //very bad
                order_line: [],
                isLocalOnly: true,
                partner_matricule: null,
                measure_user: {
                    form: 'common',
                    data: {}
                }
            };
        },
        createMeasure: function() {
            return {
                form: null,
                product_name: null,
                product_id: null,
                data: {},
                qty: 1
            };
        },
        save: function(order) {
            //saveAll in fact!
            return storage.set('orders', orders);
        },
        terminate: function (order) {
            order.terminate = true;
            return storage.set('toSync', order).then(
            function (result) {
                service.remove(order);
                return result;
            }, function (reason) {
                console.log('error !', reason);
                storage.set('orders', orders); //save quand même (async)
                return reason;
            });
        },
        refreshNeighbour: function () {
            return neighbourMerge.refresh().then(function () {
                //new values are now in localStorage
                //refresh
                return service.all();
            });
        }
    };
    return service;
}]);
