'use strict';

angular.module('starter')
.directive('formMeasure', [function () {
    return { 
        scope: { measure:'=', form: '=', hideTitle:'=' },
        template: 
        '<div class="list list-mesure-container" ng-repeat="categorie in form">' +
            '<div class="item-divider list-mesure-title" ng-hide="hideTitle">{{ categorie.group_title }}</div>' +
            '<div class="item list-mesure" ng-repeat="c in categorie.questions" ng-class="{\'active\': measure.data[c.name]}">' +
                '<div ng-switch="c.widget" class="question-widget">' +
                    '<div ng-switch-when="selection" ng-click="click(c.name, $event)">' +
                        '<label><span>{{c.label}}</span></label>' +
                        '<div class="button-bar">' +
                            '<button class="button" ng-repeat="v in c.value" ng-class="{\'active\': v == measure.data[c.name]}">{{ v }}</button>' +
                        '</div>' +
                    '</div>' +
                    '<div ng-switch-when="buttons">' +
                        '<label><span>{{c.label}}</span></label>' +
                        '<select ng-model="measure.data[c.name]" ng-options="v as v for v in c.value "></select>' +
                    '</div>' +
                    '<div ng-switch-when="numeric">' +
                        '<label for="numeric-{{c.name}}-{{ $index }}"><span>{{c.label}}</span></label>' +
                        '<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" id="numeric-{{c.name}}-{{ $index }}" type="number" pattern="\-?[0-9]*"></input>' + //inputmode=numeric not supported yet
                    '</div>' +
                    '<div ng-switch-when="number">' +
                        '<label for="number-{{c.name}}-{{ $index }}"><span>{{c.label}}</span></label>' +
                        '<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" id="number-{{c.name}}-{{ $index }}" type="number" step="0.5"></input>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>',
        link: function ($scope, elem, attrs) {
            $scope.click = function (name, e) {
                var val = e.target.textContent.trim();
                if (e.target.nodeName != 'BUTTON')
                    return;
                if ($scope.measure.data[name] && $scope.measure.data[name] === val)
                    delete $scope.measure.data[name];
                else
                    $scope.measure.data[name] = val;
            };
        }
    };
}]);