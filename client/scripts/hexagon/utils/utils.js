YUI.add('hexagon.utils', function (Y) {

    // TODO: Think about separating this module

    var namespace = Y.namespace('Hexagon.utils');

    namespace.assertFired = function (func, obj, name, handler) {
        var fired = false;
        handler = handler || function () {};
        var _handler = function () {
            fired = true;
            handler.apply(this, arguments);
        };
        var sub = obj.once(name, _handler, this);

        func();
        sub.detach();
        Y.Assert.isTrue(fired, 'Event ' + name + ' did not fire');
    };

    /**
     * Asserts that object contains all params (contains keys with equal values)
     */
    namespace.assertObjectParams = function (obj, params) {
        for (k in params) {
            Y.Assert.areSame(obj[k], params[k]);
        }
    };

}, '0', {
    requires: ['test']
});
