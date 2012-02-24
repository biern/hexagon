
YUI(YUI_config).use('hexagon.models.plugs.boardstate', 'hexagon.views.game', 'hexagon.models.synchronized', function(Y){
    var model = new Y.Hexagon.models.SynchronizedModel({
        playerID: 'marcin',
        activePlayerID: 'marcin'
    });

    model.plug(Y.Hexagon.models.plugs.BoardState);

    var view = new Y.Hexagon.views.Game({ model: model });

    view.render();
});
