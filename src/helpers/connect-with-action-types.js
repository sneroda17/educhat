import {connect} from "react-redux";
import {PropTypes} from "react";

const createActionsObject = (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, ownProps, stateProps, {actions: dispatchProps});

/*
 * A modified version of @connect that puts all the connected action creators under a single
 * "actions" object. It will also attempt to auto-generate propTypes for the action creators.
 * It cannot create individual propTypes for non-object mapDispatchToProps. It will just use
 * objectOf(func)
 * It uses mergeProps to create the actions object. You'll need to implement that behavior yourself
 * if you supply your own.
 */
const connectWithActionTypes = (mapStateToProps, mapDispatchToProps,
                                mergeProps = createActionsObject, options) =>
  target => {
    let actionsType = PropTypes.objectOf(PropTypes.func);
    // Can't auto-generate propTypes for dynamically generated actions.
    if (typeof mapDispatchToProps === "object") {
      const actionTypes = {};
      for (const action in mapDispatchToProps) if (mapDispatchToProps.hasOwnProperty(action)) {
        actionTypes[action] = PropTypes.func.isRequired;
      }
      actionsType = PropTypes.shape(actionTypes);
    }

    target.propTypes =
      Object.assign(target.propTypes || {}, {actions: actionsType});

    return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(target);
  };
export default connectWithActionTypes;
