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
            stringState =
                '-   x   x   -   x   \n\
                   x   1   x   -   2 \n\
                 -   x   x   -   x   \n\
                   -   x   x   x   x \n\
                 -   2   2   -   x';

            bw.after('activePlayerIDChange', function (e) {
                this.set('playerID', e.newVal);
            }, bw);

            Y.Hexagon.widgets.board.synchronize(model, bw);

            setTimeout(function () {
                model.board.set('state', Y.Hexagon.logic.decompressState(
                    stringState, {
                        'player1': '1',
                        'player2': '2'
                    }));
            }, 1000);
            setTimeout(function () {
                model.board.set('state.activePlayerID', 'player1');
            }, 2000);

            bw.on('*:invalidMove', function () { alert("Invalid move"); });

            window.bw = bw;
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this._boardWidget.render(this.container);
        }

    });

}, '0', {
    requires: ['view', 'hexagon.widgets.board']
});
