YUI.add('hexagon.app', function (Y) {
    var namespace = Y.namespace('Hexagon');

    var TemplateView = Y.Base.create('TemplateView', Y.View, [], {
        initializer: function () {
            this._template = Y.Handlebars.compile(this.get('template').getHTML());
        },

        render: function () {
            var content = this._template();

            this.get('container').setHTML(content);

            return this;
        }
    }, {
        ATTRS: {
            template: {
                writeOnce: 'initOnly',
                value: null
            }
        }
    });

    var defaultMap = '\
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

    namespace.App = Y.Base.create('HexagonApp', Y.App, [], {

        views: {
            'main': {
                type: TemplateView
            },
            'play-local': {
                type: Y.Hexagon.views.LocalGame
            }
        },

        initializer: function () {
            this.set('server', new Y.Hexagon.server.SocketIO());
            this.once('ready', function (e) {
                if (this.hasRoute(this.getPath())) {
                    this.dispatch();
                } else {
                    this.showMainPage();
                }
            });
        },

        showMainPage: function (e) {
            this.showView('main', {
                template: Y.one('#t-main')
            });
        },

        showLocalPlay: function (e) {
            var model = window.model = new Y.Hexagon.models.Game({
                server: new Y.Hexagon.server.Test()
            });

            this.showView('play-local', {
                model: model,
                map: defaultMap
            });
        }

    }, {
        ATTRS: {

            server: {
                value: null
            },

            game: {
                value: null
            },

            routes: {
                value: [
                    {path: '/', callback: 'showMainPage'},
                    {path: '/play/local/', callback: 'showLocalPlay'}
                ]
            }
        }
    });

}, '0', {
    requires: ['app', 'handlebars',
               'hexagon.models.game',
               'hexagon.views.game',
               'hexagon.views.localgame',
               'hexagon.server.socketio',
               'hexagon.server.testserver'
              ]
});
