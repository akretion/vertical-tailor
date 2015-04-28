'use strict';

angular.module('starter')
.directive('resumeMeasures', [function () {
	return { 
		scope: { measure:'=' },
		template: '' +
		'<div class="row responsive-sm" ng-repeat="m in dateResume">' +
			'<div class="col" ng-repeat="(key, val) in m" style="border: 1px solid gray">'+
				'{{ val }} : {{ measure.data[val] }}'+
			'</div>'+
		'</div>',
		link: function ($scope, elem, attrs) {
			$scope.dataResume = [];
			$scope.$watchCollection('measure.data', function (newVal, oldVal) {
			if (newVal)
				$scope.dateResume = splitIn3(newVal);
			});

			function splitIn3 (a) { //split an Object into array of 3 cols

				var values = Object.keys(a).filter(function (k) {
					return a[k]; //keep only keys with value
				}).sort(); //easier to read

				return values.reduce(function r(prev, current, i) {
					if (i % 3 == 0)
						prev.push([]);
					prev[prev.length -1].push(current);
					return prev;
				}, []);
			}
		}
	};
}]);