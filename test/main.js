const assert = require("assert");
const reduxActions = require("redux-actions");
const ReduxNamespace = require("../main");

var namespace;
var unNamespacedActions;
var namespacedActions;
var myReducer;
beforeEach(function() {
  namespace = new ReduxNamespace();
  otherNamespace = new ReduxNamespace();
  unNamespacedActions = reduxActions.createActions("FOO", "BAR");
  namespacedActions = namespace.actions(unNamespacedActions);
  myReducer = function(state) {
    if (state === undefined) {
      return "from undefined";
    }
    return !state;
  };
});
it("should add a namespace property to the meta object of namespaced actions", function() {
  assert.equal(unNamespacedActions.foo().meta, undefined);
  assert(namespacedActions.foo().meta.namespace);
});
it("should make reducers that ignore non-namespaced actions", function() {
  assert.equal(
    namespace.reducer(myReducer)(true, unNamespacedActions.foo()),
    true
  );
});
it("should reduce state + action from the same namespace", function() {
  assert.equal(
    namespace.reducer(myReducer)(true, namespacedActions.foo()),
    false
  );
});
it("should not reduce state + action from a different namespace", function() {
  assert.equal(
    otherNamespace.reducer(myReducer)(true, unNamespacedActions.foo()),
    true
  );
});
it("should reduce undefined when the state is undefined", function() {
  assert.equal(
    namespace.reducer(myReducer)(undefined, undefined),
    "from undefined"
  );
});
it("should return the state if the action doesnt match and the state is not undefined", function() {
  assert.equal(namespace.reducer(myReducer)("2barfoo", undefined), "2barfoo");
});
