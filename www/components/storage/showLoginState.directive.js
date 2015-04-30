'use strict';

angular.module('starter')
.directive('showLoginState', ['$state', function ($state) {
	return { 
		scope: { },
		template: '' +
		'<div ng-switch="global.isLoggedIn" ui-sref="tab.settings">' +
			'<span class="padding-top" ng-switch-when="true">Connecté</span>'+
			'<button class="button" ng-switch-when="false">Se connecter</button>'+
			'<span ng-switch-when="undefined">Indéfini</span>'+
		'</div>',
		link: function ($scope, elem, attrs) {
			$scope.global = $state.current.data.global;
		}
	};
}]);