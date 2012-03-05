YUI.add('hexagon.logic', function(Y) {

    var namespace = Y.namespace('Hexagon.logic');

    namespace.eachCell = function (state, func, context) {
        var i, j;
        for (i = 0; i < state.cells.length; i++) {
            for (j = 0; j < state.cells[i].length; j++) {
                if (context) {
                    func.call(context, state.cells[i][j], [j, i]);
                } else {
                    func(state.cells[i][j], [j, i]);
                }
            }
        }
    };

    /**
     * Returns cell at given pos in state
     */
    namespace.cellAt = function (state, pos) {
        return state.cells[pos[1]][pos[0]];
    };

    /**
     * Validates and performs move on state. If move was successfully performed return true, otherwise false
     */
    namespace.performMove = function (state, move) {
        var isClone = move.type === 'clone',
            isJump = move.type === 'jump',
            isSkip = move.type === 'skip',
            from, to;

        if (isSkip) {
            // TODO: Allow only on no other possible move
            state.activePlayerID = namespace.nextPlayer(state);
            return true;
        }

        // Validate
        if (!isClone && !isJump) {
            return false;
        }
        if (isJump) {
            // TODO
        }
        if (isClone) {
            // TODO
        }

        from = namespace.cellAt(state, move.from);
        if (from === undefined || from.playerID !== state.activePlayerID) {
            return false;
        }
        to = namespace.cellAt(state, move.to);
        if (to === undefined || to.disabled || to.playerID) {
            return false;
        }

        // Move is valid
        to.playerID = from.playerID;
        if (isJump) {
            from.playerID = undefined;
        }
        // Capture neighbours
        namespace.neighboursPos(move.to, state.size).each(function (pos) {
            var cell = namespace.cellAt(state, pos);
            if (cell && cell.playerID) {
                cell.playerID = to.playerID;
            }
        });
        state.activePlayerID = namespace.nextPlayer(state);
        return true;
    };

    /**
     * Returns ArrayList of positions neighbour to given pos. If size is given positions are always within it.
     */
    namespace.neighboursPos = function (coords, size) {
        var x = coords[0],
            y = coords[1],
            res;

        // odd row
        if (y % 2) {
            res = [
                [x, y-1], [x, y-2], [x+1, y-1],
                [x, y+1], [x, y+2], [x+1, y+1]
            ];
        } else {
            res = [
                [x-1, y-1], [x, y-2], [x, y-1],
                [x-1, y+1], [x, y+2], [x, y+1]
            ];
        }
        return namespace.fitCellsIn(res, size);
    };

    namespace.clonesPos = function (coords, size) {
        return namespace.neighboursPos (coords, size);
    };

    /**
     * Returns ArrayList of positions 'jumpable' from given pos. If size is given positions are always within it.
     */
    namespace.jumpsPos = function (coords, size) {
        var x = coords[0],
            y = coords[1],
            res;

        // odd row
        if (y % 2) {
            res = [
                [x-1, y], [x-1, y-2], [x, y-3], [x, y-4], [x+1, y-3], [x+1, y-2],
                [x+1, y], [x+1, y+2], [x+1, y+3], [x, y+4], [x, y+3], [x-1, y+2]
            ];
        } else {
            res = [
                [x-1, y], [x-1, y-2], [x-1, y-3], [x, y-4], [x, y-3], [x+1, y-2],
                [x-1, y+2], [x-1, y+3], [x, y+4], [x, y+3], [x+1, y+2], [x+1, y]
            ];
        }
        return namespace.fitCellsIn(res, size);
    };

    /**
     * Returns ArrayList of positions 'clonable' from given pos. If size is given positions are always within it.
     */
    namespace.fitCellsIn = function (coords, size) {
        if (Y.Array.test(coords)) {
            coords = new Y.ArrayList(coords);
        }
        // WTH new Y.ArrayList has to be here?
        return new Y.ArrayList(coords.filter(function (e) {
            if (e[0] < 0 || e[1] < 0) {
                return false;
            }
            if (size &&
                (e[0] >= size[0] || e[1] >= size[1])) {
                return false;
            }
            return true;
        }));
    };

    /**
     * Returns state's cells in string form.
     *
     * 'x' represents empty cell
     * '-' represents disabled cell
     * players are mapped to chars according to playerIDMap.
     */
    // TODO: Change compress/decompress pair to (de)compressStateCells
    namespace.compressState = function (state, playerIDMap) {
        // TODO: auto players numbering
        var i, j, cell, res = "";

        for (i = 0; i < state.cells.length; i++) {
            if (state.cells[i] === undefined) {
                continue;
            }
            for (j = 0; j < state.cells[i].length; j++) {
                cell = state.cells[i][j];
                if (cell === undefined || cell.disabled) {
                    res += '-';
                } else if (cell.playerID) {
                    res += playerIDMap[cell.playerID];
                } else {
                    res += 'x';
                }
            }
            res += '\n';
        }
        return  res;
    };

    /**
     * Decompresses cells from string. See compressState.
     */
    namespace.decompressState = function (string, playerIDMap) {
        var w = 0, h = 0, reversedMap = {},
            i, c, nextPos,
            nextRow = '\n', disabled = '-', cell = 'x',
            skip = ' ',
            state = {
                size: [0, 0],
                allPlayers: [],
                cells: [
                    []
                ]
            },
            incW = function () {
                w++;
                if (w + 1 > state.size[0]) {
                    state.size[0] = w + 1;
                }
            };

        playerIDMap = playerIDMap || {};

        for (var k in playerIDMap) {
            reversedMap[playerIDMap[k]] = k;
            state.allPlayers.push(k);
        }

        for(i = 0; i < string.length; i++) {
            c = string[i];
            switch(c) {
            case nextRow:
                state.cells.push([]);
                w = 0;
                h++;
                if (h + 1 > state.size[1]) {
                    state.size[1] = h + 1;
                }
                break;
            case skip:
                break;
            case disabled:
                state.cells[h][w] = { disabled: true };
                incW();
                break;
            case cell:
                state.cells[h][w] = {};
                incW();
                break;
            default:
                var id = reversedMap[c] || c;
                state.cells[h][w] = {
                    playerID: id
                };
                incW();
            }
        }

        return state;
    };

    /**
     * Returns next player in order.
     *
     * Can be called in two ways:
     * nextPlayer(state) or nextPlayer(allPlayers, activePlayerID)
     */
    namespace.nextPlayer = function (arg1, arg2) {
        if (arguments.length == 1) {
            var state = arg1;

            return state.allPlayers[(Y.Array.indexOf(state.allPlayers, state.activePlayerID) + 1) % state.allPlayers.length];
        } else {
            var allPlayers = arg1,
                activePlayerID = arg2;

            return allPlayers[(Y.Array.indexOf(allPlayers, activePlayerID) + 1) % allPlayers.length];
        }

    };

}, '0', {
    requires: ['arraylist-add', 'arraylist-filter']
});
