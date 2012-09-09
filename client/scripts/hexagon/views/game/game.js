YUI.add('hexagon.views.game', function (Y) {

    Y.namespace('Hexagon.views').Game = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.get('model'),
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
            var container = this.get('container'),
                node = Y.Node.create(Y.one('#t-game').getHTML()),
                parent;

            container.setHTML("");
            container.appendChild(node);
            parent = container.one('.hexagon-game');

            this.boardWidget.render(parent.one('.board'));
            this.activePlayerWidget.render(parent.one('.footer'));
            this.scoresWidget.render(parent.one('.footer'));
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
                    player1: 'orange',
                    player2: 'purple'
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
