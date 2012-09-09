YUI(YUI_config).use('hexagon.app', function(Y){

    var app = window.app = new Y.Hexagon.App({
        serverRouting: false,

        container: '#hexagon-app',
        linkSelector: '#hexagon-app a',

        transitions: true
    });

    app.render();

    window.Y = Y;
});
