angular.module('starter')
.controller('MeasureDetailCtrl', ['$scope', '$stateParams', '$state', 'Order', 'Formulaire', function($scope, $stateParams, $state, Order, Formulaire) {

	$scope.order = null;
	$scope.measure = null;
	$scope.form = null;

	Order.get($stateParams.orderId).then(function (order) {
		$scope.order = order;
		$scope.measure = order.order_line[$stateParams.measureId];

	}, function (reason) {
		$state.go('tab.order');
		return reason;
	}).then(function () {

		return Formulaire.get($scope.measure.form).then(function (formulaire) {
			$scope.form = formulaire;
		});
	});


	$scope.click = function (name, e) {
		var val = e.target.textContent.trim();
		if (e.target.nodeName != 'BUTTON')
			return;
		$scope.measure.data[name] = ($scope.measure.data[name] == val) ? null : val;
	};

	$scope.validate = function() {
		$scope.measure.state = 'done';
		Order.save($scope.order);
		$state.go('tab.order-detail', {orderId: $stateParams.orderId});
	}
}]);