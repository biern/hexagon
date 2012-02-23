YUI.add('hexagon.gameview', function (Y) {

    Y.namespace('Hexagon').GameView = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: '<div class="hexagon-game"/>',

        initializer: function () {
            var model = this.model,
                bw = this._boardWidget = new Y.Hexagon.Board({
                    playerID: 'marcin',
                    activePlayerID: 'marcin',
                    playerStyles: {
                        marcin: 'red'
                    }
                }),
                testState1 = {
                    size: [2, 3],
                    cells: [
                        [],
                        [{}, {disabled: true}]
                    ]
                },
                stringState =
                '-   x   x   -   x   \n\
                   x   1   x   -   x \n\
                 -   x   x   -   x   \n\
                   -   x   -   x   x ';

            window.bw = bw;

            bw.on('*:invalidMove', function () { alert("Invalid move"); });                       bw.set('state', Y.Hexagon.logic.decompressState(stringState, { 'marcin': '1' }));
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this._boardWidget.render(this.container);
        }
    });

}, '0', { requires: ['view', 'hexagon.board'] });
