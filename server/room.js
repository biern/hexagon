var util = require('util'),
    yvents = require('yvents'),
    EventBus = require('./hexagon/bus');


function ClientNS (bus, io) {
    this.bus = bus;
    this.io = io;
    EventBus.call(this);
};


util.inherits(ClientNS, EventBus);


ClientNS.prototype.room = function (name) {
    if (this.bus.client[name]) {
        return this.bus.client[name];
    } else {
        return this.bus.client.ns(name, new Room(this.bus, this.io, name));
    }
};


function Room (bus, io, name) {
    yvents.Base.call(this);

    this.room = io.sockets.in(name);
    this.name = name;

    this.publish('auth:request', { emitFacade: true });
    // this.extra = Array.prototype.slice.call(arguments, 3);
    // console.log(this.extra);

    this.bus = bus;
    this.bus.on('socket:disconnect', this._onSocketDisconnect, this);
};

yvents.subclass(Room, {}, {
    /**
     * Extra per socket args appended to each event in room
     */
    _extraArgs: {

    },

    /**
     * TODO
     */
    join: function (socket) {
        this._extraArgs[socket.id] = Array.prototype.slice.call(arguments, 1);
        console.log(this._extraArgs);

        socket.addTarget(this);
        socket.join(this.room);
        this.bus.fire('room:join', {
            room: this,
            name: this.name,
            socket: socket
        });
    },

    leave: function (socket) {
        delete this._extraArgs[socket.id];

        socket.removeTarget(this);
        socket.leave(this.room);
    },

    emit: function (eventName, data) {
        this.room.emit(eventName, data);
    },

    broadcast: function (socket, eventName, data) {
        socket.broadcast.to(this.name).emit(eventName, data);
    },

    notify: function (args, ce) {
        console.log(args, ce);
        this.prototype.notify.apply(this, arguments);
    },

    _onSocketDisconnect: function (e) {
        this.leave(e.socket);
    }
});


Room.prototype.fire = function (eventName, data) {
    console.log('fire!', eventName);
    yvents.EventTarget.prototype.fire.apply(this, arguments);
};
