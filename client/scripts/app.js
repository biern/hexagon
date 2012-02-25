
YUI(YUI_config).use('hexagon.models.game', 'hexagon.views.game', function(Y){
    var model = new Y.Hexagon.models.Game({
        playerID: 'marcin'
    });

    var view = new Y.Hexagon.views.Game({ model: model });

    view.render();
});
