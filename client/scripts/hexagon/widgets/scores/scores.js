YUI.add('hexagon.widgets.scores', function (Y) {
    var namespace = Y.namespace('Hexagon.widgets'),
        BOX_HTML = '<div class="{outer}"><div class="{inner} {styled}" /></div>';

    namespace.Scores = Y.Base.create('Scores', Y.Widget, [], {

        initializer: function () {
            this._nodes = {};
        },

        renderUI: function () {

        },

        bindUI: function () {
            this.after('scoresChange', this._afterScoresChange, this);
            this.on('allPlayersChange', this._onAllPlayersChange, this);
            this.after('allPlayersChange', this._afterPlayersChange, this);
            this.after('playerStylesChange', this._afterPlayersChange, this);
        },

        syncUI: function () {
            this._syncPlayers(this.get('allPlayers'), this.get('playersStyles'));
            this._syncScores(this.get('scores'));
        },

        /**
         * Syncs allPlayers and playerStyles
         */
        _syncPlayers: function (allPlayers, playersStyles) {
            var cb = this.get('contentBox');

            cb.setContent('');
            Y.Array.each(allPlayers, function (playerID) {
                this._nodes[playerID] = cb.appendChild(
                    Y.substitute(BOX_HTML, {
                        outer: this.getClassName('box'),
                        inner: this.getClassName('box', 'content'),
                        styled: this.getClassName('box', 'content',
                                                  playersStyles[playerID])
                    })).get('children');
            }, this);
        },

        /**
         * Sets default scores values and updates bars width
         */
        _syncScores: function (scores) {
            var sum = 0, minWidth = 10;
            Y.Object.each(scores, function (value) {
                sum += value;
            });

            Y.Object.each(scores, function (value, key) {
                this._nodes[key].setContent(value || 0);
                this._nodes[key].setStyle('width', Math.floor(
                    sum ?
                        ((100 - minWidth) * value / sum) + minWidth :
                        minWidth) + '%');
            }, this);
        },

        /**
         * Prevent changing to another list with equal attributes
         */
        _onAllPlayersChange: function (e) {
            if (e.newVal.length !== e.prevVal.length) {
                return;
            }
            for (i in e.newVal) {
                if (e.newVal[i] !== e.prevVal[i]) {
                    return;
                }
            }
            e.preventDefault();
            e.halt();
        },

        _afterScoresChange: function (e) {
            this._syncScores(e.newVal);
        },

        /**
         * Called after allPlayers or playerStyles changes
         */
        _afterPlayersChange: function (e) {
            var scores = {},
                prevScores = this.get('scores');

            this._syncPlayers(this.get('allPlayers'), this.get('playersStyles'));
            // Update scores since players might have changed
            Y.Array.each(this.get('allPlayers'), function (playerID) {
                scores[playerID] = prevScores[playerID] || 0;
            }, this);
            this.set('scores', scores);
        }

    }, {
        ATTRS: {

            /**
             * List of all players in order
             */
            allPlayers: {
                value: []
            },

            /**
             * Mapping of playerID -> styleName
             */
            playersStyles: {
                value: {}
            },

            /**
             * Mapping { playerID: scoreValue }
             */
            scores: {
                value: {}
            }
        }
    });

    Y.namespace('Hexagon.widgets.scores').ModelSync = Y.Base.create('ScoresModelSync', Y.Plugin.Base, [], {

        initializer: function (config) {
            this.widget = config.host;
            this.model = config.model;
            this.model.board.after('stateChange', this._afterModelBoardStateChange, this);
            this._syncModel();
        },

        _syncModel: function () {
            this.widget.set('playersStyles', this.model.board.get('state.playersStyles'));
            this.widget.set('allPlayers', this.model.board.get('state.allPlayers'));
            this.widget.set('scores', this._calcScores(this.model.board.get('state')));

        },

        _afterModelBoardStateChange: function (e) {
            var state = e.newVal,
                scores = this._calcScores(state);

            if (state.playersStyles) {
                this.get('host').set('playersStyles', state.playersStyles);
            }
            this.get('host').set('allPlayers', state.allPlayers);
            this.get('host').set('scores', scores);
        },

        _calcScores: function (state) {
            var scores = {};

            Y.Array.each(state.allPlayers, function (item) {
                scores[item] = 0;
            }, this);

            Y.Hexagon.logic.eachCell(state, function (cell) {
                if (cell.playerID) {
                    scores[cell.playerID] += 1;
                }
            }, this);

            return scores;
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
    requires: ['hexagon.logic', 'node', 'substitute']
});