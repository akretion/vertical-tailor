angular.module('starter')
.controller('OrderCtrl', ['$scope', 'Order','$state', function($scope, Order, $state) {

	$scope.orders = null;
	
	Order.all().then(function (orders) {
		$scope.orders = orders;
	});

	$scope.newOrder = function () {
		if (!$scope.orderDraft)
			$scope.orderDraft = Order.create();
		else
			$scope.orderDraft = null;
	};
	$scope.saveOrder = function () {
		$scope.orders.push($scope.orderDraft);
		Order.save($scope.orderDraft);

		$state.go('tab.order-detail', { orderId: $scope.orderDraft.id});
		$scope.orderDraft = null;
	};

	$scope.refresh = function () {
		Order.all().then(function (orders) {
		$scope.orders = orders;
		});
	};

}]).controller('OrderDetailCtrl', ['$scope', '$stateParams', '$state', 'Order','Formulaire', function($scope, $stateParams, $state, Order, Formulaire) {
	console.log('OrderDetailCtrl');

	$scope.order = null;	
	$scope.measureDraft = null;
	$scope.editMode = false;

	Order.get($stateParams.orderId).then(function (order) {
		$scope.order = order;
	}, function (reason) {
		$state.go('tab.order');
		return reason;
	});

	$scope.toggleMode = function () {
		if ($scope.editMode) {
			//save all? 
		} else {
			$scope.newMeasure();
		}
		$scope.editMode = !$scope.editMode;
	};

	$scope.saveMeasure = function (measure, productForm) {

		if (productForm) {
			measure.product_name = productForm.name;
			measure.product_id = productForm.id;
			measure.form = productForm.form;

			$scope.order.order_line.push(measure);
			Order.save($scope.order);
		}
		$scope.measureDraft = Order.createMeasure();
	};


	$scope.newMeasure = function () {
		Formulaire.getFormProducts().then(function (formProducts) {
			$scope.produitsFormulaire = formProducts;
		});
		$scope.measureDraft = Order.createMeasure();
	};

	$scope.removeMeasure = function(measure, idx) {
		$scope.order.order_line.splice(idx, 1);
		Order.save($scope.order);
	};

	$scope.terminateOrder = function () {
		$scope.order.state = 'done';
		Order.terminate($scope.order);
		$state.go('tab.order');
	};
}]);