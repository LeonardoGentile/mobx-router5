import React, { Component, createElement } from 'react';
import { getDisplayName } from './utils';
import { autorun } from 'mobx';
import { inject} from 'mobx-react';

//TODO: create another wrapper function to pass a custom store name
function routeNode(nodeName) { // route node Name
  return function routeNodeWrapper(RouteSegment) { // component Name

    @inject('routerStore')
    class RouteNode extends Component {

      constructor(props, context) {
        super(props, context);
        this.state = {
          route: props.routerStore.route,
          intersection: props.routerStore.intersection,
        };
      }

      componentDidMount() {
        this.autorunDisposer = autorun(() => {
          this.setState({
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
