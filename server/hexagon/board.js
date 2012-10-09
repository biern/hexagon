var socket_io = require('socket.io'),
    yvents = require('yvents'),
    logic = require('./logic'),
    hexutils = require('./utils'),
    maps = require('./maps');


var lastId = 0;

/**
 * Board - single game instance
 */
function Board (bus, map, players) {
    yvents.Base.call(this, bus);
    this.addTarget(bus);

    this.id = (lastId += 1);

    // Limited to currently connected players
    this._players = players;

    // Names of players that take part in the game
    // this does not change on leave / join
    this._playersNames = this._players.map(function (p) { return p.username; });

    this.map = map;

    this._initState();

    players.forEach(function (p) {
        this._bindPlayer(p);
        p.socket.emit('board:join', { id: this.id });
    }, this);

};


yvents.subclass(Board, { prefix: 'board' }, {

    EVENTS: {
        after: ['auth:logOut']
    },

    _initState: function () {
        var playersMap = {},
            playersStyles = {};

        this.players(function (p, i) {
            // TODO: indeksowanie od 0?
            playersMap[p.username] = i + 1;
            playersStyles[p.username] = p.style;
        });

        this.state = logic.decompressState(
            this.map.board, playersMap);

        this.state.activePlayerID = this._players[0].username;
        this.state.allPlayers = this._playersNames;
        this.state.playersStyles = playersStyles;
        this.state.boardID = this.id;

        hexutils.fixStyles(this.state.playersStyles);
    },

    players: function (callback) {
        var args = [],
            res = [];

        args[0] = this._players[0];
        args[1] = 0;
        [].push.apply(args, Array.prototype.slice.call(arguments, 1));
        if (args[0]) {
            res.push(callback.apply(this, args));
        }
        args[0] = this._players[1];
        args[1] = 1;
        if (args[0]) {
            res.push(callback.apply(this, args));
        }
        return res;
    },

    // others: function (skip, callback) {
    //     this.players(function (p) {
    //         if (p != skip) {
    //             p.
    //         }
    //     });
    // },

    playerJoined: function (player) {
        var exists = false;

        console.log('join player', player.username);

        if (this._playersNames.indexOf(player.username) != -1) {

            this.players(function (p) {
                console.log(p);
                if (p.id === player.id) {
                    exists = true;
                }
            });

            if (!exists) {
                console.log('joined!');
                this._players.push(player);
                this._bindPlayer(player);
                return true;
            }
        }
        return false;
    },

    playerLeft: function (player) {
        console.log('board ' + this.id + 'leave ' + player.username);
        this._players.remove(player);
        console.log('players left: ' + this._players.length);
        if (!this._players.length) {
            this.fire('board:allPlayersLeft');
        }
    },

    unbind: function () {
        this.removeTarget(this.bus);
    },

    _bindPlayer: function (player) {
        player.after('board:resync', this._afterPlayerBoardResync, this);
        player.after('board:move', this._afterPlayerBoardMove, this);
    },

    _afterPlayerBoardResync: function (e) {
        if (e.boardID != this.id) {
            return;
        }
        e.socket.emit('board:state', this.state);
    },

    _afterPlayerBoardMove: function (e) {
        if (e.boardID != this.id) {
            return;
        }

        var move = e;

        if (logic.performMove(this.state, move)) {
            this.players(function (p) {

                if (p.socket.id == e.socket.id) {
                    return;
                }

                p.socket.emit('board:move', {
                    type: move.type,
                    from: move.from,
                    to: move.to,
                    playerID: e.player.username,
                    boardID: this.id
                });
            });
        }
    },

    _afterAuthLogOut: function (e) {
        this.playerLeft(e.player);
    },

    checkEmpty: function () {
        if (!this._players.length) {

        }
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
});


module.exports = Board;
