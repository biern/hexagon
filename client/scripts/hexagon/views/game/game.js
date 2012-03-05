YUI.add('hexagon.views.game', function (Y) {

    Y.namespace('Hexagon.views').Game = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.model;

            // model.after('change', this._afterModelChange, this);

            var bw = this._boardWidget = new Y.Hexagon.widgets.Board({
                playerID: 'player1',
                playerStyles: {
                    player1: 'red',
                    player2: 'blue'
                }
            }),
            bw2 = this._boardWidget2 = new Y.Hexagon.widgets.Board({
                // playerID: 'player2',
                playerStyles: {
                    player1: 'red',
                    player2: 'blue'
                }
            }),
            stringState =
                '-   x   x   -   x   \n\
                   x   1   x   -   2 \n\
                 -   x   x   -   x   \n\
                   -   x   x   x   x \n\
                 -   2   2   -   x';

            // Allows to play as any player on board1
            bw.after('activePlayerIDChange', function (e) {
                this.set('playerID', e.newVal);
            }, bw);

            bw.plug(Y.Hexagon.widgets.board.Synchronizer, { model: model});
            bw2.plug(Y.Hexagon.widgets.board.Synchronizer, { model: model});

            model.board.set('state', Y.Hexagon.logic.decompressState(
                stringState, {
                    'player1': '1',
                    'player2': '2'
                }));

            // If this set is not called like that, than model.board.set('state') that also calls bw.set('activePlayerID') is called after this line (why?)
            setTimeout(function () {
                model.board.set('state.activePlayerID', 'player1');
            }, 0);

            bw.on('*:invalidMove', function () { alert("Invalid move"); });
            window.bw = bw;
            window.bw2 = bw2;
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this._boardWidget.render(this.container);
            this._boardWidget2.render(this.container);
        }

    });

}, '0', {
    requires: ['view', 'hexagon.widgets.board']
});
