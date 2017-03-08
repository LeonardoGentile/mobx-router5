import React, { Component, createElement } from 'react';
import { getDisplayName } from './utils';
import { observer, inject} from 'mobx-react';
import { autorun } from 'mobx';

function routeNode(nodeName) { // route node Name
  return function routeNodeWrapper(RouteSegment) { // component Name

    @inject('routerStore')
    @observer
    class RouteNode extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
          previousRoute: props.routerStore.previousRoute,
          route: props.routerStore.route,
          intersection: props.routerStore.intersection,
        };
      }

      componentDidMount() {
        // should I remove it when unmount?
        this.autorunDisposer = autorun(() => {
          this.setState({
            previousRoute: this.props.routerStore.previousRoute,
            route: this.props.routerStore.route,
            intersection: this.props.routerStore.intersection
          });
        });
      }

      componentWillUnmount() {
        this.autorunDisposer();
      }
      // Re-render the route-node (wrapped component) only if
      // it is the correct "transition node"
      shouldComponentUpdate (newProps, newState) {
        return (newState.intersection === nodeName);
      }

      render() {
        const { props } = this;
        const component = createElement(
          RouteSegment,
          { ...props }
        );

        return component;
      }
    }

    RouteNode.displayName = 'RouteNode[' + getDisplayName(RouteSegment) + ']';

    return RouteNode;
  };
}

export default routeNode;
