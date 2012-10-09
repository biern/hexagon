YUI.add('hexagon.widgets.activeplayer', function (Y) {
    var namespace = Y.namespace('Hexagon.widgets'),
        BOX_HTML = '<div class="{token}"/>';

    namespace.ActivePlayer = Y.Base.create('ActivePlayer', Y.Widget, [], {

        initializer: function () {

        },

        renderUI: function () {
            this._tokenNode = this.get('contentBox').appendChild(
                Y.substitute(BOX_HTML, {
                    token: this.getClassName('token')
                }));
        },

        bindUI: function () {
            this.after('activePlayerIDChange', this._afterActivePlayerIDChange, this);
            this.after('playersStylesChange', this._afterPlayersStylesChange, this);
        },

        syncUI: function () {
            this._syncActivePlayerID(this.get('activePlayerID'));
        },

        playerTokenClassname: function (playerID) {
            return this.getClassName('token', this.get('playersStyles')[playerID]);
        },

        _syncActivePlayerID: function (playerID) {
            this._tokenNode.addClass(this.playerTokenClassname(playerID));
        },

        _afterPlayersStylesChange: function (e) {
            this._syncActivePlayerID(this.get('activePlayerID'));
        },

        _afterActivePlayerIDChange: function (e) {
            this._tokenNode.removeClass(this.playerTokenClassname(e.prevVal));
            this._syncActivePlayerID(e.newVal);
        }

    }, {
        ATTRS: {

            playersStyles: {
                value: {}
            },

            activePlayerID: {
                value: null
            }
        }
    });

    Y.namespace('Hexagon.widgets.activeplayer').ModelSync = Y.Base.create('ActivePlayerModelSync', Y.Plugin.Base, [], {

        initializer: function (config) {
            config.model.board.after('stateChange', this._afterModelBoardStateChange, this);
        },

        _afterModelBoardStateChange: function (e) {
            var state = e.newVal;

            if (state.playersStyles) {
                this.get('host').set('playersStyles', state.playersStyles);
            }
            this.get('host').set('activePlayerID', state.activePlayerID);
        }

    }, {

        NS: 'modelSync',

        ATTRS: {
            model: {
                writeOnce: 'initOnly',
                value: null
            }
        }
    });



}, '0', {
    requires: ['node', 'substitute']
});