'use strict';

angular.module('starter')
.directive('showLoginState', ['$state', function ($state) {
	return { 
		scope: { },
		template: '' +
		'<div ng-switch="global.isLoggedIn" ui-sref="tab.settings">' +
			'<span ng-switch-when="true">Connecté</span>'+
			'<span ng-switch-when="false">Non connecté</span>'+
			'<span ng-switch-when="undefined">Indéfini</span>'+
		'</div>',
		link: function ($scope, elem, attrs) {
			$scope.global = $state.current.data.global;
		}
	};
}]);