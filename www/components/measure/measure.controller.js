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

	$scope.saveAndBackToOrder = function() {
		$scope.measure.edited = Object.keys($scope.measure.data).length > 0;
		Order.save($scope.order);
		$state.go('tab.order-detail', {orderId: $stateParams.orderId});
	}
}]);