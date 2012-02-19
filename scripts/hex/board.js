YUI.add('hex.board', function (Y) {

    var HexCell = Y.namespace('Hex').HexCell = Y.Base.create('hexcell', Y.Widget, [Y.WidgetChild], {

        renderUI: function () {
            this._node = this.get('contentBox');
            // this._node.setContent('<div><div>' + this.get('x') + '|' + this.get('y') + '</div></div>');
            // TODO
            // this._node.setContent('<div class="outer"><div class="yui3-hexagoncell-token"></div></div>');
            // this._node.setContent('<div class="test2"></div>');
        },

        bindUI: function () {
            this._node.after('click', function(n) {
                this.set('selected', this.get('selected') ? 0 : 1);
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

    // var HexRow = Y.namespace('Hex').HexRow = Y.Base.create('hexrow', Y.Widget, [Y.WidgetChild, Y.WidgetParent]);


    var HexList = Y.namespace('Hex').HexList = function() {};
    Y.augment(HexList, Y.ArrayList);
    Y.ArrayList.addMethod(HexList.prototype, ['set', 'get']);

    var Board = Y.namespace('Hex').Board = Y.Base.create('board', Y.Widget, [Y.WidgetParent], {

        renderUI: function () {
            this._renderBoard();
        },

        bindUI: function () {
            this.after('sizeChange', this._afterSizeChange, this);
        },

        syncUI: function () {
            // Skip syncChange - avoid rendering twice
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

        _renderBoard: function () {
            // TODO: Does not work when re-rendering (ie. change size)
            // since children seem to render just after .add() is called
            // if the widget is already rendered
            console.log("renderBoard");
            var contentBox = this.get('contentBox'),
                w = this.get('cols'),
                h = this.get('rows');

            this.removeAll();
            contentBox.all('.row').remove();

            for (var i = 0; i < h; i++) {
                var row = contentBox.appendChild('<div class="row"/>');
                for (var j = 0; j < w; j++) {
                    var child = new (this.get('defaultChildType'))({
                        x: j, y: i
                    });
                    // var child = this.add({ x: j, y: i}).item(0);

                    child.addTarget(this);
                    child.render(row);

                    this.add(child);
                }
            }
        },

        _syncSize: function (size) {
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
