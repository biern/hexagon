YUI.add('hexagon.models.plugs.boardstate', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs');

    var ModelPlug = namespace.BoardState = Y.Base.create('BoardState', Y.Plugin.Base, [], {

        initializer: function (config) {
            this._addHostAttrs(config.host);
            this._addHostMethods(config.host);
        },

        _addHostAttrs: function (host) {
            this._boardAttrs = host.attrNamespace('board');
            this._boardAttrs.addAttrs(ModelPlug.ADD_ATTRS);
            console.log(this._boardAttrs.get('state'));
        },

        _addHostMethods: function (host) {
            host.addPlugMethod('connectBoard');
            this.afterHostMethod('connectBoard', this.connectBoard);
        },

        connectBoard: function (board) {
            var host = this.get('host');

            this._boardAttrs.after('stateChange', function (e) {

                console.log('change:');
                console.log(e.attrName);
                console.log(e.subAttrName);

                // Skip syncing whole state if only playerID changes (common case)
                if (e.subAttrName === 'state.activePlayerID') {
                    board.set('activePlayerID', e.newVal.activePlayerID);
                } else if (e.subAttrName === undefined){
                    this._syncBoardState(board, e.newVal);
                }
            }, this);
        },

        _syncBoardState: function (board, state) {
            board.set('state', state);
            // board.syncState(state);
        }

    }, {

        // TODO: plugs.boardstate?
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
