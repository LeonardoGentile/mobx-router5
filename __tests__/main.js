import { createRouter } from 'router5';
import { autorun } from 'mobx';
import RouterStore from '../src/modules/RouterStore';
import mobxPlugin from '../src/modules/mobxPlugin';



const routes = [
  { name: 'a', path: '/a' },
  { name: 'b', path: '/b?param1&param2' },
  { name: 'c', path: '/c', children: [
    { name: 'd', path: '/d?param1&param2', },
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


describe('mobxPlugin', () => {
  let router;
  let routerStore;

  function navigateTo(previousRoute, nextRouteName, routeParams, routeOptions, done) {
    router.navigate(nextRouteName, routeParams, routeOptions, function () {
      const nextRoute = router.getState();
      done(previousRoute, nextRoute);
    });
  }

  beforeEach(() => {
    routerStore = new RouterStore();
    router = createTestRouter({defaultRoute: 'a'});
    router.usePlugin(mobxPlugin(routerStore));
  });

  afterEach(() => {
    router.stop();
  });

  describe('router', () => {
    test('should be registered', () => {
      expect(router.hasPlugin('MOBX_PLUGIN')).toBe(true);
    });
  });

  describe('routerStore', () => {

    test('should add the router instance into the routerStore ', () => {
      expect(routerStore.router).toBe(router);
    });

    test(
      'should have observable properties `route` and `previousRoute` reflecting the navigation',
      () => {

        router.start('a', function () {
          const previousRoute = router.getState();
          const nextRouteName = 'c.g.i';
          navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
        });

        function assertFn(previousRoute, nextRoute) {
          expect(routerStore.previousRoute.name).toBe('a');
          expect(routerStore.previousRoute.name).toBe(previousRoute.name);
          expect(routerStore.previousRoute.path).toBe('/a');
          expect(routerStore.previousRoute.path).toBe(previousRoute.path);

          expect(routerStore.route.name).toBe('c.g.i');
          expect(routerStore.route.name).toBe(nextRoute.name);
          expect(routerStore.route.path).toBe('/c/g/i');
          expect(routerStore.route.path).toBe(nextRoute.path);
        }

      }
    );


    test(
      'should have observable properties `params` reflecting the navigation',
      (done) => {

        let count = 0;
        // assert inside autorun
        let disposer = autorun(function () {
          let route = routerStore.route;
          if (route) {
            let params = routerStore.route.params;
            if (count === 0) {
              count++;
            }
            else if (count === 1) {
              expect(params.param1).toBe('hello');
              expect(params.param2).toBe('there');
              count++;
            }
            else if (count === 2) {
              expect(params.param1).toBe('ok');
              expect(params.param2).toBe('yeah');
              count++;
            }
            else {
              expect(params.param1).toBe('good');
              expect(params.param2).toBe('bye');

              disposer();

              done(); // Tell Jest my test is done
            }
          }
        });

        router.start('a', function () {
          const previousRoute = router.getState();
          const nextRoute = 'b';
          navigateTo(previousRoute, nextRoute, {param1: 'hello', param2: 'there'}, {}, gotoC);
        });

        function gotoC(previousRoute, nextRoute) {
          const oldRoute = router.getState();
          navigateTo(oldRoute, 'c.d', {param1: 'ok', param2: 'yeah'}, {}, gotoCWithNewParams);
        }

        function gotoCWithNewParams(previousRoute, nextRoute) {
          const oldRoute = router.getState();
          navigateTo(oldRoute, 'c.d', {param1: 'good', param2: 'bye'}, {}, assertFn);
        }

        function assertFn(previousRoute, nextRoute) {
          expect(routerStore.previousRoute.params.param1).toBe('ok');
          expect(routerStore.previousRoute.params.param2).toBe('yeah');

          expect(routerStore.route.params.param1).toBe('good');
          expect(routerStore.route.params.param2).toBe('bye');

        }
      }
    );


    test(
      'should have the correct intersection node for navigation: c.f -> c.g',
      () => {
        routerStore = new RouterStore();
        router = createTestRouter({defaultRoute: 'c.f'});
        router.usePlugin(mobxPlugin(routerStore));

        router.start('c.f', function () {
          const previousRoute = router.getState();
          const nextRouteName = 'c.g';
          navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
        });

        function assertFn(previousRoute, nextRoute) {
          expect(routerStore.intersectionNode).toBe('c');
        }

      }
    );

    test(
      'should have the correct intersection node for navigation: b -> c.g.h',
      () => {
        routerStore = new RouterStore();
        router = createTestRouter({defaultRoute: 'b'});
        router.usePlugin(mobxPlugin(routerStore));

        router.start('b', function () {
          const previousRoute = router.getState();
          const nextRouteName = 'c.g.h';
          navigateTo(previousRoute, nextRouteName, {}, {}, assertFn);
        });

        function assertFn(previousRoute, nextRoute) {
          expect(routerStore.intersectionNode).toBe('');
        }
      }
    );

  });

});
