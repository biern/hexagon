YUI.add('hex.board', function (Y) {

    var HexCell = Y.namespace('Hex').HexCell = Y.Base.create('hexcell', Y.Widget, [Y.WidgetChild], {

        renderUI: function () {
            this._node = this.get('contentBox');
        },

        bindUI: function () {
            this._node.after('click', function (n) {
                if (!this.get('disabled')) {
                    this.set('selected', this.get('selected') ? 0 : 1);
                }
            }, this);
        },

        syncUI: function () {

        }

    }, {

        ATTRS: {
            x: { value: undefined },
            y: { value: undefined },
            'pos': {
                readOnly: true,
                getter: function() {
                    return [this.get('x'), this.get('y')];
                }
            }
        }

    });

    var HexList = Y.namespace('Hex').HexList = function() {};
    Y.augment(HexList, Y.ArrayList);
    Y.ArrayList.addMethod(HexList.prototype, ['set', 'get']);

    var Board = Y.namespace('Hex').Board = Y.Base.create('board', Y.Widget, [Y.WidgetParent], {

        initializer: function () {
            this._addChildren();
        },

        renderUI: function () {

        },

        _renderBoard: function () {
            var row, rowCls = this.getClassName('row');

            this.get('contentBox').all('.' + rowCls).remove();
            this.each(function (child, i) {
                if (i % this.get('cols') === 0) {
                    row = this.get('contentBox').appendChild('<div class="' + rowCls + '"></div>');
                }
                child.render();
                row.appendChild(child.get('boundingBox'));
            }, this);
        },

        bindUI: function () {
            this.after('sizeChange', this._afterSizeChange, this);
        },

        syncUI: function () {
            this._syncSize();
        },

        getHexAt: function(coords) {
            var index = coords[1] * this.get('cols') + coords[0];
            if (index >= this.size()) {
                return null;
            } else {
                return this.item(index);
            }
        },

        getHexListAt: function(coords) {
            var cells = new HexList();
            Y.Array.each(coords, function(e) {
                var hex = this.getHexAt(e);
                if (hex !== null) {
                    cells.add(hex);
                }
            }, this);
            return cells;
        },

        _afterSizeChange: function (e) {
            if (e.newVal[0] == e.prevVal[0] &&
                e.newVal[1] == e.prevVal[1]) {
                return;
            }
            this._syncSize(this.get('size'));
        },

        _addChildren: function () {
            var w = this.get('cols'),
                h = this.get('rows');

            this.removeAll();

            for (var i = 0; i < h; i++) {
                for (var j = 0; j < w; j++) {
                    var child = this.add({ x: j, y: i }).item(0);
                    child.addTarget(this);
                }
            }
        },

        _syncSize: function (size) {
            this._addChildren();
            this._renderBoard();
        },

        _validateDimension: function (val, name) {
            return Y.Lang.isNumber(val) && val >= 0;
        }

    }, {

        ATTRS: {

            defaultChildType: {
                value: HexCell
            },

            cols: {
                readOnly: true,
                getter: function() {
                    return this.get('size')[0];
                }
            },

            rows: {
                readOnly: true,
                getter: function() {
                    return this.get('size')[1];
                }
            },

            size: {
                value: [0, 0]
            }
        }
    });
}, '0', {
    requires: ['arraylist-add', 'arraylist-filter', 'node', 'widget-parent', 'widget-child']
});
