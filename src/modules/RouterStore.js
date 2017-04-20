import { observable, action } from 'mobx';
import transitionPath from 'router5.transition-path';

class RouterStore {

  @observable route = null;
  @observable previousRoute = null;
  @observable transitionRoute = null;
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


  //  ===========
  //  = ACTIONS =
  //  ===========
  // These are called by the plugin
  @action onTransitionStart = (route, previousRoute) => {
    this.transitionRoute = route;
    this.transitionError = null;
  };

  @action onTransitionSuccess = (route, previousRoute, opts) => {

    this.route = route;
    this.previousRoute = previousRoute;
    if (route && !opts.reload) {
      const { intersection, toDeactivate } = transitionPath(route, previousRoute);
      this.intersectionNode = intersection;
    }
    this.clearErrors();
  };

  @action onTransitionCancel = (route, previousRoute) => {
    this.transitionRoute = '';
  };

  @action onTransitionError = (route, previousRoute, transitionError) => {
    this.transitionRoute = route;
    this.transitionError = transitionError;
  };

  // These can be called manually
  @action clearErrors = () => {
    this.transitionRoute = null;
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
