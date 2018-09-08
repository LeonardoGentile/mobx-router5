import {State} from "router5";
import {IComputedValue} from "mobx/lib/core/computedvalue";
import {Route, Router} from "router5/create-router";
import {Options} from "router5/core/navigation";
import {PluginFactory} from "router5/core/plugins";
import {Params} from "router5";

declare module "mobx-router5" {
  export class RouterStore {
    public router: Router;
    public route: Route;
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
    public onTransitionSuccess: (route: Route, previousRoute: Route, opts: Options) => void;
    public onTransitionCancel: (route: Route, previousRoute: Route) => void;
    public onTransitionError: (route: Route, previousRoute: Route, transitionError: any) => void;
    public clearErrors: () => void;
    public navigate: (toRoute: string, params?: Params) => void;
    public shouldUpdateNodeFactory: (nodeName: string) => IComputedValue<(toState: State, fromState?: State) => Boolean>;
  }

  export function mobxPlugin(routerStore: RouterStore): PluginFactory;
}

