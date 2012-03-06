YUI.add('hexagon.views.game', function (Y) {

    Y.namespace('Hexagon.views').Game = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.model,
                playersStyles = this.get('playersStyles'),
                playerID = this.get('playerID');

            this.boardWidget = new Y.Hexagon.widgets.Board({
                playerID: this.get('playerID'),
                playersStyles: playersStyles
            });
            this.scoresWidget = new Y.Hexagon.widgets.Scores({
                playersStyles: playersStyles
            });
            this.activePlayerWidget = new Y.Hexagon.widgets.ActivePlayer({
                playersStyles: playersStyles
            });

            this.boardWidget.plug(Y.Hexagon.widgets.board.ModelSync, {
                model: model
            });
            this.scoresWidget.plug(Y.Hexagon.widgets.scores.ModelSync, {
                model: model
            });
            this.activePlayerWidget.plug(Y.Hexagon.widgets.activeplayer.ModelSync, {
                model: model
            });

            this.boardWidget.on('*:invalidMove', function () {
                alert("Invalid move");
            });
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this.boardWidget.render(this.container);
            this.activePlayerWidget.render(this.container);
            this.scoresWidget.render(this.container);
        }

    }, {
        ATTRS: {

            playerID: {
                writeOnce: 'initOnly',
                value: 'player1'
            },

            playersStyles: {
                writeOnce: 'initOnly',
                value: {
                    player1: 'red',
                    player2: 'blue'
                }
            }
        }
    });

}, '0', {
    requires: ['hexagon.widgets.board',
               'hexagon.widgets.scores',
               'hexagon.widgets.activeplayer',
               'view']
});
