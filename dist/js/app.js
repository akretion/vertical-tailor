window.version = "1.0.0"

// Ionic Starter App

angular.module('starter', ['ionic','odoo'])

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
    $urlRouterProvider.otherwise('/tab/order');
}]);

angular.module('starter')
.factory('storage', ['remoteStorage', 'localStorage', '$q', function(remoteStorage, localStorage, $q) {

    function merge(remote, local) {
        if (Array.isArray(remote) && Array.isArray(local))
            return mergeArrays(remote, local);
        return mergeObjects(remote, local);
    }

    //merge two objects
    function mergeObjects(remote, local) {
        var out = {};
        //copy all remote objects
        for (key in remote) {
            out[key] = remote[key];
        }
        //copy missing local objects only if isLocalOnly
        //overwrite remote by local 
        for (key in local) {
            if (remote[key] || local[key].isLocalOnly)
                out[key] = local[key]; //erase with local copy
        }
        return out;
    }

    // merge two arrays
    function mergeArrays(remote, local) {
        var remoteIds, localIds;
        var toBeKept, toBeAdded;

        remoteIds = remote.map(function (c) {
            return c.id;
        });
        localIds = local.map(function (c) {
            return c.id;
        });

        //2 things to do : 
        //  add into local new  commands
        //  remove from local commands not present in remote
        //      except localCommands
        toBeKept = local.filter(function (c) {
            if (c.isLocalOnly)
                return true; //keep local
            if (remoteIds.indexOf(c.id) === -1)
                return false; //not found in remote
            return true;
        });

        toBeAdded = remote.filter(function (c) {
            if (localIds.indexOf(c.id) === -1)
                return true; //not found in local
            return false;
        });

        return toBeKept.concat(toBeAdded);
    }

    return {
        set: function(key, value) {
            if (key === 'toSync') {
                //remote only
                return remoteStorage.set(key, value);
            } else {
                //local only
                return localStorage.set(key, value);
            }
        },
        get: function(key) {
            var remote = null;
            var local = null;

            var rpromise = remoteStorage.get(key).then(function (result) {
                remote = result;
            }, function (reason) {
                return;
            });

            var lpromise = localStorage.get(key).then(function (result) {
                local = result;
            }, function (reason) {
                return;
            });


            return $q.all([lpromise, rpromise]).then(function (result) {                    
                if (!remote)
                    return local;
                if (!local)
                    return remote;
                return merge(remote, local);
            });
        }
    };
}]);

angular.module('starter')
.factory('remoteStorage', ['$http', 'jsonRpc', '$q', 'localStorage', function($http, jsonRpc, $q, localStorage) {
    var getKeys = {
        'orders': { domain: 'sale.order' , action: 'get_measure'},
        'formsProducts': { domain: 'product.template', action: 'get_measurable_product' },
        'forms': { domain: 'product.measure', action: 'get_form'}
    };
    var setKeys = {
        'toSync': { domain: 'sale.order', action:'set_measure'}
    };

    //    localStorage.get('warehouse').then(function(p) {
    //        getKeys.orders.args = p.id;
    //    });

    function continueIfLogged() {
        return $q(function(resolve, reject) {
            if (jsonRpc.isLoggedIn() === false) //do not block request if undefined
                return reject('session_expired');
            else
                return resolve();
        });
    };

    return {
        set: function(key, value) {
            return continueIfLogged().then(function () {
                return jsonRpc.call(setKeys[key].domain, setKeys[key].action, [value], {});
            });
        },
        get: function(key, args) {
            return continueIfLogged().then(function () {
                return jsonRpc.call(getKeys[key].domain, getKeys[key].action, [args || []], {}).then(function (result) {
                    return result;
                });
            });
        }
    }
}]);

angular.module('starter')
.factory('localStorage', ['$window','$q', function($window, $q) {
    return {
        set: function(key, value) {
            return $q(function (resolve, reject) {
                resolve($window.localStorage[key] = JSON.stringify(value));
            });
        },
        get: function(key) {            
            return $q(function (resolve, reject) {
                var val = $window.localStorage[key];
                if (val)
                    resolve(JSON.parse(val));
                else
                    reject('key not found');
            });
        },
    remove: function(key) {
      return $q(function (resolve) {
        resolve($window.localStorage.removeItem(key));
      });
    }
    }
}]);

angular.module('starter')
.factory('Formulaire', ['storage', '$q','remoteStorage', 'storage', function(localStorage, $q, remoteStorage, storage) {

    var formsPromise = null;
    var formsProductsPromise = null;

    return {
        load: function () {
            //for debug
            formsProductsPromise = remoteStorage.get('formsProducts').then(function (formsProducts) {
                localStorage.set('formsProducts', formsProducts);
                return formsProducts;
            });
            formsPromise = remoteStorage.get('forms').then(function(forms) {
                localStorage.set('forms', forms);
                return forms;
            });
        },
        getFormsProducts: function () {
            formsProductsPromise = formsProductsPromise || storage.get('formsProducts').then(function (formsProducts) {
                localStorage.set('formsProducts', formsProducts);
                return formsProducts;
            });
            return formsProductsPromise;
        },
        get: function (formName) {
            formsPromise = formsPromise || storage.get('forms').then(function (forms) { 
                storage.set('forms', forms); //keep in local
                return forms;
            });
            return formsPromise.then(function (forms) {
                return forms[formName];
            });
        }
    };
}
]);

angular.module('starter')
.factory('neighbourStorage', ['$http', '$q', 'localStorage', function($http, $q, localStorage) {


	function buildUrl() {
		return localStorage.get('settings').then(function (settings) {
			var url = settings.localServer;
			console.log('new url : ', url + 'neighbour.json');
			return url + 'neighbour.json';
		});
	}

	return {
		set: function(key, value) {
			throw Error('Neighbour is read only');
		},
		get: function(key) {
			if (key !== 'orders')
				throw Error('Neighbour is only for orders');

			return buildUrl().then(function (url) {
				return $http.get(url).then(function (success) {
					return success.data;
				});
			});
		}
	}
}]);

angular.module('starter')
.factory('neighbourMerge', ['neighbourStorage', 'localStorage', '$q', function(neighbourStorage, localStorage, $q) { 
//merge neighbours and local into localStorage

	function mergeNeighboor(neighbours, locals) {
		//merge locals into neighbours

		var out = neighbours.slice(); //out is a copy
		var ids = out.map(function (n) { 
			n.isLocalOnly = true; //in order to not be removed by storage.merge
			return n.id; //for ids list
		});

		locals.forEach(function (l) {
			var idx;

			idx = ids.indexOf(l.id);
			if (idx !== -1) //it exists in neighbour, erase with local version
				out[idx] = l;
			else
				out.push(l); //because we push at the end, it doesn't infere with ids[];
		});
		return out;
	}

	return {
		refresh: function() {
			var locals, neighbours;

			return $q.all([
				neighbourStorage.get('orders'),
				localStorage.get('orders')
			]).then(function (results) {
				return mergeNeighboor(results[0], results[1]);
			}).then(function (orders) {
				return localStorage.set('orders', orders); //put it directly in localStorage
			});
		}
	};
}])
angular.module('starter')
.controller('OrderCtrl', ['$scope', 'Order', '$state', 'localStorage', function($scope, Order, $state, localStorage) {

    $scope.orders = null;
    $scope.editMode = false;
    $scope.orderDraft = null;

    $scope.$on('$ionicView.enter', function() { //refresh on load
        localStorage.get('warehouse')
          .then(function(w) {
            Order.all(w.id).then(function (orders) { //au premier chargement ou à chaque fois ? 
                $scope.orders = orders;
            });
          })
          .catch(function() {
            Order.all().then(function (orders) { //au premier chargement ou à chaque fois ? 
                $scope.orders = orders;
            });
          });
    });

    $scope.toggleMode = function () {
        if (!$scope.editMode)
            $scope.orderDraft = Order.create();
        else
            $scope.orderDraft = null;
        $scope.editMode = !$scope.editMode;
    };

    $scope.saveOrder = function () {
        $scope.orders.push($scope.orderDraft);
        Order.save($scope.orderDraft);

        $state.go('tab.order-detail', { orderId: $scope.orderDraft.id});
        $scope.toggleMode();
    };

    $scope.refresh = function () {
        //force reload from storage
        Order.all().then(function (orders) {
            $scope.orders = orders;

            orders.filter(function (o) {
                return o.state === 'done'; //get orders ready
            }).forEach(Order.terminate); //terminate them
        });
        //quit edit mode
        $scope.editMode = false;
    };

    $scope.refreshNeighbour = function() {
        //download orders from a local pc instead of odoo
        Order.refreshNeighbour().then(function (orders) {
            $scope.orders = orders;
        });
    };

    $scope.removeOrder = function (order) {
        console.log('remove ', order);
        Order.remove(order);
    };

}]).controller('OrderDetailCtrl', ['$scope', '$stateParams', '$state', 'Order','Formulaire','isOrderDoneFilter','$q', function($scope, $stateParams, $state, Order, Formulaire, isOrderDoneFilter, $q) {
    console.log('OrderDetailCtrl');

    $scope.order = null;    
    $scope.measureDraft = null;
    $scope.editMode = false;
    $scope.produitsFormulaire = null;
    $scope.isOrderDone = null;

    Order.get($stateParams.orderId).then(function (order) {
        $scope.order = order;
        $scope.isOrderDone = isOrderDoneFilter($scope.order);
        return order;
    }).then(null, function (reason) {
        $state.go('tab.order');
        return reason;
    });

    $scope.$on('$ionicView.enter', function() { //refresh on load
        $scope.isOrderDone = isOrderDoneFilter($scope.order);
    });
    $scope.toggleMode = function () {
        if ($scope.editMode) {
            //save all? 
            $scope.isOrderDone = isOrderDoneFilter($scope.order);
        } else {
            $scope.newMeasure();
        }
        $scope.editMode = !$scope.editMode;
    };

    $scope.saveMeasure = function (measure, productForm){

        if (productForm) {
            measure.product_name = productForm.name;
            measure.product_id = productForm.id;
            measure.form = productForm.form;

            $scope.order.order_line.push(measure);
            Order.save($scope.order);
        }
        $scope.measureDraft = Order.createMeasure();
    };


    $scope.newMeasure = function () {
        Formulaire.getFormsProducts().then(function (formsProducts) {
            $scope.produitsFormulaire = formsProducts;
        });
        $scope.measureDraft = Order.createMeasure();
    };

    $scope.removeMeasure = function(measure, idx) {
        $scope.order.order_line.splice(idx, 1);
        Order.save($scope.order);
    };

    $scope.terminateOrder = function () {
        if ($scope.isOrderDone) {        
            $scope.isOrderDone = false;//block double click
            $scope.order.state = 'done';
            Order.terminate($scope.order);
            $state.go('tab.order');
        }
    };
}]);

angular.module('starter')

.factory('Order', ['storage','$q', 'neighbourMerge', '$state', function(storage, $q, neighbourMerge, $state) {

    var orders = null;
    var ordersPromise = null;
    var service = {
        all: function(args) {
            ordersPromise = storage.get('orders', args).then(function (results) {
                orders = (results) ? results: [];
                orders.forEach(function (o) {
                    o.order_line.map(function (m) { if (!m.data) m.data = {}; });
                });
                storage.set('orders', orders);
                return orders;
            });
            return ordersPromise;
        },
        remove: function(order) {
            var pos = orders.indexOf(order);
            if (pos === -1)
                return;

            orders.splice(pos, 1);
            storage.set('orders', orders);
        },
        get: function(orderId) {

            function search() {
                return orders.filter(function (c) {
                    return c.id == orderId; //with == cause we want type coercion
                }).pop();
            }
            ordersPromise = ordersPromise || service.all(); //work with cache
            return ordersPromise.then(search);
        },
        create: function() {
            return {
                id: 'local'+Math.ceil(Math.random()*1000000), //very bad
                order_line: [],
                isLocalOnly: true,
                partner_matricule: null,
                measure_user: {
                    form: 'common',
                    data: {}
                }
            };
        },
        createMeasure: function() {
            return {
                form: null,
                product_name: null,
                product_id: null,
                data: {},
                qty: 1
            };
        },
        save: function(order) {
            //saveAll in fact!
            return storage.set('orders', orders);
        },
        terminate: function (order) {
            order.terminate = true;
            return storage.set('toSync', order).then(
            function (result) {
                service.remove(order);
                return result;
            }, function (reason) {
                console.log('error !', reason);
                storage.set('orders', orders); //save quand même (async)
                return reason;
            });
        },
        refreshNeighbour: function () {
            return neighbourMerge.refresh().then(function () {
                //new values are now in localStorage
                //refresh
                return service.all();
            });
        }
    };
    return service;
}]);

angular.module('starter').filter('orderFilter', [function () {
    return function (items, orderFilterTxt) {
        if (!orderFilterTxt)
            return items;

        var orderFilterTxtUpper = orderFilterTxt.toUpperCase();
        return items.filter(function (i) {
            
            return ['partner_matricule', 'partner_name'].some(function (field) {
                if (!i[field])
                    return false;

                return i[field].toUpperCase().indexOf(orderFilterTxtUpper) !== -1;
            });
 
        });
    };
}]).filter('isOrderDone', [function () {
    return function (order) {
        if (!order)
            return false;
        return order.order_line.every(function (measure) {
            return measure.edited; //set in measure.ctrl.saveAndBackToOrder()
        });
    };
}]);
angular.module('starter')
.controller('MeasureDetailCtrl', ['$scope', '$stateParams', '$state', 'Order', 'Formulaire', function($scope, $stateParams, $state, Order, Formulaire) {

    $scope.order = null;
    $scope.measure = null;
    $scope.form = null;

    Order.get($stateParams.orderId).then(function (order) {
        $scope.order = order;
        $scope.measure = order.order_line[$stateParams.measureId];
    }, function (reason) {
        $state.go('tab.order');
        return reason;
    }).then(function () {
        return Formulaire.get($scope.measure.form).then(function (formulaire) {
            $scope.form = formulaire;
            dirtyHackHeadSize($scope.order.measure_user, $scope.measure, $scope.form);
        });
    });
    
    Formulaire.get('common').then(function (formulaire) {
        $scope.formUser = formulaire;
    });

    $scope.saveAndBackToOrder = function() {
        $scope.measure.edited = Object.keys($scope.measure.data).length > 0;
        Order.save($scope.order);
        $state.go('tab.order-detail', {orderId: $stateParams.orderId});
    };


    function dirtyHackHeadSize(measure_user, measure, form) {
        //we wan head_size to be bound between measure_user and the main form

        //let's see head_size is used in the main form
        var formHasHeadSize = form.some(function (group) {
            return group.questions.some(function (question) {
                return question.name === 'head_size';
            });
        });

        if (!formHasHeadSize) //no head_size, no need to continue
            return;

        var semaphore = false; //protect from infinite digest loop

        $scope.$watch("measure_user.data['head_size']", function (newVal) {
            if (!semaphore) { //user is changing measure_user form
                semaphore = true; //lock the writing
                measure.data['head_size'] = newVal; //set the value (will trigger a new digest loop)
            } else { //user is changing the main form, nothing to do
                semaphore = false; //release the lock (taken from the other watch)
            }
        });

        $scope.$watch("measure.data['head_size']", function (newVal) {
            if (!semaphore) { //user is changing the main form
                semaphore = true; //lock the writting
                measure_user.data['head_size'] = newVal; //set the value
            } else { //user is changing measure_user form
                semaphore = false; //release the lock (taken from the other watch)
            }
        });
    }

}]);
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
                    if (i % 3 == 0)
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
                        '<label><span>{{c.label}}</span></label>' +
                        '<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" type="number" pattern="\-?[0-9]*"></input>' + //inputmode=numeric not supported yet
                    '</div>' +
                    '<div ng-switch-when="number">' +
                        '<label><span>{{c.label}}</span></label>' +
                        '<input ng-class="{\'active\': !!measure.data[c.name]}" ng-model="measure.data[c.name]" type="number" step="0.5"></input>' +
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
angular.module('starter')
.controller('SettingsCtrl', ['$scope', '$stateParams', '$state','jsonRpc','Formulaire', 'localStorage', function($scope, $stateParams, $state, jsonRpc, Formulaire, localStorage) {

    $scope.global = $state.current.data.global;
    $scope.login = { username: undefined, password: undefined};
    $scope.settings = { localServer: "http://10.47.0.1/", odooServer: "", odooDb: "production"};
    $scope.version = window.version;

    $scope.$on('$ionicView.enter', function() { //refresh on load
        //because ctrl is not reloaded
        jsonRpc.isLoggedIn(true).then(function (p) {
            $scope.global.isLoggedIn = p;
        });

        localStorage.get('settings').then(function (settings) {
            $scope.settings = settings;
            localStorage.get('warehouse').then(function (warehouse) {
              $scope.settings.warehouse = warehouse;
            });
        });


        jsonRpc.searchRead('stock.warehouse',[])
          .then(function(result) {
            $scope.warehouses = result.records;
          });
    });

    $scope.$watch('settings.warehouse', function(newVal, oldVal) {
      if (angular.isDefined(newVal) && (!oldVal || oldVal.display_name !== newVal.displayName)) {
        localStorage.set('warehouse', $scope.settings.warehouse);
      }
    });

    $scope.login = function () {
        console.log("dans login()");
        $scope.error = "";
        if ($scope.settings.odooServer)
            jsonRpc.odoo_server = $scope.settings.odooServer;
        if ($scope.settings.odooDb)
            jsonRpc.odoo_db = $scope.settings.odooDb;
        
        jsonRpc.login(jsonRpc.odoo_db, $scope.login.username, $scope.login.password).then(function () { //this.buche because of new scope of ion-view
            console.log("login succeed");
            $scope.global.isLoggedIn = true;

       
            localStorage.set('settings', $scope.settings);
            $scope.login.password = '';
            return Formulaire.load();
        }, function (reason) {
            console.log('login failed');
            console.log(reason);

            console.log(JSON.stringify(reason));
            $scope.global.isLoggedIn = false;
            var message = (reason.message ? reason.message : "")
            var status = (reason.fullTrace && reason.fullTrace.status ? reason.fullTrace.status : "" );
            $scope.error = ["Authentication failed :", message, "(", status, ")"].join(' ');

        });
    };

    $scope.logout = function () {
        console.log('logout');
        jsonRpc.logout(true);
        $scope.global.isLoggedIn = false;
    };


    $scope.reset = function () { 
        $scope.logout();
        $scope.resetMsg = "";
        ['settings', 'forms', 'orders', 'formsProducts'].map(function(key) { localStorage.remove(key) });
        localStorage.set('orders', []);
        $scope.resetMsg = "Réinitialisation terminée. Connectez-vous";
    };
}]);

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