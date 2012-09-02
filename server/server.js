var util = require('util'),
    socket_io = require('socket.io'),
    yvents = require('yvents');


/**
 * Wrap socket.io Socket class to use YUI EventTarget instead of
 * standard node.js EventEmitter
 */
yvents.wrapEmitter(socket_io.Socket, {
    emitterFnName: '$emit'
});

/**
 * Patch socket.io.Socket to always include 'socket' in event data
 */
var socket_$emit = socket_io.Socket.prototype.$emit;

socket_io.Socket.prototype.$emit = function (name, data) {
    data = data || {};
    data.socket = this;
    return socket_$emit.apply(this, arguments);
};


function Server (bus) {
    this.bus = bus;
    this.addTarget(bus);
    this.on('socket:connect', this._bindSocket);
};

Server.prototype = {
    /**
     * Same args as in socket.io .listen()
     */
    listen: function () {
        var that = this,
            io = socket_io.listen.apply(this, arguments);

        this.io = io;
        // Create bus for client sent events
        this.bus.ns('client');

        io.sockets.on('connection', function (socket) {
            // client sent events do not leak to global bus
            that.fire('socket:connect', {
                socket: socket
            });

        });
    },

    _bindSocket: function (e) {
        var socket = e.socket,
            that = this;

        socket.addTarget(this.bus.client);

        // 'system' socket events are not propagated by default
        socket.on('disconnect', function () {
            that.fire('socket:disconnect', { socket: socket });
        });
    },

    _onSocketBroadcast: function (e) {
        if (e.socket) {
            e.socket.broadcast(e.msg, e.data);
        } else {
            io.sockets.emit(e.msg, e.data);
        }
    }
};

yvents.augment(Server, { prefix: 'server' });

module.exports = Server;
