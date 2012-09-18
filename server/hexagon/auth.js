var util = require('util'),
    yvents = require('yvents');


var loggedIn = {},
    lastId = 0;


function Player (bus, data) {
    yvents.Base.call(this, bus);

    this.extend(data);
    this.addBubbleArgs({ player: this });
    this.socket.addTarget(this);
    this.addTarget(bus.ns('player'));
};


yvents.subclass(Player, { prefix: 'player' }, {
    username: null,
    socket: null,
    id: 0,

    toJSON: function () {
        return {
            id: this.id,
            username: this.username,
            style: this.style
        };
    }
});


function Auth (bus) {
    yvents.Base.call(this, bus);
    this._bus = bus;
};

yvents.subclass(Auth, { prefix: 'auth' }, {
    EVENTS: {
        // on: ['auth:success'],
        after: ['socket:disconnect',
                'client.auth:request'],

        fires: ['auth:success', 'auth:fail'],
        sends: ['auth:login']
    },

    _afterClientAuthRequest: function (e) {
        if (this.logIn(e.socket, e.username)) {
            var player = this._createPlayer(e.username, e.socket);

            this.fire('auth:success', { player: player, socket: e.socket });
            e.socket.emit('auth:login', {
                success: true,
                // TODO: Zamiast tego jakiś prepare, czy coś?
                player: player.toJSON()
            });
        } else {
            this.fire('auth:fail', { socket: e.socket });
            e.socket.emit('auth:login', {
                success: false
            });
        }
    },

    _afterSocketDisconnect: function (e) {
        this.logOut(e.socket);
    },

    logIn: function (socket, username) {
        if (!loggedIn[username]) {
            // TODO: Check if not already logged in
            console.log('logged in ' + username);
            loggedIn[username] = socket;

            return true;
        }
        return false;
    },

    logOut: function (socket) {
        var key, player;

        for (key in loggedIn) {
            if (loggedIn[key] === socket) {
                player = loggedIn[key];
                this.fire('auth:disconnect', { player: player });
                delete loggedIn[key];
                console.log('logged out ' + key);
                return;
            }
        }
    },

    _createPlayer: function (username, socket) {
        // TODO: ważne: Czy socket u playera jest potrzebny?
        var player = new Player(this._bus, {
            id: ++lastId,
            username: username,
            socket: socket,
            style: ['orange', 'purple'][parseInt(Math.random() * 2)]
        });

        player.fire('player:created', { player: player });
        return player;
    }
});

module.exports = Auth;
