YUI.add('hexagon.logic', function(Y) {

    var namespace = Y.namespace('Hexagon.logic');
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
        return coords.filter(function (e) {
            if (e[0] < 0 || e[1] < 0) {
                return false;
            }
            if (size &&
                (e[0] >= size[0] || e[1] >= size[1])) {
                return false;
            }
            return true;
        });
    };

}, '0', {
    requires: ['arraylist-add', 'arraylist-filter']
});
