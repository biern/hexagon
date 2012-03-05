
YUI(YUI_config).use('hexagon.models.game', 'hexagon.views.game', 'hexagon.server.testserver', function(Y){

    window.Y = Y;
    window.server = new Y.Hexagon.server.Test();

    var model = window.model = new Y.Hexagon.models.Game({
        playerID: 'marcin',
        server: window.server
    });

    var view = new Y.Hexagon.views.Game({ model: model });

    view.render();
});
