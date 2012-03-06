YUI.add('hexagon.models.game', function (Y) {

    Y.namespace('Hexagon.models').Game = Y.Base.create('GameModel', Y.Hexagon.models.Synchronized, [], {

        initializer: function (config) {
            this.plug(Y.Hexagon.models.plugs.BoardState);
        }

    }, {

        ATTRS: {

        }

    });

}, '0', { requires: ['hexagon.models.synchronized', 'hexagon.models.plugs.boardstate'] });
