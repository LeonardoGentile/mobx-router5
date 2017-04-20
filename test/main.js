import {createRouter} from 'router5';
import chai, { expect } from 'chai';
import { spy, stub } from 'sinon';
import RouterStore from '../src/modules/RouterStore';
import mobxPlugin from '../src/modules/mobxPlugin';



const routes = [
  { name: 'a', path: '/a', },
  { name: 'b', path: '/b', },
  { name: 'c', path: '/c', children: [
    { name: 'd', path: '/d', },
    { name: 'e', path: '/e', },
    { name: 'f', path: '/f', },
    { name: 'g', path: '/g', children: [
      { name: 'h', path: '/h' },
      { name: 'i', path: '/i' },
    ]}
  ]}
];


function createTestRouter(options) {
  const router = createRouter(routes, {...options});
  return router;
}


describe('mobxPlugin', function () {
  let router;
  let routerStore;

  function navigateTo(previousRoute, nextRouteName, done) {
    router.navigate(nextRouteName, {}, {}, function () {
      const nextRoute = router.getState();
      done(previousRoute, nextRoute);
    });
  }

  beforeEach(function () {
    routerStore = new RouterStore();
    router = createTestRouter({defaultRoute: 'a'});
    router.usePlugin(mobxPlugin(routerStore));
  });

  afterEach(function () {
    router.stop();
  });

  context('router', function() {

    it('should be registered', function () {
      expect(router.hasPlugin('MOBX_PLUGIN')).to.be.true;
    });
  });

  context('routerStore', function() {

    it('should add the router instance to into the routerStore ', function () {
      expect(routerStore.router).to.equal(router);
    });

    it('should have observable properties `route` and `previousRoute` reflecting the navigation', () => {

      router.start('a', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g.i';
        navigateTo(previousRoute, nextRouteName, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.previousRoute.name).to.equal('a');
        expect(routerStore.previousRoute.name).to.equal(previousRoute.name);
        expect(routerStore.previousRoute.path).to.equal(previousRoute.path);

        expect(routerStore.route.name).to.equal(nextRoute.name);
        expect(routerStore.route.path).to.equal(nextRoute.path);
        expect(routerStore.route.path).to.equal('/c/g/i');
      }

    });


    it('should have the correct intersection node for navigation: c.f -> c.g', () => {
      routerStore = new RouterStore();
      router = createTestRouter({defaultRoute: 'c.f'});
      router.usePlugin(mobxPlugin(routerStore));

      router.start('c.f', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g';
        navigateTo(previousRoute, nextRouteName, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.intersectionNode).to.equal('c');
      }

    });

    it('should have the correct intersection node for navigation: b -> c.g.h', () => {
      routerStore = new RouterStore();
      router = createTestRouter({defaultRoute: 'b'});
      router.usePlugin(mobxPlugin(routerStore));

      router.start('b', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g.h';
        navigateTo(previousRoute, nextRouteName, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.intersectionNode).to.equal('');
      }
    });

  });

});
