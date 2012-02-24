YUI.add('hexagon.views.game', function (Y) {

    Y.namespace('Hexagon.views').Game = Y.Base.create('GameView', Y.View, [], {
        // TODO: fix that: if already in DOM it should be rendered there, not create new tag
        container: Y.one('.hexagon-game'),

        initializer: function () {
            var model = this.model;

            // model.after('change', this._afterModelChange, this);

            var bw = this._boardWidget = new Y.Hexagon.Board({
                playerID: this.model.get('playerID'),
                playerStyles: {
                    marcin: 'red'
                }
            }),

            stringState =
                '-   x   x   -   x   \n\
                   x   1   x   -   x \n\
                 -   x   x   -   x   \n\
                   -   x   -   x   x ';

            window.bw = bw;

            model.connectBoard(bw);

            setTimeout(function () {
                model.board.set('state', Y.Hexagon.logic.decompressState(stringState, { 'marcin': '1' }));
            }, 1000);
            setTimeout(function () {
                model.board.set('state.activePlayerID', 'marcin');
            }, 2000);

            bw.on('*:invalidMove', function () { alert("Invalid move"); });
        },

        render: function () {
            if (!this.container.inDoc()) {
                Y.one('body').append(this.container);
            }
            this._boardWidget.render(this.container);
        },

        _afterModelChange: function (e) {
            var changed = e.changed;

            // Perform a full resync
            if (Y.Object.hasKey(changed, 'cells') || Y.Object.hasKey(changed, 'size')) {
                this._syncBoardAttr('state', this.model.get('boardState'));
                return;
            }

            // Other attributes
            Y.Array.each(['playerID', 'activePlayerID'], function (item) {
                if (Y.Object.hasKey(changed, item)) {
                    this._syncBoardAttr(item, changed[item].newVal);
                }
            }, this);
        },

        _syncBoardAttr: function (name, value) {
            this._boardWidget.set(name, value);
        }

    });

}, '0', {
    requires: ['view', 'hexagon.widgets.board']
});
