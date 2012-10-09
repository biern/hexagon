YUI.add('hexagon.views.game', function (Y) {

    Y.namespace('Hexagon.views').Game = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.get('model');

            model.board.set('boardID', this.get('boardID'));

            this.boardWidget = new Y.Hexagon.widgets.Board({

            });
            this.scoresWidget = new Y.Hexagon.widgets.Scores({

            });
            this.activePlayerWidget = new Y.Hexagon.widgets.ActivePlayer({

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
            this._renderGame();
        },

        _renderGame: function () {
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

            boardID: {
                value: null
            },
            // TODO: boardID, remove playerStyles
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
