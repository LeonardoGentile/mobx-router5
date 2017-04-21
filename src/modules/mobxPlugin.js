
// TODO
const defaultOptions = {};

function mobxPluginFactory(routerStore, options = defaultOptions) {

  function mobxPlugin(router, dependencies) {

    // NOTE: cross-referencing objects
    router.setDependency('routerStore', routerStore);
    routerStore.setRouter(router);

    // Implemented methods
    return {
      onTransitionStart(toState, fromState) {
        routerStore.onTransitionStart(toState, fromState);
      },
      onTransitionSuccess(toState, fromState, opts) {
        routerStore.onTransitionSuccess(toState, fromState);
      },
      onTransitionCancel(toState, fromState){
        routerStore.onTransitionCancel(toState, fromState);
      },
      onTransitionError(toState, fromState, err) {
        routerStore.onTransitionError(toState, fromState, err);
      }
    };
  }

  mobxPlugin.pluginName = 'MOBX_PLUGIN';

  return mobxPlugin;
}

export default mobxPluginFactory;

