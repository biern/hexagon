YUI.add('hexagon.models.plugs.boardstate', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs');

    var ModelPlug = namespace.BoardState = Y.Base.create('BoardState', Y.Plugin.Base, [], {

        initializer: function (config) {
            this._addHostAttrs(config.host);
        },

        _addHostAttrs: function (host) {
            this._boardAttrs = host.attrNamespace('board');
            this._boardAttrs.addAttrs(ModelPlug.ADD_ATTRS);
        }

    }, {

        NS: 'boardstatePlug',

        ADD_ATTRS: {

            state: {

                value: {
                    activePlayerID: {
                        value: null
                    },

                    size: {
                        value: [0, 0]
                    },

                    cells: {
                        value: [[]]
                    }
                }

            }

        }
    });

}, '0', {
    requires: ['plugin', 'base']
});
