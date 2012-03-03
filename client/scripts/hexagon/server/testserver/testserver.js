YUI.add('hexagon.server.testserver', function (Y) {

    /**
     * Named 'testserver.js' instead of 'test.js' since it could be confused with unit tests
     */

    Y.namespace('Hexagon.server').Test = Y.Base.create('TestServer', Y.Base, [], {

        initializer: function () {
            this.after('sendRequested', this._afterSendRequested, this);
        },

        fakeResponse: function (name, data) {
            var prefix = 'response';

            this.fire(prefix + ':' + name, {
                prefix: prefix
            }, data);
        },

        send: function (name, data) {
            this.fire('sendRequested', {}, {
                    name: name,
                    data: data
                   });
        },

        _afterSendRequested: function (e, toSend) {
            console.log('sending: "' + toSend.name + '" with: ', toSend.data);
        }

    });

}, '0', {
    requires: ['base']
});
