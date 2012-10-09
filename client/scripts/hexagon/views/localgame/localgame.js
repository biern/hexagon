YUI.add('hexagon.views.localgame', function (Y) {

    Y.namespace('Hexagon.views').LocalGame = Y.Base.create('LocalGameView', Y.Hexagon.views.Game, [], {

        initializer: function () {
            var model = this.get('model');

            this.boardWidget.set('playersStyles', {
                player1: 'purple',
                player2: 'orange'
            });
            this.scoresWidget.set('playersStyles', {
                player1: 'purple',
                player2: 'orange'
            });
            this.activePlayerWidget.set('playersStyles', {
                player1: 'purple',
                player2: 'orange'
            });

            model.board.set('state.playersStyles', {
                player1: 'purple',
                player2: 'orange'
            });

            this.boardWidget.after('activePlayerIDChange', function (e) {
                this.boardWidget.set('playerID', e.newVal);
            }, this);

            model.board.set('state', Y.Hexagon.logic.decompressState(
                this.get('map'), {
                    'player1': '1',
                    'player2': '2'
                }));
            model.board.set('state.activePlayerID', 'player1');
        }

    }, {
        ATTRS: {
            map: {
                value: '1 x 2 \n'
            }
        }
    });

}, '0', {
    requires: ['hexagon.views.game']
});
