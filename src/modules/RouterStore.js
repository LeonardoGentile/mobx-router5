import { observable, action } from 'mobx';
import transitionPath from 'router5.transition-path';

class RouterStore {

  @observable route = null;
  @observable previousRoute = null;
  @observable transitionRoute = null;
  @observable transitionError = null;
  @observable intersection = '';
  // @observable currentView;

  router = null;

  constructor() {
    this.navigateTo = this.navigateTo.bind(this);
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

  @action onTransitionSuccess = (route, previousRoute) => {
    this.route = route;
    this.previousRoute = previousRoute;
    this.intersection = route ? transitionPath(route, previousRoute).intersection : '';
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
  navigateTo = (name, params, opts) => {
    this.router.navigate(name, params, opts);
  };

  cancelTransition = () => {
    this.router.cancel();
  };

  canDeactivate = (name, canDeactivate) => {
    this.router.canDeactivate(name, canDeactivate);
  };

  canActivate = (name, canActivate) => {
    this.router.canDeactivate(name, canActivate);
  };

  isActive = (name, params, activeStrict=false, ignoreQueryParams=false) => {
    this.router.isActive(name, params, activeStrict, ignoreQueryParams);
  };




}

export default RouterStore;
