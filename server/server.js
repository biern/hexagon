var util = require('util'),
    socket_io = require('socket.io'),
    yvents = require('yvents'),
    EventBus = require('./hexagon/bus');


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


// function ClientNS (bus, io) {
//     this.bus = bus;
//     this.io = io;
//     EventBus.call(this);
// };


// util.inherits(ClientNS, EventBus);


// ClientNS.prototype.room = function (name) {
//     if (this.bus.client[name]) {
//         return this.bus.client[name];
//     } else {
//         return this.bus.client.ns(name, new Room(this.bus, this.io, name));
//     }
// };


// function Room (bus, io, name) {
//     yvents.Base.call(this);

//     this.room = io.sockets.in(name);
//     this.name = name;

//     this.publish('auth:request', { emitFacade: true });
//     // this.extra = Array.prototype.slice.call(arguments, 3);
//     // console.log(this.extra);

//     this.bus = bus;
//     this.bus.on('socket:disconnect', this._onSocketDisconnect, this);
// };

// yvents.subclass(Room, {}, {
//     /**
//      * Extra per socket args appended to each event in room
//      */
//     _extraArgs: {

//     },

//     /**
//      * TODO
//      */
//     join: function (socket) {
//         this._extraArgs[socket.id] = Array.prototype.slice.call(arguments, 1);
//         console.log(this._extraArgs);

//         socket.addTarget(this);
//         socket.join(this.room);
//         this.bus.fire('room:join', {
//             room: this,
//             name: this.name,
//             socket: socket
//         });
//     },

//     leave: function (socket) {
//         delete this._extraArgs[socket.id];

//         socket.removeTarget(this);
//         socket.leave(this.room);
//     },

//     emit: function (eventName, data) {
//         this.room.emit(eventName, data);
//     },

//     broadcast: function (socket, eventName, data) {
//         socket.broadcast.to(this.name).emit(eventName, data);
//     },

//     notify: function (args, ce) {
//         console.log(args, ce);
//         this.prototype.notify.apply(this, arguments);
//     },

//     _onSocketDisconnect: function (e) {
//         this.leave(e.socket);
//     }
// });


// Room.prototype.fire = function (eventName, data) {
//     console.log('fire!', eventName);
//     yvents.EventTarget.prototype.fire.apply(this, arguments);
// };




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

        // Create bus for client sent events
        // this.bus.ns('client', new ClientNS(this.bus, io));
        // this.bus.client.room('test');
        // this.bus.client.room('auth');

        this.bus.ns('client');

        io.sockets.on('connection', function (socket) {
            // client sent events do not leak to global bus
            that.fire('socket:connect', {
                socket: socket
            });

            // Testing player
            that.bus.client.on('auth:request', function (data) {
                console.log('witaj', data.username);
            });

            that.bus.ns('player').on('auth:request', function (data) {
                console.log('już jesteś zalogowany głuptasie');
            });

            // // Testing room
            // that.bus.client.test.join(socket);
            // that.bus.client.test.on('auth:request', function (data) {
            //     console.log('witaj w pokoju', data.username);
            // });

            // that.bus.client.test.on('test signal', function (e, data) {
            //     console.log('test signal', data);
            // });

            // socket.emit('test signal', 'socket emit');
            // socket.fire('test signal', 'socket fire');

            // // To niżej nie działa
            // that.bus.client.test.emit('test signal', 'room emit');
            // that.bus.client.test.fire('test signal', 'room fire');

            // // // setTimeout(function () {
            // // //     that.bus.client.test.leave(socket);
            // // // }, 5000);
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
