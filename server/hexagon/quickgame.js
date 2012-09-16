var socket_io = require('socket.io'),
    yvents = require('yvents');


function QuickGame (bus) {
    yvents.Base.call(this, bus);

    this.addTarget(bus);
    this._waitingPlayer = null;
};


yvents.subclass(QuickGame, {}, {
    EVENTS: {
        after: ['player.game:quick',
                'socket:disconnect']
    },

    _afterPlayerGameQuick: function (e) {
        console.log('quickgame - ', e.player.username);
        if (this._waitingPlayer &&
              !(e.player.socket.id == this._waitingPlayer.socket.id)) {
            this._startGame(this._waitingPlayer, e.player);
        } else {
            this._waitingPlayer = e.player;
        }
    },

    _afterSocketDisconnect: function (e) {
        if (this._waitingPlayer &&
              e.socket.id == this._waitingPlayer.socket.id) {
            this._clear();
        }
    },

    _startGame: function (p1, p2) {
        console.log(
            'starting game between ' +
                p1.username + ' and ' + p2.username);
        this.fire('game:create', { players: [p1, p2] });
        this._clear();
    },

    _clear: function () {
        this._waitingPlayer = null;
    }

});

module.exports = QuickGame;
