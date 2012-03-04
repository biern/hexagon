YUI.add('hexagon.logic', function(Y) {

    var namespace = Y.namespace('Hexagon.logic');
    /**
     * Validates and performs move on state. If move was successfully performed return true, otherwise false
     */
    namespace.cellAt = function (state, pos) {
        return state.cells[pos[1]][pos[0]];
    };

    namespace.performMove = function (state, move) {
        var isClone = move.type === 'clone',
            isJump = move.type === 'jump',
            from, to;

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
            delete from.playerID;
        }
        // Capture neighbours
        namespace.neighbourCells(move.to, state.size).each(function (pos) {
            var cell = namespace.cellAt(state, pos);
            console.log(pos, cell);
            if (cell.playerID) {
                console.log('capturing', pos);
                cell.playerID = to.playerID;
            }
        });
        return true;
    };

    // TODO: rename to neighbourPos?
    namespace.neighbourCells = function (coords, size) {
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

    namespace.cloneCells = function (coords, size) {
        return namespace.neighbourCells (coords, size);
    };

    namespace.jumpCells = function (coords, size) {
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

    namespace.nextPlayer = function (arg1, arg2) {
        // nextPlayer(state) || nextPlayer(allPlayers, activePlayerID)
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
