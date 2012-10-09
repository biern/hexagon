var socket_io = require('socket.io'),
    yvents = require('yvents'),
    logic = require('./logic'),
    hexutils = require('./utils'),
    maps = require('./maps');


function Game (bus, id) {
    yvents.Base.call(this, bus);
    this.boards = [];
};


yvents.subclass(Game, { prefix: 'game' }, {
    EVENTS: {
        after: ['game:create', 'player.board:join']
    },

    _afterGameCreate: function (e) {
        var id = this.boards.length  + 1;

        this.boards.push(new Board(
            id, maps[0], e.players));
    },

    _afterPlayerBoardJoin: function (e) {
        var id = e.boardID,
            found = false;

        this.boards.every(function (board) {
            if (board.id == id) {
                found = board.joinPlayer(e.player);
                return false;
            }
            return true;
        });

        if (!found) {
            // TODO e.socket
            e.player.socket.emit('board:invalid', { baordID: id });
        }
    }
});


function Board (id, map, players) {
    this.id = id;

    // Limited to currently connected players
    this._players = players;

    // Names of players that take part in the game
    // this does not change on leave / join
    this._playersNames = this._players.map(function (p) { return p.username; });

    this.map = map;

    this._initState();

    // this.players(function (p) {
    //     this._bindPlayer(p);
    // });

    this.players(function (p) {
        p.socket.emit('board:join', { id: id });
    });

};

Board.prototype = {

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

        hexutils.fixStyles(this.state.playersStyles);
    },

    players: function (callback) {
        var args = [],
            res = [];

        args[0] = this._players[0];
        args[1] = 0;
        [].push.apply(args, Array.prototype.slice.call(arguments, 1));
        res.push(callback.apply(this, args));
        args[0] = this._players[1];
        args[1] = 1;
        res.push(callback.apply(this, args));
        return res;
    },

    // others: function (skip, callback) {
    //     this.players(function (p) {
    //         if (p != skip) {
    //             p.
    //         }
    //     });
    // },

    joinPlayer: function (player) {
        console.log('join player', player.username);
        if (this._playersNames.indexOf(player.username) != -1) {
            console.log('joined!');
            this._bindPlayer(player);
            return true;
        }
        return false;
    },

    _bindPlayer: function (player) {
        player.after('board:resync', this._afterPlayerBoardResync, this);
        player.after('board:move', this._afterPlayerBoardMove, this);
    },

    _afterPlayerBoardResync: function (e) {
        e.socket.emit('board:state', this.state);
    },

    _afterPlayerBoardMove: function (e) {
        console.log(e);
        console.log(e.type);
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
                    playerID: e.player.username
                });
            });
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
};


module.exports = Game;
