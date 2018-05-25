import {State} from "router5";
import {IComputedValue} from "mobx/lib/core/computedvalue";
import {Route, Router} from "router5/create-router";

declare module "mobx-router5" {
  import {PluginFactory} from "router5/core/plugins";
  import {Params} from "router5";

  class RouterStore {
    public router: Router;
    public previousRoute: Route;
    public transitionRoute: Route;
    public transitionError: any;
    public intersectionNode: string;
    // public toActivate: IObservableArray<any>;
    // public toDeactivate: IObservableArray<any>;

    public setRouter: (router: Router) => void;
    public updateRoute: (routeType: string, route: Route) => void;
    public resetRoute: (routeType: string) => void;
    public onTransitionStart: (route: Route, previousRoute: Route) => void;
    public onTransitionSuccess: (route: Route, previousRoute: Route, opts) => void;
    public onTransitionCancel: (route: Route, previousRoute: Route) => void;
    public onTransitionError: (route: Route, previousRoute: Route, transitionError: any) => void;
    public clearErrors: () => void;
    public navigate: (toRoute: string, params?: Params) => void;
    public shouldUpdateNodeFactory: (nodeName) => IComputedValue<(toState: State, fromState?: State) => Boolean>;
  }

  function mobxPlugin(routerStore: RouterStore): PluginFactory;

  namespace RouterStore {}
  namespace mobxPlugin {}

  export {
    RouterStore,
    mobxPlugin,
  };
}
