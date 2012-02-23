YUI.add('hexagon.gamemodel', function (Y) {

    Y.namespace('Hexagon').GameModel = Y.Base.create('GameModel', Y.Model, [], {

        _getBoardState: function () {
            return this.getAttrs([
                'size', 'cells', 'activePlayerID'
            ]);
        }

    }, {

        ATTRS: {

            playerID: {
                value: null
            },

            activePlayerID: {
                value: null
            },

            size: {
                value: [0, 0]
            },

            cells: {
                value: [[]]
            },

            // Returns all neccessary information for current board state.
            boardState: {
                getter: '_getBoardState'
            },

            server: {
                value: null
            }

        }

    });

}, '0', { requires: ['model'] });
