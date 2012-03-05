YUI(YUI_config).use('hexagon.models.game', 'hexagon.views.localgame', 'hexagon.server.testserver', function(Y){

    window.map = '\
    -   -   2   -   - \n\
      -   x   x   -   - \n\
    -   x   x   x   - \n\
      x   x   x   x   - \n\
    1   x   x   x   1 \n\
      x   x   x   x   - \n\
    x   x   -   x   x \n\
      x   x   x   x   - \n\
    x   x   x   x   x \n\
      x   -   -   x   - \n\
    x   x   x   x   x \n\
      x   x   x   x   - \n\
    2   x   x   x   2 \n\
      x   x   x   x   - \n\
    -   x   x   x   - \n\
      -   x   x   -   - \n\
    -   -   1   -   - \n\
    ';

    var server = window.server = new Y.Hexagon.server.Test();

    var model = window.model = new Y.Hexagon.models.Game({
        playerID: 'marcin',
        server: window.server
    });

    var view = window.view = new Y.Hexagon.views.LocalGame({
        model: model,
        map: window.map
    });

    window.view.render();
});
