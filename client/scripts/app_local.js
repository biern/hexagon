YUI(YUI_config).use('hexagon.models.game', 'hexagon.views.localgame', 'hexagon.server.testserver', function(Y){

    var model, view, server, map;

    window.Y = Y;

    map = window.map = '\
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

    server = window.server = new Y.Hexagon.server.Test();

    model = window.model = new Y.Hexagon.models.Game({
        server: server
    });

    view = window.view = new Y.Hexagon.views.LocalGame({
        model: model,
        map: window.map
    });

    view.render();
});
