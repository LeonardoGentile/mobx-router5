import {observable, action} from 'mobx';
import transitionPath from 'router5.transition-path';

class RouterStore {

  @observable.ref route = null;
  @observable.ref previousRoute = null;
  @observable.ref transitionRoute = null;
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
    this[routeType] = route;
  }

  resetRoute(routeType) {
    this[routeType] = null;
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
    if (route) {
      const {intersection} = transitionPath(route, previousRoute);
      this.intersectionNode = opts.reload ? '' : intersection;
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
