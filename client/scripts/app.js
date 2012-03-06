
YUI(YUI_config).use('hexagon.models.game', 'hexagon.views.game', 'hexagon.server.testserver', function(Y){

    var model, view, server;

    window.Y = Y;

    server = window.server = new Y.Hexagon.server.Test();

    model = window.model = new Y.Hexagon.models.Game({
        server: window.server
    });

    view = window.view = new Y.Hexagon.views.Game({
        model: model,
        playerID: 'player1'
    });

    view.render();

    model.board.set('state', Y.Hexagon.logic.decompressState(
        '1 x 2 \n', {
            'player1': '1',
            'player2': '2'
        }));
    model.board.set('state.activePlayerID', 'player1');

});
