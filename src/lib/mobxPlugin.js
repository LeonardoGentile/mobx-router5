
// TODO
const defaultOptions = {};

function mobxPluginFactory(routerStore, options = defaultOptions) {

  function mobxPlugin(router, dependencies) {
    //TODO: here is a good place?
    router.setDependency('routerStore', routerStore);

    routerStore.setRouter(router);

    // Public API
    return {
      onTransitionStart(toState, fromState) {
        routerStore.onTransitionStart(toState, fromState);
      },
      onTransitionSuccess(toState, fromState) {
        routerStore.onTransitionSuccess(toState, fromState);
      },
      onTransitionCancel(toState, fromState){
        routerStore.onTransitionSuccess(toState, fromState);
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

