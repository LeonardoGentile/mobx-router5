import { observable, action } from 'mobx';
import transitionPath from 'router5.transition-path';


const emptyRoute = {
  name: null,
  meta: null,
  path: null,
};

class RouterStore {

  @observable route = Object.assign({}, emptyRoute, {params: observable.map({})});
  @observable previousRoute = Object.assign({}, emptyRoute, {params: observable.map({})});
  @observable transitionRoute = Object.assign({}, emptyRoute, {params: observable.map({})});
  @observable transitionError = null;
  @observable intersectionNode = '';
  // @observable currentView;

  router = null;

  constructor() {
    this.navigate = this.navigate.bind(this);
  }

  setRouter(router) {
    this.router = router;
  }


  updateRoute(routeType, route) {
    const routeToUpdate = this[routeType];
    if (route) {
      Object.assign(routeToUpdate, {name: route.name, meta: route.meta, path: route.path});

      const routeParamsKeys = Object.keys(route.params);
      const observableParamsKeys = routeToUpdate.params.keys();

      // Remove all old params if new route has no params
      if (!routeParamsKeys.length) {
        routeToUpdate.params.clear();
      }
      // Remove old params that are not in the new route params
      else {
        const keysToDelete = observableParamsKeys.filter((i)=> routeParamsKeys.indexOf(i) < 0);
        for (const key of keysToDelete) {
          routeToUpdate.params.delete(key);
        }
      }
      // Update observable params
      routeToUpdate.params.merge(route.params);
    }
  }

  resetRoute(routeType) {
    const routeToUpdate = this[routeType];
    Object.assign(routeToUpdate, emptyRoute);
    routeToUpdate.params.clear();
  }

  //  ===========
  //  = ACTIONS =
  //  ===========
  // These are called by the plugin
  @action onTransitionStart = (route, previousRoute) => {
    this.updateRoute('transitionRoute', route);
    this.transitionError = null;
  };

  @action onTransitionSuccess = (route, previousRoute, opts) => {
    this.updateRoute('route', route);
    this.updateRoute('previousRoute', previousRoute);
    if (route && !opts.reload) {
      const { intersection } = transitionPath(route, previousRoute);
      this.intersectionNode = intersection;
    }
    this.clearErrors();
  };

  @action onTransitionCancel = (route, previousRoute) => {
    this.resetRoute('transitionRoute');
  };

  @action onTransitionError = (route, previousRoute, transitionError) => {
    this.updateRoute('transitionRoute', route);
    this.updateRoute('previousRoute', previousRoute);
    this.transitionError = transitionError;
  };

  // These can be called manually
  @action clearErrors = () => {
    this.resetRoute('transitionRoute');
    this.transitionError = null;
  };


  // Public API, we can manually call these router methods
  // Note: These are not actions because they don't directly modify the state

  // Just an alias
  navigate = (name, params, opts) => {
    this.router.navigate(name, params, opts);
  };

}

export default RouterStore;
