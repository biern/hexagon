YUI.add('hexagon.app', function (Y) {
    var namespace = Y.namespace('Hexagon');

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
                type: Y.Hexagon.views.Template
            },
            'play-local': {
                type: Y.Hexagon.views.LocalGame
            },
            'login': {
                type: Y.Hexagon.views.Login
            },
            'tests': {
                type: Y.Hexagon.views.Template
            }
        },

        initializer: function () {

            this.set('server', new Y.Hexagon.server.SocketIO());
            this.set('model', new Y.Hexagon.models.Game({
                server: this.get('server')
            }));

            this.once('ready', function (e) {
                if (this.hasRoute(this.getPath())) {
                    this.dispatch();
                } else {
                    this.showMainPage();
                }
            });

            this.on('*:login', this._onLogin, this);
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

            model.auth.set('player', {
                'id': 1,
                'username': 'player 1'
            });

            this.showView('play-local', {
                model: model,
                map: defaultMap
            });
        },

        showOnlinePlay: function (e) {
            var loggedIn = false;

            if (!loggedIn) {
                this.navigate('/login/');
            }
        },

        showLogin: function (e) {
            this.showView('login', {
                template: Y.one('#t-login'),
                model: this.get('model')
            });
        },

        _onLogin: function (e, data) {
            alert('witaj ' + data.player.username);
        }

    }, {
        ATTRS: {

            server: {
                value: null
            },

            model: {
                value: null
            },

            routes: {
                value: [
                    {path: '/', callback: 'showMainPage'},
                    {path: '/login/', callback: 'showLogin'},
                    {path: '/play/local/', callback: 'showLocalPlay'},
                    {path: '/play/online/', callback: 'showOnlinePlay'}
                ]
            }
        }
    });

}, '0', {
    requires: ['app',
               'hexagon.models.game',
               'hexagon.views.game',
               'hexagon.views.login',
               'hexagon.views.localgame',
               'hexagon.views.template',
               'hexagon.server.socketio',
               'hexagon.server.testserver'
              ]
});
