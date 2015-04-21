// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','buche','odoo'])

.run(function($ionicPlatform, $rootScope, $state) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
		}
	});

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams){
		if (toState.url !== '/redirect' ) {
			$state.go('redirect');
		}
	});
})
.config(['$stateProvider', '$urlRouterProvider', 'jsonRpcProvider',  function($stateProvider, $urlRouterProvider, jsonRpcProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js

	function shouldLogin($q, $state, jsonRpc) {
		//redirect if not logged
		//or if workOffline not set
		if (!jsonRpc.isLoggedIn() && !$state.current.data.global.workOffline)
		{
			return $q.reject();
		}
		return true;
	}

	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "app/tabs.html",
		data: {
			global: { workOffline: false}
		}
	})

	// Each tab has its own nav history stack:
	.state('tab.dash', {
		url: '/dash',
		views: {
			'tab-dash': {
				templateUrl: 'components/dash/tab-dash.html',
				controller: 'DashCtrl'
			}
		}
	})
	.state('tab.order', {
		url: '/order',
		views: {
			'tab-order': {
				templateUrl: 'components/order/order-list.html',
				controller: 'OrderCtrl',
			}
		},
		resolve : {
			redirectIf: shouldLogin
		}
	})
	.state('tab.order-detail', {
		url: '/order/:orderId',
		views: {
			'tab-order': {
				templateUrl: 'components/order/order-detail.html',
				controller: 'OrderDetailCtrl'
			}
		},
		resolve : {
			redirectIf: shouldLogin
		}
	})
	.state('tab.measure', {
		url: '/order/:orderId/measure/:measureId',
		views: {
			'tab-order': {
				templateUrl: 'components/measure/measure-detail.html',
				controller: 'MeasureDetailCtrl'
			}
		},
		resolve : {
			redirectIf: shouldLogin
		}
	})
	.state('tab.settings', {
		url: '/settings/',
		views: {
			'tab-settings': {
				templateUrl: 'components/settings/settings.html',
				controller: 'SettingsCtrl'
			}
		}
	}).state('redirect', { 
	//because ionic can't redirect from to his previous state :
	// state is settings
	// click/go to orders 
	//	-> rejected because not logged
	//		-> state.go(settings) : blank page
	//
	// redirect state is only needed to reslove this issue
	// more info :  https://github.com/angular-ui/ui-router/issues/178
	//				https://github.com/angular-ui/ui-router/issues/1234
		url: '/redirect',
		controller: ['$scope', '$state', function ($scope, $state) {
			$scope.$on('$ionicView.enter', function() {
				$state.go('tab.settings');
			});
		}]
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/order');

}]);
