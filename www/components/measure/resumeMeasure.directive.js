'use strict';

angular.module('starter')
.directive('resumeMeasures', [function () {
    return { 
        scope: { measure:'=', form:'=' },
        template: '' +
        '<div class="row responsive-sm row-result" ng-repeat="m in dateResume">' +
            '<div class="col" ng-repeat="(key, val) in m">'+
                '<label>{{lookupTable[val]}}</label>'+
                '<div class="data-mesure">{{ measure.data[val] }}</div>'+
            '</div>'+
        '</div>',
        link: function ($scope, elem, attrs) {
            $scope.dataResume = [];
            $scope.lookupTable = {};
            $scope.$watchCollection('measure.data', function (newVal, oldVal) {
            if (newVal)
                $scope.dateResume = splitIn3(newVal);
                $scope.lookupTable = lookup($scope.form);
            });

            function splitIn3 (a) { //split an Object into array of 3 cols

                var values = Object.keys(a).filter(function (k) {
                    return a[k]; //keep only keys with value
                }).sort(); //easier to read

                return values.reduce(function r(prev, current, i) {
                    if (i % 5 == 0)
                        prev.push([]);
                    prev[prev.length -1].push(current);
                    return prev;
                }, []);
            }
            function lookup(form) {
                console.log('lookup', form);
                var lookupTable = {};
                if (form)
                    form.forEach(function (f) {
                        f.questions.forEach(function (q) {
                            lookupTable[q.name] = q.label;
                        });
                    });
                return lookupTable;
            }
        }
    };
}]);