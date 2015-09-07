angular.module('starter')
.controller('OrderCtrl', ['$scope', 'Order', 'Warehouse', '$state', 'localStorage', function($scope, Order, Warehouse, $state, localStorage) {

    $scope.orders = null;
    $scope.editMode = false;
    $scope.orderDraft = null;
    $scope.warehouses = [];

    $scope.$on('$ionicView.enter', function() { //refresh on load
        localStorage.get('warehouse')
          .then(function(w) {
            Order.all(w.id).then(function (orders) { //au premier chargement ou à chaque fois ? 
                $scope.orders = orders;
            });
          })
          .catch(function() {
            Order.all().then(function (orders) { //au premier chargement ou à chaque fois ? 
                $scope.orders = orders;
            });
            Warehouse.get().then(function (warehouses) {
                $scope.warehouses = warehouses;
            });
          });
    });

    $scope.toggleMode = function () {
        if (!$scope.editMode)
            $scope.orderDraft = Order.create();
        else
            $scope.orderDraft = null;
        $scope.editMode = !$scope.editMode;
    };

    $scope.saveOrder = function () {
        $scope.orders.push($scope.orderDraft);
        Order.save($scope.orderDraft);

        $state.go('tab.order-detail', { orderId: $scope.orderDraft.id});
        $scope.toggleMode();
    };

    $scope.refresh = function () {
        //force reload from storage
        Order.all().then(function (orders) {
            $scope.orders = orders;

            orders.filter(function (o) {
                return o.state === 'done'; //get orders ready
            }).forEach(Order.terminate); //terminate them
        });
        //quit edit mode
        $scope.editMode = false;
    };

    $scope.refreshNeighbour = function() {
        //download orders from a local pc instead of odoo
        Order.refreshNeighbour().then(function (orders) {
            $scope.orders = orders;
        });
    };

    $scope.removeOrder = function (order) {
        console.log('remove ', order);
        Order.remove(order);
    };

}]).controller('OrderDetailCtrl', ['$scope', '$stateParams', '$state', 'Order','Formulaire','isOrderDoneFilter','$q', function($scope, $stateParams, $state, Order, Formulaire, isOrderDoneFilter, $q) {
    console.log('OrderDetailCtrl');

    $scope.order = null;    
    $scope.measureDraft = null;
    $scope.editMode = false;
    $scope.produitsFormulaire = null;
    $scope.isOrderDone = null;

    Order.get($stateParams.orderId).then(function (order) {
        $scope.order = order;
        $scope.isOrderDone = isOrderDoneFilter($scope.order);
        return order;
    }).then(null, function (reason) {
        $state.go('tab.order');
        return reason;
    });

    $scope.$on('$ionicView.enter', function() { //refresh on load
        $scope.isOrderDone = isOrderDoneFilter($scope.order);
    });
    $scope.toggleMode = function () {
        if ($scope.editMode) {
            //save all? 
            $scope.isOrderDone = isOrderDoneFilter($scope.order);
        } else {
            $scope.newMeasure();
        }
        $scope.editMode = !$scope.editMode;
    };

    $scope.saveMeasure = function (measure, productForm){

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
        Formulaire.getFormsProducts().then(function (formsProducts) {
            $scope.produitsFormulaire = formsProducts;
        });
        $scope.measureDraft = Order.createMeasure();
    };

    $scope.removeMeasure = function(measure, idx) {
        $scope.order.order_line.splice(idx, 1);
        Order.save($scope.order);
    };

    $scope.terminateOrder = function () {
        if ($scope.isOrderDone) {        
            $scope.isOrderDone = false;//block double click
            $scope.order.state = 'done';
            Order.terminate($scope.order);
            $state.go('tab.order');
        }
    };
}]);
