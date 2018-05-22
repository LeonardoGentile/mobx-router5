declare module "mobx-router5" {
    import {PluginFactory} from "router5/core/plugins";

    class RouterStore {
        public navigate: (toRoute: string, params?: any) => void;
    }

    function mobxPlugin(router: any): PluginFactory;

    namespace RouterStore {}
    namespace mobxPlugin {}

    export {
        RouterStore,
        mobxPlugin,
    };
}