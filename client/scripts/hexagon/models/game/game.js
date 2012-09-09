YUI.add('hexagon.models.game', function (Y) {

    Y.namespace('Hexagon.models').Game = Y.Base.create('GameModel', Y.Hexagon.models.Synchronized, [], {

        initializer: function (config) {
            this.plug(Y.Hexagon.models.plugs.BoardState);
            this.plug(Y.Hexagon.models.plugs.Auth);
        }

    }, {

        ATTRS: {

        }

    });

}, '0', { requires: ['hexagon.models.synchronized',
                     'hexagon.models.plugs.boardstate',
                     'hexagon.models.plugs.auth'] });
