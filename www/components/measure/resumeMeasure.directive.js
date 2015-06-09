'use strict';

angular.module('starter')
.directive('resumeMeasures', ['Formulaire', function (Formulaire) {
    return { 
        scope: { measure:'='},
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
            });

            var unWatchForm = $scope.$watch('measure.form', function (newVal) {
                //create a lookup table only when measure.form is resolved
                //destroy thereafter because the form will not change anymore.
                if (!newVal)
                    return;

                Formulaire.get(newVal).then(function (form) {
                    $scope.lookupTable = lookup(form);
                });
                unWatchForm(); //self deregister
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
            //build a lookup table in the form : { 'head_size': 'Head size'}
                var lookupTable = {};
                form.forEach(function (f) {
                    f.questions.forEach(function (q) {
                        lookupTable[q.name] = q.label; //there should be no collision
                    });
                });
                return lookupTable;
            }
        }
    };
}]);