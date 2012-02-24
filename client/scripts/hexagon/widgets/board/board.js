YUI.add('hexagon.widgets.board', function (Y) {
    var namespace = Y.namespace('Hexagon.widgets');
    var HexagonCell = namespace.HexagonCell = Y.Base.create('HexagonCell', Y.Hex.HexCell, [], {

        initializer: function () {
            this.constructor.superclass.renderUI.call(this);
            this._initEvents();
        },


        getCloneCells: function () {
            return this.get('parent').getHexListAt(
                Y.Hexagon.logic.cloneCells(
                    this.get('pos'), this.get('parent').get('size')
                )
            );
        },

        getJumpCells: function () {
            return this.get('parent').getHexListAt(
                Y.Hexagon.logic.jumpCells(
                    this.get('pos'), this.get('parent').get('size')
                )
            );
        },

        getNeighbourCells: function () {
            return this.get('parent').getHexListAt(
                Y.Hexagon.logic.neighbourCells(
                    this.get('pos'), this.get('parent').get('size')
                )
            );
        },

        highlightMoves: function (value) {
            // WTH filter ALWAYS returns empty array here? (even with 'return true')
            var f = function (cell) {
                return !cell.get('occupied') && !cell.get('disabled');
            },
            jumpCells = this.getJumpCells(), //.filter(f).set('highlight', value ? 'jump' : null),
            cloneCells = this.getCloneCells(); // .filter(f).set('highlight', value ? 'clone' : null);

            // Workaround:
            jumpCells.each(function (cell) {
                if (!value || (!cell.get('occupied') && !cell.get('disabled'))) {
                    cell.set('highlight', value ? 'jump' : null);
                }
            });

            cloneCells.each(function (cell) {
                if (!value || (!cell.get('occupied') && !cell.get('disabled'))) {
                    cell.set('highlight', value ? 'clone' : null);
                }
            });
        },

        performMove: function (move) {
            this.get('parent')._stateCached = false;
            if (move.type === "clone") {
                move.cellTo.set('playerID', move.playerID);
                move.cellTo.possessNeighbours();
            }

            if (move.type === "jump") {
                move.cellFrom.set('playerID', null);
                move.cellTo.set('playerID', move.playerID);
                move.cellTo.possessNeighbours();
            }

        },

        requestMove: function (destination) {
            if (this.getCloneCells().indexOf(destination) > -1) {
                this._fireCloneMove(destination);
                return true;
            } else if (this.getJumpCells().indexOf(destination) > -1) {
                this._fireJumpMove(destination);
                return true;
            } else {
                this._fireInvalidMove(destination);
                return false;
            }
        },

        possessNeighbours: function () {
            this.getNeighbourCells().each(function (cell) {
                if (cell.get('playerID')) {
                    cell.set('playerID', this.get('playerID'));
                };
            }, this);
        },

        renderUI: function () {
            this.constructor.superclass.renderUI.call(this);
            this.get('contentBox').setContent(
               Y.substitute('<div class="{outer}"><div class="{inner}"></div></div>',
                             { outer: this.getClassName('token'),
                               inner: this.getClassName('token', 'content')
                             }));

        },

        bindUI: function () {
            this.constructor.superclass.bindUI.call(this);
            this.after('highlightChange', this._afterHighlightChange, this);
            this.after('playerIDChange', this._afterPlayerIDChange, this);
            this.after('disabledChange', this._afterDisabledChange, this);
            this.on('selectedChange', this._onSelectedChange, this);
        },

        _afterHighlightChange: function (e) {
            if (e.prevVal) {
                this.get('contentBox').removeClass(this.getClassName('highlight', e.prevVal));
            }

            if (e.newVal){
                this.get('contentBox').addClass(this.getClassName('highlight', e.newVal));
            }
        },

        _afterDisabledChange: function (e) {
            if (e.newVal) {
                this.set('playerID', null);
            }
        },

        _afterPlayerIDChange: function (e) {
            var tokenNode = this.get('contentBox').one('*').one('*'),
                parent = this.get('parent'),
                newStyle = parent.get('playerStyles')[e.newVal],
                prevStyle = parent.get('playerStyles')[e.prevVal];

            if (newStyle === prevStyle) {
                return;
            }

            if (prevStyle) {
                tokenNode.removeClass(this.getClassName('token', prevStyle));
            }

            if (newStyle){
                tokenNode.addClass(this.getClassName('token', newStyle));
                // // TODO: Randomize rotation on new tokens
                // tokenNode.setStyle('transform', 'rotate(' + Math.random() * 360 + ')');
            }
        },

        _fireCloneMove: function (destination) {
            this.fire('move', {}, {
                type: 'clone',
                from: this.get('pos'),
                to: destination.get('pos'),
                cellFrom: this,
                cellTo: destination,
                playerID: this.get('playerID')
            });
            // console.log("clone: " + this.get('pos') + " -> " + destination.get('pos'));
        },

        _fireJumpMove: function (destination) {
            this.fire('move', {}, {
                type: 'jump',
                from: this.get('pos'),
                to: destination.get('pos'),
                cellFrom: this,
                cellTo: destination,
                playerID: this.get('playerID')
            });
            // console.log("jump: " + this.get('pos') + " -> " + destination.get('pos'));
        },

        _fireInvalidMove: function (destination) {
            this.fire('invalidMove', {}, {
                from: this.get('pos'),
                to: destination.get('pos')
            });
        },

        _moveDefault: function (e, move) {
            this.performMove(move);
        },

        _onSelectedChange: function (e) {
            var selected = this.get('parent').get('selection');

            if (this.get('parent').get('lockMoves')) {
                e.preventDefault();
                e.halt();
                return;
            }

            // If newly selected cell is empty and this one is occupied
            if (!this.get('occupied') && selected != this) {
                if (selected && e.newVal && !this.get('disabled')) {
                    if (selected.requestMove(this)) {
                        selected.set('selected', 0);
                    }
                }
                e.halt();
            } else {

            }
        },

        _initEvents: function (){
            this.publish('move', {
                emitFacade: true,
                bubbles: true,
                defaultFn: this._moveDefault
            });
            this.publish('invalidMove', {
                emitFacade: true,
                bubbles: true
            });

        }


    }, {
        ATTRS: {

            playerID: {
                value: null
            },

            occupied: {
                readOnly: true,
                getter: function () {
                    return this.get('playerID') !== null;
                }
            },

            highlight: {
                value: null
            }
        }
    });

    var Board = namespace.Board = Y.Base.create('Board', Y.Hex.Board, [], {

        initializer: function (config) {
            this.constructor.superclass.initializer.apply(this, arguments);
            this._stateCached = config.state;
        },

        renderUI: function () {
            this.constructor.superclass.renderUI.call(this);
        },

        bindUI: function () {
            this.constructor.superclass.bindUI.call(this);
            this.on('selectionChange', this._onSelectionChange, this);
            this.after('stateChange', this._afterStateChange, this);
            this.after('playerIDChange', this._afterPlayerIDChange, this);
            this.after('activePlayerIDChange', this._afterActivePlayerIDChange, this);
            this.after('lockMovesChange', this._afterLockMovesChange, this);
        },

        syncUI: function () {
            this.constructor.superclass.syncUI.call(this);
            this._syncState(this.get('state'));
            this._syncActivePlayerID(this.get('activePlayerID'));
        },

        _onSelectionChange: function (e) {
            var val = e.newVal,
                prev = e.prevVal;

            if (prev) {
                prev.highlightMoves(false);
            }

            // If not deselected:
            if (val !== prev) {
                val.highlightMoves(true);
            }
        },

        _afterPlayerIDChange: function (e) {
            this._syncActivePlayerID(this.get('activePlayerID'));
        },

        _afterActivePlayerIDChange: function (e){
            this._syncActivePlayerID(e.newVal);
        },

        _afterLockMovesChange: function (e) {
            this._syncLockMoves(e.newVal);
        },

        _afterStateChange: function (e) {
            this._syncState(e.newVal);
        },

        _syncActivePlayerID: function (activePlayerID) {
            if (activePlayerID !== this.get('playerID')) {
                this.set('lockMoves', true);
            } else {
                this.set('lockMoves', false);
            }
        },

        _syncLockMoves: function (lockMoves) {
            // Maybe do sth in the future :-)
        },

        _syncState: function(state) {
            // Defaults
            console.log('syncstate');
            console.log(state);

            state = state || {};
            state.size = state.size || [0, 0];
            state.cells = state.cells || {};
            state.activePlayerID = state.activePlayerID || null;

            // Extract other attributes from board state
            this.set('size', state.size);
            this.set('activePlayerID', state.activePlayerID);

            this.each(function (e) {
                e.set('disabled', true);
            });
            Y.Array.each(state.cells, function (row, i){
                Y.Array.each(state.cells[i], function (cellState, j) {
                    this._cellFromState(this.getHexAt([j, i]), cellState);
                }, this);
            }, this);
        },

        _cellFromState: function(cell, cellState) {
            cell.set('disabled', cellState === undefined ? true : cellState.disabled === true);
            cell.set('playerID', cellState.playerID || null);
        },

        _unhighlightAll: function () {
            this.each(function (c) {
                c.set('highlight', false);
            });
        },

        _setState: function (value) {
            this._stateCached = value;
            return value;
        },

        _getState: function () {
            console.log('getstate');
            if (this._stateCached) {
                console.log('cache');
                return this._stateCached;
            }

            var state = {
                size: this.get('size'),
                activePlayerID: this.get('activePlayerID'),
                cells: []
            }, row, cell;
            this.each(function (item) {
                cell = {};
                if (item.get('disabled')) {
                    cell.disabled = true;
                } else if (item.get('playerID')) {
                    cell.playerID = item.get('playerID');
                }
                row = state.cells[item.get('y')];
                if (!row) {
                    state.cells[item.get('y')] = [cell];
                } else {
                    row.push(cell);
                }
            });

            this._stateCached = state;

            return state;
        }

    }, {
        ATTRS: {

            playerID: {
                value: null
            },

            activePlayerID: {
                value: null
            },

            lockMoves: {
                value: false
            },

            defaultChildType: {
                value: HexagonCell
            },

            multiple: {
                value: false
            },

            // TODO: tests
            state: {
                setter: '_setState',
                getter: '_getState'
            },

            playerStyles: {
                value: {}
            }

        }
    });
}, '0', { requires: ['hex.board', 'hexagon.logic', 'substitute'] });