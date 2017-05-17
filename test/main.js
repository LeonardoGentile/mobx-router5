import { createRouter } from 'router5';
import { expect } from 'chai';
import { autorun } from 'mobx';
import RouterStore from '../src/modules/RouterStore';
import mobxPlugin from '../src/modules/mobxPlugin';


const routes = [
  { name: 'a', path: '/a' },
  { name: 'b', path: '/b?param1&param2' },
  {
    name: 'c', path: '/c', children: [
    { name: 'd', path: '/d?param1&param2', },
    { name: 'e', path: '/e', },
    { name: 'f', path: '/f', },
    {
      name: 'g', path: '/g', children: [
      { name: 'h', path: '/h' },
      { name: 'i', path: '/i' },
    ]
    }
  ]
  }
];


function createTestRouter(options) {
  const router = createRouter(routes, { ...options });
  return router;
}


describe('mobxPlugin', function () {
  let router;
  let routerStore;

  function navigateTo(previousRoute, nextRouteName, routeParams, routeOptions, done) {
    router.navigate(nextRouteName, routeParams, routeOptions, function () {
      const nextRoute = router.getState();
      done(previousRoute, nextRoute);
    });
  }

  beforeEach(function () {
    routerStore = new RouterStore();
    router = createTestRouter({ defaultRoute: 'a' });
    router.usePlugin(mobxPlugin(routerStore));
  });

  afterEach(function () {
    router.stop();
  });

  context('router', function () {
    it('should be registered', function () {
      expect(router.hasPlugin('MOBX_PLUGIN')).to.be.true;
    });
  });

  context('routerStore', function () {

    it('should add the router instance into the routerStore ', function () {
      expect(routerStore.router).to.equal(router);
    });

    it('should have observable properties `route` and `previousRoute` reflecting the navigation', () => {

      router.start('a', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g.i';
        navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.previousRoute.name).to.equal('a');
        expect(routerStore.previousRoute.name).to.equal(previousRoute.name);
        expect(routerStore.previousRoute.path).to.equal('/a');
        expect(routerStore.previousRoute.path).to.equal(previousRoute.path);

        expect(routerStore.route.name).to.equal('c.g.i');
        expect(routerStore.route.name).to.equal(nextRoute.name);
        expect(routerStore.route.path).to.equal('/c/g/i');
        expect(routerStore.route.path).to.equal(nextRoute.path);
      }

    });


    it('should have observable properties `params` reflecting the navigation', (done) => {

      let count = 0;
      let params = routerStore.route.params;

      // Assert also inside autorun.
      // This should run always before the assertFn
      let disposer = autorun(function () {

        if (count === 0) {
          count++;
        }
        else if (count === 1) {
          expect(params.get('param1')).to.equal('hello');
          expect(params.get('param2')).to.equal('there');
          count++;
        }
        else if (count === 2) {
          expect(params.get('param1')).to.equal('ok');
          expect(params.get('param2')).to.equal('yeah');
          count++;
        }
        else {
          expect(params.get('param1')).to.equal('good');
          expect(params.get('param2')).to.equal('bye');

          disposer();
        }
      });

      router.start('a', function () {
        const previousRoute = router.getState();
        const nextRoute = 'b';
        navigateTo(previousRoute, nextRoute, { param1: 'hello', param2: 'there' }, {}, gotoC);
      });

      function gotoC(previousRoute, route) {
        const oldRoute = route;
        navigateTo(oldRoute, 'c.d', { param1: 'ok', param2: 'yeah' }, {}, gotoCWithNewParams);
      }

      function gotoCWithNewParams(previousRoute, route) {
        const oldRoute = route;
        navigateTo(oldRoute, 'c.d', { param1: 'good', param2: 'bye' }, {}, assertFn);
      }

      function assertFn(previousRoute, route) {
        expect(previousRoute.params.param1).to.equal('ok');
        expect(previousRoute.params.param2).to.equal('yeah');

        expect(route.params.param1).to.equal('good');
        expect(route.params.param2).to.equal('bye');

        done(); // Tell mocha my test is done
      }
    });


    it('should have the correct intersection node for navigation: c.f -> c.g', () => {
      routerStore = new RouterStore();
      router = createTestRouter({ defaultRoute: 'c.f' });
      router.usePlugin(mobxPlugin(routerStore));

      router.start('c.f', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g';
        navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.intersectionNode).to.equal('c');
      }

    });

    it('should have the correct intersection node for navigation: b -> c.g.h', () => {
      routerStore = new RouterStore();
      router = createTestRouter({ defaultRoute: 'b' });
      router.usePlugin(mobxPlugin(routerStore));

      router.start('b', function () {
        const previousRoute = router.getState();
        const nextRouteName = 'c.g.h';
        navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
      });

      function assertFn(previousRoute, nextRoute) {
        expect(routerStore.intersectionNode).to.equal('');
      }
    });

  });

});
