angular.module('starter')

.factory('Order', ['storage','$q', function(storage, $q) {

	var orders = null;
	var service = {
		all: function() {
			return storage.get('orders').then(function (results) {
				orders = results;
				orders.forEach(function (o) {
					o.order_line.map(function (m) { if (!m.data) m.data = {}; });
				});
				return orders;
			});
		},
		remove: function(order) {
			var pos = orders.indexOf(order);
			if (pos === -1)
				return;

			orders.splice(pos, 1);
			storage.set('orders', orders);
		},
		get: function(orderId) { //remove it ?			
			function search() {
				return orders.filter(function (c) {
					return c.id == orderId; //with == cause we want type coercion
				}).pop();
			}

			return $q(function (resolve, reject) {
				if (!orders)
					resolve(service.all().then(search));
				else
					resolve(search());
			});
		},
		create: function() {
			return {
				id: 'local'+Math.ceil(Math.random()*1000000), //very bad
				order_line: [],
				isLocalOnly: true,
				partner_matricule: null,
			};
		},
		createMeasure: function() {
			return {
				form: null,
				product_name: null,
				product_id: null,
				data: {}
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
		}
	};
	return service;
}]);
