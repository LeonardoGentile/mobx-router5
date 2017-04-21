
# mobx-router5

> Router5 integration with [mobx](https://mobx.js.org/). If you develop with React, use this package with __[react-mobx](https://github.com/mobxjs/mobx-react)__
and __[react-mobx-router5](https://github.com/LeonardoGentile/react-mobx-router5)__. Using react-mobx-router5 removes the need to use react-router5 (which use _router5-listeners_). In short this plugin represents the source of truth for the @observer components exposed by react-mobx-router5.  
This plugin can also be used as standalone together with mobx.

## Requirements

- __router5 >= 4.0.0__
- __mobx >= 3.1.0__
 

## How to use

- Create the mobx router store 
- Create and configure a router instance
- Add the plugin to the router instance, passing the store to the plugin
- Use the store methods to perform routing or use your router instance directly
  - The only (non-action) method provided is `navigate` that is just an alias for router5 `navigate`
- Observe the properties exposed by the store 

```javascript
import {createRouter} from 'router5';
import loggerPlugin from 'router5/plugins/logger'; 
import browserPlugin from 'router5/plugins/browser';
import routes from './routes';
import {mobxPlugin, RouterStore} from 'mobx-router5';

// Instantiate it directly or extend the class as you wish before invoking new
const routerStore = new RouterStore();
  
export default function configureRouter(useLoggerPlugin = false) {
  const router = createRouter(routes, {defaultRoute: 'home'})
    // Plugins
    .usePlugin(mobxPlugin(routerStore))
    .usePlugin(browserPlugin({useHash: true}));
  
  if (useLoggerPlugin) {
    router.usePlugin(loggerPlugin) ;
  }
  
  return router;
}
```

## Store

The core idea of this little plugin is the router store.    
The plugin will automatically call the actions (in fact mobx `@action`s) exposed by the store.  
By default you can just import the class `RouterStore`, create a new instance, pass it to the plugin and just use it.


### Actions
On router transition Start/Success/Cancel/Error the mobxPlugin invokes automatically these mobx actions exposed by the `RouterStore` instance:

- `onTransitionStart(toState, fromState)`
- `onTransitionSuccess(toState, fromState, opts)`
  - also calls the `clearErrors()` action 
- `onTransitionCancel(toState, fromState)` 
- `onTransitionError(toState, fromState, err)`

This ensures that these observables within the store are always up-to-date with the current state:

- @observable route 
- @observable previousRoute
- @observable transitionRoute
- @observable transitionError
- @observable intersectionNode

Normally it's not necessary to call *manually* most of the store's actions, the plugin will do it for us. The only one probably worth calling manually is `clearErrors()`. 

### Router instance reference inside the store

When you add the plugin to the router with 

```
router.usePlugin(mobxPlugin(routerStore))
``` 

the router reference is added to the store, so that you can call all the router's methods from the store itself, for example:   

```
routerStore.router.navigate('home', {}, {})
``` 
and all other router5's API [listed here](http://router5.github.io/docs/api-reference.html).

### Store reference inside the router's dependencies
The plugin also adds the `routerStore` (the instance) to the router dependencies with 

```
router.setDependency('routerStore', routerStore);
```   
That means that you can access your store from router5's lifecycle methods (canActivate, canDeactivate), middleware or plugins, see [router5 docs](http://router5.github.io/docs/injectables.html) on this topic.

This creates indeed a cross referece, that is, the store has a reference of the router and the router has a reference of the store. In most cases this should not create any trouble but be aware of this for cases I haven't foreseen.

### Your own store
If you know what you are doing you can subclass or create yor own store, making sure you implement at least the actions listed above and a `setRouter(router)` method.
