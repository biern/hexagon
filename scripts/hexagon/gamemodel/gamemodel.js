YUI.add('hexagon.gamemodel', function (Y) {

    Y.namespace('Hexagon').GameModel = Y.Base.create('GameModel', Y.Model, [], {

    }, {

        ATTRS: {
            players: {
                value: []
            },

            playerCurrent: {

            },

            playerLocal: {

            },

            server: {
                value: null
            },

            boardState: {
                value: null
            }
        }

    });

}, '0', { requires: ['model'] });
