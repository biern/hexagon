YUI.add('hexagon.views.localgame', function (Y) {

    Y.namespace('Hexagon.views').LocalGame = Y.Base.create('LocalGameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.model,
            bw = this._boardWidget = new Y.Hexagon.widgets.Board({
                playerID: 'player1',
                playerStyles: {
                    player1: 'red',
                    player2: 'blue'
                }
            }),
            scores = this._scoresWidget = new Y.Hexagon.widgets.Scores({
                players: [
                    { playerID: 'player1', style: 'red' },
                    { playerID: 'player2', style: 'blue' }]
            });

            // Allows to play as any player on board widget
            bw.after('activePlayerIDChange', function (e) {
                this.set('playerID', e.newVal);
            }, bw);

            bw.plug(Y.Hexagon.widgets.board.ModelSync, { model: model});
            scores.plug(Y.Hexagon.widgets.scores.ModelSync, { model: model});

            // Set initial state
            model.board.set('state', Y.Hexagon.logic.decompressState(
                this.get('map'), {
                    'player1': '1',
                    'player2': '2'
                }));

            // If this set is not called like that, than model.board.set('state') that also calls bw.set('activePlayerID') is called after this line (why?)
            setTimeout(function () {
                model.board.set('state.activePlayerID', 'player1');
            }, 0);

            bw.on('*:invalidMove', function () { alert("Invalid move"); });
            window.bw = bw;
            window.scores = scores;
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this._boardWidget.render(this.container);
            this._scoresWidget.render(this.container);
        }

    }, {
        ATTRS: {
            map: {
                value: '1 x 2 \n'
            }
        }
    });

}, '0', {
    requires: ['view', 'hexagon.widgets.board', 'hexagon.widgets.scores']
});