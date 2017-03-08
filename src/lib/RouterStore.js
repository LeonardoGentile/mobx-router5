import {observable, computed, action, toJS} from 'mobx';
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
  // These 3 are called by the plugin
  @action onTransitionStart = (route, previousRoute) => {
    this.transitionRoute = route;
    this.transitionError = null;
  };

  @action onTransitionSuccess = (route, previousRoute) => {
    this.route = route;
    this.previousRoute = previousRoute;
    this.transitionRoute = null;
    this.transitionError = null;
    this.intersection = route ? transitionPath(route, previousRoute).intersection : '';
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


  // OPTIONAL methods
  // Only if we set .usePlugin(mobxPlugin(routerStore, {storeNavigation: true}))
  // Otherwise we could use RouterProvider from router5-react
  // TODO, they should throw an error if this.router is not defined
  @action navigateTo = (name, params, opts) => {
    this.router.navigate(name, params, opts);
  };

  @action cancelTransition = () => {
    this.router.cancel();
  };

  @action canDeactivate = (name, canDeactivate) => {
    this.router.canDeactivate(name, canDeactivate);
  };

  @action canActivate = (name, canActivate) => {
    this.router.canDeactivate(name, canActivate);
  };


}

export default RouterStore;
