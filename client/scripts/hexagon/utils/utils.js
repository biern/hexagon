YUI.add('hexagon.utils', function (Y) {

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

}, '0', {
    requires: ['test']
});
