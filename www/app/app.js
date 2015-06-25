// Ionic Starter App

angular.module('starter', ['ionic','buche','odoo'])

.run(['$ionicPlatform', '$rootScope', '$state', 'jsonRpc', 'localStorage', function($ionicPlatform, $rootScope, $state, jsonRpc, localStorage) {
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


    jsonRpc.errorInterceptors.push(function (a) {
        if (a.title === 'session_expired')
            $state.current.data.global.isLoggedIn = false; //ensure state is always uptodate 
    });

    localStorage.get('settings').then(function (settings) {
        //load config from localStorage
        if (settings.odooServer)
            jsonRpc.odoo_server = settings.odooServer;
        if (settings.odooDb)
            jsonRpc.odoo_db = settings.odooDb;
    });

}])
.config(['$stateProvider', '$urlRouterProvider', 'jsonRpcProvider',  function($stateProvider, $urlRouterProvider, jsonRpcProvider) {

    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "app/tabs.html",
        data: {
            global: { 
                isLoggedIn: undefined,
            }
        }
    })

    // Each tab has its own nav history stack:
    .state('tab.order', {
        url: '/order',
        views: {
            'tab-order': {
                templateUrl: 'components/order/order-list.html',
                controller: 'OrderCtrl',
            }
        }
    })
    .state('tab.order-detail', {
        url: '/order/:orderId',
        views: {
            'tab-order': {
                templateUrl: 'components/order/order-detail.html',
                controller: 'OrderDetailCtrl'
            }
        }
    })
    .state('tab.measure', {
        url: '/order/:orderId/measure/:measureId',
        views: {
            'tab-order': {
                templateUrl: 'components/measure/measure-detail.html',
                controller: 'MeasureDetailCtrl'
            }
        }
    })
    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'components/settings/settings.html',
                controller: 'SettingsCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/settings');

}]);
