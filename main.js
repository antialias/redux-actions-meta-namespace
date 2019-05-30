var nanoid = require("nanoid");

function ReduxNamespace() {
  this.namespace = nanoid();
}
ReduxNamespace.prototype.actions = function(actionMap) {
  var namespace = this.namespace;
  return Object.keys(actionMap).reduce(function(memo, key) {
    var creator = actionMap[key];
    var actionMapEntry = {};
    actionMapEntry[key] = function(payload) {
      var action = creator(payload);
      return Object.assign({}, action, {
        meta: Object.assign({}, action.meta, { namespace: namespace })
      });
    };
    return Object.assign({}, memo, actionMapEntry);
  }, {});
};
ReduxNamespace.prototype.reducer = function(reducer) {
  const namespace = this.namespace;
  return function(state, action) {
    if (
      action &&
      action.meta &&
      action.meta.namespace &&
      action.meta.namespace === namespace
    ) {
      return reducer(state, action);
    }
    if (undefined === state) {
      return reducer(undefined, {});
    }
    return state;
  };
};
module.exports = ReduxNamespace;
