[![Build Status](https://travis-ci.org/LeonardoGentile/mobx-router5.svg?branch=master)](https://travis-ci.org/LeonardoGentile/mobx-router5)
[![Coverage Status](https://coveralls.io/repos/github/LeonardoGentile/mobx-router5/badge.svg?branch=master)](https://coveralls.io/github/LeonardoGentile/mobx-router5?branch=master)
[![license](https://img.shields.io/github/license/LeonardoGentile/mobx-router5.svg)](https://github.com/LeonardoGentile/mobx-router5/blob/master/LICENSE.txt)
[![npm](https://img.shields.io/npm/v/mobx-router5.svg)](https://www.npmjs.com/package/mobx-router5)


# mobx-router5

> [Router5](https://router5.js.org/) integration with [mobx](https://mobx.js.org/). If you develop with React, use this package with __[react-mobx-router5](https://github.com/LeonardoGentile/react-mobx-router5)__. This plugin represents the source of truth for the @observer components exposed by react-mobx-router5.  
This plugin can also be used standalone together with mobx. 

## Requirements

- __router5 >= 6.1.2__
- __mobx >= 4.0.0__
 
These are considered `peerDependencies` that means they should exist in your installation, you should install them yourself to make this plugin work. The package won't install them as dependencies. 

## Install

```bash
npm install mobx-router5
```


## How it works
Before using this plugin it is necessary that you understand how [router5 works](http://router5.github.io/docs/understanding-router5.html).  

Whenever you performs a router5's transition from one state to another and that transition is *started*, *canceled*, it's *successful* or it has a transition *error* 
this plugin exposes all this info as [mobx observables references](https://mobx.js.org/refguide/observable.html) properties of the `RouterStore` class.   
You can then use the mobx API to **observe** and react to these **observables**:

```javascript
@observable.ref route; // Current Route - Object  
@observable.ref previousRoute; // Object
@observable.ref transitionRoute; // Object
@observable.ref transitionError; // Object
@observable.ref intersectionNode; // String
@observable.ref canActivate; // Array
@observable.ref canDeactivate; // Array

```


## How to use

- Create a router **store** instance from the `RouterStore` class 
- Create and configure a **router** instance
- Add the **plugin** to the router instance, **passing the store to the plugin**
- Use the store methods to perform routing or use your router instance directly
  - The only (non-action) method provided is `navigate` that is just an alias for router5 `navigate`
- **Observe** the observable properties exposed by the store 

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
    .usePlugin(mobxPlugin(routerStore)) // Important: pass the store to the plugin!
    .usePlugin(browserPlugin({useHash: true}));
  
  if (useLoggerPlugin) {
    router.usePlugin(loggerPlugin) ;
  }
  
  return router;
}
```

## RouterStore

The core idea of this little plugin is the router store.    
The plugin will automatically call the actions (in fact mobx `@action`s) exposed by the store.  
By default you can just import the class `RouterStore`, create a new instance, pass it to the plugin and just use it.


### Actions
On route transition Start/Success/Cancel/Error the *mobxPlugin* invokes automatically these mobx actions exposed by the `RouterStore`:

- `onTransitionStart(toState, fromState)`
	- set the `transitionRoute`
	- clear the `transitionError` 
- `onTransitionSuccess(toState, fromState, opts)`
	- set the `route`, `previousRoute`, `canActivate`, `canDeactivate` and `interserctionNode`
	- also calls the `clearErrors()` action 
- `onTransitionCancel(toState, fromState)` 
	- reset the `transitionRoute`
- `onTransitionError(toState, fromState, err)`
	- set the `transitionRoute`, `previousRoute` and `transitionError` 


Normally it's **not necessary** to *manually* call these actions, the plugin will do it for us.   
  
The only one probably worth calling manually (only when necessary) is `clearErrors()`: it resets the `transitionRoute` and `transitionError`.

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

### Contributing
Please refer to the CONTRIBUTING.md file.  
Please notice that this would require node >=8 as some dev packages require it (for example semantic-release) 

## Acknowledgments

- The structure and build process of this repo are based on [babel-starter-kit](https://github.com/kriasoft/babel-starter-kit)   
- I've taken the [redux-router5](https://github.com/router5/redux-router5) plugin as example for developing this one
- Thanks to egghead.io for the nice tips about open source development on their [free course](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) 
- Special thanks to [Thomas Roch](https://github.com/troch) for the awesome [router5](https://github.com/router5/router5) ecosystem
 

