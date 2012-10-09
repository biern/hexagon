var socket_io = require('socket.io'),
    yvents = require('yvents'),
    logic = require('./logic'),
    hexutils = require('./utils'),
    Board = require('./board'),
    maps = require('./maps');


/**
 * Games controller
 *
 * Creates board instances on demand
 */
function Game (bus, id) {
    this.bus = bus;
    yvents.Base.call(this, bus);
    this.boards = [];
};


yvents.subclass(Game, { prefix: 'game' }, {
    EVENTS: {
        after: ['game:create', 'player.board:join',
                'board:allPlayersLeft']
    },

    _afterGameCreate: function (e) {
        this.boards.push(new Board(
            this.bus, maps[0], e.players));
    },

    _afterBoardAllPlayersLeft: function (e) {
        console.log('after players left');
        this.boards.every(function (board, i) {
            if (e.target.id == board.id) {
                console.log('removing board ' + board.id);
                board.unbind();
                delete this.boards[i];
                return false;
            }
            return true;
        }, this);
    },

    _afterPlayerBoardJoin: function (e) {
        var id = e.boardID,
            found = false;

        this.boards.every(function (board) {
            if (board.id == id) {
                board.playerJoined(e.player);
                found = true;
                return false;
            }
            return true;
        });

        if (!found) {
            // TODO e.socket
            console.log('not found');
            console.log(this.boards);
            console.log(id);
            e.player.socket.emit('board:invalid', { boardID: id });
        }
    }
});


module.exports = Game;
