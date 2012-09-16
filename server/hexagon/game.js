var socket_io = require('socket.io'),
    yvents = require('yvents'),
    logic = require('./logic'),
    maps = require('./maps');


function Game (bus, id) {
    yvents.Base.call(this, bus);
    this.games = [];
};


yvents.subclass(Game, { prefix: 'game' }, {
    EVENTS: {
        after: ['game:create']
    },

    _afterGameCreate: function (e) {
        var id = this.games.length;
        console.log('game create', id);
        this.games.push(new HexagonGame(
            id, maps[0], e.players));
    }
});


function HexagonGame (id, map, players) {
    this.id = id;
    this.player1 = players[0];
    this.player2 = players[1];
    this._players = players;
    this.map = map;

    this.players(function (p) {
        this._bindPlayer(p);
    });

    this.players(function (p) {
        p.socket.emit('game:join', { id: id });
    });
};

HexagonGame.prototype = {

    players: function (callback) {
        var args = [],
            res = [];

        args[0] = this.player1;
        [].push.apply(args, Array.prototype.slice.call(arguments, 1));
        res.push(callback.apply(this, args));
        args[0] = this.player2;
        res.push(callback.apply(this, args));
        return res;
    },

    _bindPlayer: function (player) {

    },

    toJSON: function () {
        return {
            id: this.id,
            players: this.players(function (p) {
                return p.toJSON();
            }),
            map: this.map
        };
    }
};


module.exports = Game;
