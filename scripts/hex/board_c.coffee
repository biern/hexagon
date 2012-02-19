YUI.add 'board', (Y) ->

  Y.namespace('Hex').HexCell = Y.Base.create 'hexcell',
    Y.Widget, [Y.WidgetChild], {

      renderUI: () ->
        @_node = @get 'contentBox'
        @_node.setContent @get('x') + '|' + @get('y')

      bindUI: () ->
        @_node.after 'click', (n) =>
          @set 'selected', if @get 'selected' then 0 else 1

      syncUI: () ->
        null

    }, {
      ATTRS:
        x:
          value: undefined
        y:
          value: undefined

    }

  Board = Y.namespace('Hex').Board = Y.Base.create 'board',
    Y.Widget, [Y.WidgetParent], {

      renderUI: () ->
        @_renderBoard()

      bindUI: () ->

      syncUI: () ->

      _renderBoard: () ->
        contentBox = @get 'contentBox'
        w = @get 'cols'
        h = @get 'rows'

        for i in [0..h]
          row = contentBox.appendChild '<div class="row"/>'
          for j in [0..w]
            child = @add(x: j, y: i).item 0
            child.render row

      _validateDimension: (val, name) ->
        Y.Lang.isNumber(val) && val >= 0

    }, {

      ATTRS:

        defaultChildType:
          value: HexCell

        cols:
          value: 0,
          writeOnce: "initOnly",
          validator: "_validateDimension"

        rows:
          value: 0,
          writeOnce: "initOnly",
          validator: "_validateDimension"

        size:
          readOnly: true,
          getter: () ->
            [@get 'cols', @get 'rows'];

    }

,
'0',
requires: ['node', 'widget-parent', 'widget-child']
