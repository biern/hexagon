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
            this.on('playersChange', this._onPlayersChange, this);
            this.after('playersChange', this._afterPlayersChange, this);
        },

        syncUI: function () {
            this._syncPlayers(this.get('players'));
            this._syncScores(this.get('scores'));
        },

        _syncPlayers: function (players) {
            var cb = this.get('contentBox');

            cb.setContent('');
            Y.Array.each(players, function (item) {
                this._nodes[item.playerID] = cb.appendChild(
                    Y.substitute(BOX_HTML, {
                        outer: this.getClassName('box'),
                        inner: this.getClassName('box', 'content'),
                        styled: this.getClassName('box', 'content', item.style)
                    })).get('children');
            }, this);
        },

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

        _onPlayersChange: function (e) {
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

        _afterPlayersChange: function (e) {
            var prev = e.prevVal,
                val = e.newValue,
                scores = {};

            this._syncPlayers(val);
            // Update scores since players have changed
            Y.Array.each(val, function (item) {
                scores[item.playerID] = this.get('scores')[item.playerID] || 0;
            });
            this.set('scores', scores);
        }

    }, {
        ATTRS: {

            /**
             * Pairs of playerID -> style name
             */
            players: {
                value: [{ playerID: 'marcin', style: 'red'}]
            },

            /**
             * Mapping { playerID: scoreValue }
             */
            scores: {
                value: {}
            }
        }
    });

    Y.namespace('Hexagon.widgets.scores').ModelSynch = Y.Base.create('ScoresModelSynch', Y.Plugin.Base, [], {

        initializer: function (config) {
            config.model.board.after('stateChange', this._afterModelBoardStateChange, this);
        },

        _afterModelBoardStateChange: function (e) {
            var state = e.newVal,
                scores = {};

            Y.Array.each(state.allPlayers, function (item) {
                scores[item] = 0;
            }, this);

            Y.Hexagon.logic.eachCell(state, function (cell) {
                if (cell.playerID) {
                    scores[cell.playerID] += 1;
                }
            }, this);

            this.get('host').set('scores', scores);
        }

    }, {

        NS: 'modelSynch',

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