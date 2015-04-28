'use strict';

angular.module('starter')
.directive('formMeasure', [function () {
	return { 
		scope: { measure:'=', form: '=' },
		template: 
		'<div class="list" ng-repeat="categorie in form">' +
			'<div class="item-divider">{{ categorie.group_title }}</div>' +
			'<div class="item" ng-repeat="c in categorie.questions" ng-class="{\'active\': measure.data[c.name]}">' +
				'<div ng-switch="c.widget">' +
					'<div ng-switch-when="selection"  ng-click="click(c.name, $event)">' +
						'<div>{{c.name}}</div>' +
						'<div class="button-bar">' +
							'<button class="button" ng-repeat="v in c.value" ng-class="{\'active\': v == measure.data[c.name]}">{{ v }}</button>' +
						'</div>' +
					'</div>' +
					'<div ng-switch-when="numeric" class="button-bar">' +
						'<div>{{c.name}}</div>' +
						'<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" type="number"></input>' +
					'</div>' +
					'<div ng-switch-when="number" class="button-bar">' +
						'<div>{{c.name}}</div>' +
						'<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" type="number"></input>' +
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