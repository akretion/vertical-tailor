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
            dirtyHackHeadSize($scope.order.measure_user, $scope.measure, $scope.form);
        });
    });
    
    Formulaire.get('common').then(function (formulaire) {
        $scope.formUser = formulaire;
    });

    $scope.saveAndBackToOrder = function() {
        $scope.measure.edited = Object.keys($scope.measure.data).length > 0;
        Order.save($scope.order);
        $state.go('tab.order-detail', {orderId: $stateParams.orderId});
    };


    function dirtyHackHeadSize(measure_user, measure, form) {
        //we wan head_size to be bound between measure_user and the main form

        //let's see head_size is used in the main form
        var formHasHeadSize = form.some(function (group) {
            return group.questions.some(function (question) {
                return question.name === 'head_size';
            });
        });

        if (!formHasHeadSize) //no head_size, no need to continue
            return;

        var semaphore = false; //protect from infinite digest loop

        $scope.$watch("measure_user.data['head_size']", function (newVal) {
            if (!semaphore) { //user is changing measure_user form
                semaphore = true; //lock the writing
                measure.data['head_size'] = newVal; //set the value (will trigger a new digest loop)
            } else { //user is changing the main form, nothing to do
                semaphore = false; //release the lock (taken from the other watch)
            }
        });

        $scope.$watch("measure.data['head_size']", function (newVal) {
            if (!semaphore) { //user is changing the main form
                semaphore = true; //lock the writting
                measure_user.data['head_size'] = newVal; //set the value
            } else { //user is changing measure_user form
                semaphore = false; //release the lock (taken from the other watch)
            }
        });
    }

}]);