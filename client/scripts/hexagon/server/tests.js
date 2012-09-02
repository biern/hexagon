YUI.add('hexagon.server.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.server.tests'),
        utils = Y.Hexagon.utils;

    var suite = namespace.suite = new Y.Test.Suite({
        name: 'test remote server'
    });

    namespace.testHello = new Y.Test.Case({
        setUp: function () {
            this.server = new Y.Hexagon.server.SocketIO();
        },

        tearDown: function () {
            this.server.disconnect();
        },

        test: function () {
            this.server.on('response:test:hello', function (e, data) {
                this.resume(function () {
                    Y.Assert.areEqual(data.name, 'alice');
                });
            }, this);

            this.server.send('test:hello', {name: 'alice'});

            this.wait(3000);
        }
    });

    suite.add(namespace.testHello);

}, '0', {
    requires: [
        'hexagon.server.socketio',
        'test'
    ]
});
