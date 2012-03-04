YUI.add('hexagon.models.plugs.boardstate', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs'),
        SYNC_ATTRS = {
            move: ['from', 'to', 'type']
        };

    var ModelPlug = namespace.BoardState = Y.Base.create('BoardStatePlug', Y.Hexagon.models.plugs.Synchronized, [], {

        initializer: function (config) {
            var host = config.host;

            this._addHostAttrs(host);
        },

        _bindHost: function (host) {
            host.after('board:move', this._afterBoardMove, this);
        },

        _bindHostServer: function (server) {
            server.after('response:board:state', this._afterBoardStateReceived, this);
            server.after('response:board:move', this._afterBoardMoveReceived, this);
        },

        _unbindHostServer: function (server) {

        },

        _afterBoardStateReceived: function (e, data) {
            this._boardAttrs.set('state', data, { src: 'remote' });
        },

        _afterBoardMoveReceived: function (e, data) {
            this.get('host').fire('board:move', { src: 'remote' }, data);
            // TODO: Sync state here
        },

        _afterBoardMove: function (e, data) {
            if (e.src === 'local') {
                this.get('host').send('board:move', this.stripped(data, SYNC_ATTRS.move));
                // TODO: Sync state here
            }
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
    requires: ['hexagon.models.plugs.synchronized']
});
