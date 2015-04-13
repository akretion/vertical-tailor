// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','buche','odoo'])

.run(function($ionicPlatform) {
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
})
.config(function($stateProvider, $urlRouterProvider, jsonRpcProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
		.state('tab', {
		url: "/tab",
		abstract: true,
		templateUrl: "app/tabs.html"
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
	.state('tab.commande', {
		url: '/commande',
		views: {
			'tab-commande': {
				templateUrl: 'components/commande/tab-commande.html',
				controller: 'CommandeCtrl'
			}
		}
	})
	.state('tab.commande-detail', {
		url: '/commande/:commandeId',
		views: {
			'tab-commande': {
				templateUrl: 'components/commande/commande-detail.html',
				controller: 'CommandeDetailCtrl'
			}
		}
	})
	.state('tab.mesure', {
		url: '/commande/:commandeId/mesure/:mesureId',
		views: {
			'tab-commande': {
				templateUrl: 'components/mesure/mesure-detail.html',
				controller: 'MesureDetailCtrl'
			}
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
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/commande');



});
