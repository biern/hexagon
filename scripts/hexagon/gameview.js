YUI.add('hexagon.gameview', function (Y) {

    Y.namespace('Hexagon').GameView = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: '<div class="hexagon-game"/>',

        initializer: function () {
            var model = this.model;

            var state = {
                size: [5, 10],
                cells: [
                    [{ playerID: 'marcin' }, {}, {}],
                    [{}, { disabled: true }, { disabled: true }],
                    [{}, { disabled: true }, {}]
                ]
            };

            this._boardWidget = new Y.Hexagon.Board({
                state: state,
                playerID: "marcin",
                playerStyles: {
                    marcin: 'red'
                }
            });
            // model.after('change', this.render, this);
            // model.after('destroy', this.destroy, this);
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }

            this._boardWidget.render(this.container);

            var bw = this._boardWidget;

            bw.getHexAt([2,2]).getNeighbourCells().set('playerID', 'marcin');
            bw.on('*:invalidMove', function () { alert("Invalid move"); });

            var s2 = {
                size: [2, 3],
                cells: [
                    [],
                    [{}, {disabled: true}]
                ]
            };

            var s3 =
                '-   x   x   -   x   \n\
                   x   1   x   -   x \n\
                 -   x   x   -   x   \n\
                   -   x   -   x   x ';

            window.x = Y.Hexagon.logic.decompressState(s3, { 1: 'marcin' });

            setTimeout(function () { bw.set('state', window.x); }, 1000);
            // setTimeout(function() { bw.getHexListAt([[0,0], [1,1]]).set('disabled', true); }, 2000);
        }
    });

}, '0', { requires: ['view', 'hexagon.board'] });
