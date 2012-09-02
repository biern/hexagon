YUI.add('hexagon.server.socketio', function (Y) {

    Y.namespace('Hexagon.server').SocketIO = Y.Base.create('SocketIOServer', Y.Base, [], {

        initializer: function () {
            var $emit, that = this;

            this._socket = io.connect(this.get('url'));

            // hacking sockets, move on...
            $emit = this._socket.$emit;
            this._socket.$emit = function (eventType, data) {
                that._onSocketMessage(eventType, data);
                $emit.call(this, arguments);
            };

            this._socket.on('anything', function (data) {
                console.log('anything', data);
            });
            this._socket.on('message', function (data) {
                console.log('message', data);
            });
            // this._socket.on('anything', Y.bind(this._onSocketMessage, this));
        },

        _wrapSocketEmit: function (socket) {

        },

        _onSocketMessage: function (name, data) {
            var prefix = 'response';

            this.fire(prefix + ':' + name, {
                prefix: prefix
            }, data);
        },

        send: function (name, data) {
            this._socket.emit(name, data);
        },

        disconnect: function () {
            this._socket.disconnect();
        }

    }, {
        ATTRS: {
            url: {
                writeOnce: 'initOnly',
                value: 'http://localhost:12345'
            }
        }
    });

}, '0', {
    requires: ['base']
});
