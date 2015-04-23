
describe("Storage service tests", function(){

    var storage, remoteStorage, localStorage;
    var $q, $rootScope;

    beforeEach(module('starter'));

    beforeEach(inject(function(_storage_, _remoteStorage_, _localStorage_) {
      storage = _storage_;
      remoteStorage = _remoteStorage_;
      localStorage = _localStorage_;
    }));

    beforeEach(inject(function(_$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    function fail() {
      expect(true).toBe(false);
      return;
    }

    it("should work as expected with array", function (done) {
      var a = [{id: 1, result:'keep it'},{id:2, result:'removeit'}, {id:3, result:'keep it', isLocalOnly: true}];
      var b = [{id: 1, result:'keep local version'}, {id:4, result:'add this object'}];
      var c = [ a[0], a[2], b[1]];
      var sort = function(a, b) { return a.id > b.id; }; //order is not garantee
      $q.all(
        localStorage.set('spec.test', a),
        remoteStorage.set('spec.test', b)
      ).then(function () {
        storage.get('spec.test').then(function (r) {
          expect(r.sort(sort)).toEqual(c.sort(sort));
        }, fail).then(done);
      });
      $rootScope.$apply();
    });

    it("should work as expected with objects", function (done) {
      var a = { 'obj1': {id: 1, result:'keep it'},'obj2': {id:2, result:'removeit'}, 'obj3': {id:3, result:'keep it', isLocalOnly: true}};
      var b = { 'obj1': {id: 1, result:'keep local version'}, 'obj4': {id:4, result:'add this object'}};
      var c = { 'obj1': a.obj1, 'obj3': a.obj3, 'obj4': b.obj4};
      $q.all(
        localStorage.set('spec.test', a),
        remoteStorage.set('spec.test', b)
      ).then(function () {
        storage.get('spec.test').then(function (r) {
          expect(r).toEqual(c);
        }, fail).then(done);
      });
      $rootScope.$apply();
    });

    it("empty key shoud return null", function (done) {
      storage.get('spec.notExistInLocalAndRemote').then(function (r) {
        expect(r).toEqual(null);
      } ,fail).then(done);
      $rootScope.$apply();
    });

    it("local.inexistant <= remote.exist", function (done) {
      var o = { 'oui': 'non' };
      var init = [
        localStorage.remove('spec.test'),
        remoteStorage.set('spec.test', o )
      ];

      $q.all(init).then(function () {
        storage.get('spec.test').then(function (a) {
          expect(a).toEqual(o);
        }, fail).then(done);
      });

      $rootScope.$apply();
    });

    it("local.null <= remote.exist", function (done) {
      var o = { 'oui': 'non' };
      var init = [
        localStorage.set('spec.test', null),
        remoteStorage.set('spec.test', o )
      ];

      $q.all(init).then(function () {
        storage.get('spec.test').then(function (a) {
          expect(a).toEqual(o);
        }, fail).then(done);
      });

      $rootScope.$apply();
    });

    it("local.[{existInRemote}, {isLocal}, {willBeLost}] <= remote.[{existInRemote}, {new}] : [{existInRemote} {isLocal} {new}]", function(done) {
      var a = { 'existInRemote': {}, isLocal: { isLocalOnly: true}, willBeLost: {}};
      var b = { 'existInRemote': {'some':'thingElse'}, 'isNew': {}};
      var c = { 'existInRemote': a.existInRemote, 'isLocal': a.isLocal, 'isNew': b.isNew};

      var init = [
        localStorage.set('spec.test', a),
        remoteStorage.set('spec.test', b)
      ];

      $q.all(init).then(function () {
        storage.get('spec.test').then(function (r) {
          expect(r).toEqual(c);
        }, fail).then(done);
      });
      $rootScope.$apply();
    });

    it("local.{} <= remote.[] : not a good idea", function (done) {
      var a = {'keepIt': {'will': 'beLost'}, 'removeIt': {}, 'localOnly':{isLocalOnly:true}};
      var b = [ {'keepIt': { 'will':'be different'}}, {'addIt': 'yeay'}];
      var c = { 0: b[0], 'localOnly': a.localOnly, 1: b[1]};
      var init = [
        localStorage.set('spec.test', a),
        remoteStorage.set('spec.test', b)
      ];

      $q.all(init).then(function () {
        storage.get('spec.test').then(function (r) {
          expect(r).toEqual(c);
        }, fail).then(done);
      });

      $rootScope.$apply();
    });

});
