YUI.add('hexagon.models.plugs.boardstate', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs'),
        logic = Y.Hexagon.logic,
        SYNC_ATTRS = {
            move: ['from', 'to', 'type']
        };

    var ModelPlug = namespace.BoardState = Y.Base.create('BoardStatePlug', Y.Hexagon.models.plugs.Synchronized, [], {

        initializer: function (config) {
            var host = config.host;

            this._addHostAttrs(host);
            this._boardAttrs.after('boardIDChange', this._afterBoardIDChange, this);
        },

        _bindHost: function (host) {
            host.after('local:board:move', this._afterBoardMove, this);
        },

        _bindHostServer: function (server) {
            server.after('response:board:state', this._afterBoardStateReceived, this);
            server.after('response:board:move', this._afterBoardMoveReceived, this);
            server.after('response:board:invalid', this._afterBoardInvalidReceived, this);
        },

        _unbindHostServer: function (server) {

        },

        _performLocalMove: function (move) {
            var state = this._boardAttrs.get('state');

            if (logic.performMove(state, move)) {
                this._boardAttrs.set('state', state, { src: 'sync', sender: this });
                return true;
            }
            return false;
        },

        _afterBoardStateReceived: function (e, data) {
            if (data.boardID != this._boardAttrs.get('boardID')) {
                return;
            }
            this._boardAttrs.set('state', data, { src: 'remote', sender: this });
        },

        _afterBoardMoveReceived: function (e, data) {
            if (data.boardID != this._boardAttrs.get('boardID')) {
                return;
            }
            this._performLocalMove(data);
            this.get('host').fire('remote:board:move', { sender: this }, data);
        },

        _afterBoardIDChange: function (e) {
            console.log('change', e.newVal);
            if (e.newVal) {
                this.get('host').send('board:join', { boardID: e.newVal });
                this.get('host').send('board:resync', { boardID: e.newVal });
            }
        },

        _afterBoardInvalidReceived: function (e, data) {
            this._boardAttrs.set('boardID', null);
        },

        _afterBoardMove: function (e, data) {
            data = this.stripped(data, SYNC_ATTRS.move);
            data.boardID = this._boardAttrs.get('boardID');
            this.get('host').send('board:move', data);
            this._performLocalMove(data);
        },

        _addHostAttrs: function (host) {
            this._boardAttrs = host.attrNamespace('board');
            this._boardAttrs.addAttrs(ModelPlug.ADD_ATTRS);
        }

    }, {

        NS: 'boardstatePlug',

        ADD_ATTRS: {

            boardID: {
                value: null
            },

            state: {

                value: {
                    allPlayers: {
                        value: []
                    },

                    activePlayerID: {
                        value: null
                    },

                    playersStyles: {
                        value: {}
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
    requires: ['hexagon.models.plugs.synchronized', 'hexagon.logic']
});
