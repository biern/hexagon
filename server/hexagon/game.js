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
        console.log(e);
        var id = e.boardID,
            found = false;

        this.boards.every(function (board) {
            if (board.id == id) {
                board.joinPlayer(e.player);
                found = true;
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

    this.players(function (p) {
        this._bindPlayer(p);
    });

    this.players(function (p) {
        p.socket.emit('board:join', { id: id });
    });

};

Board.prototype = {

    _initState: function () {
        // Hack hack hack - deep clone
        this.state = JSON.parse(JSON.stringify(this.map.board));
        this.state.activePlayerID = this._players[0].username;
        this.state.allPlayers = this._playersNames;
        this.state.playersStyles = this._players.map(
            function (p) { return p.style; });

        hexutils.fixStyles(this.state.playersStyles);
    },

    players: function (callback) {
        var args = [],
            res = [];

        args[0] = this._players[0];
        [].push.apply(args, Array.prototype.slice.call(arguments, 1));
        res.push(callback.apply(this, args));
        args[0] = this._players[1];
        res.push(callback.apply(this, args));
        return res;
    },

    joinPlayer: function (player) {
        if (this._playersNames.indexOf(player.username) != -1) {
            console.log('player', player.username, 'returned');
            this._bindPlayer(player);
        }
    },

    _bindPlayer: function (player) {
        player.after('board:resync', this._afterPlayerBoardResync, this);
    },

    _afterPlayerBoardResync: function (e) {
        e.socket.emit('board:state', this.state);
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
