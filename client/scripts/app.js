
YUI(YUI_config).use('hexagon.gameview', 'hexagon.gamemodel', function(Y){
    var model = new Y.Hexagon.GameModel(),
        view = new Y.Hexagon.GameView({ model: model });

    view.render();
});
