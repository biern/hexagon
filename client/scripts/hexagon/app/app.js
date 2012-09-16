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
            'play-online': {
                type: Y.Hexagon.views.OnlinePlay
            },
            'game-online': {
                type: Y.Hexagon.views.Game
            },
            'login': {
                type: Y.Hexagon.views.Login
            },
            'tests': {
                type: Y.Hexagon.views.Template
            }
        },

        initializer: function () {
            var server = new Y.Hexagon.server.SocketIO();
            this.set('server', server);

            var model = new Y.Hexagon.models.Game({
                server: this.get('server')
            });

            this.set('model', model);

            model.after('auth:login', this._afterAuthLogin, this);
            // TODO: model.remote:game:join ...
            server.after('response:game:join', this._afterGameJoin, this);

            // Test stuff only
            this.get('model').fire('auth:login', { src: 'local' }, {
                username: 'user ' + parseInt(Math.random() * 1000)
            });


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
            var loggedIn = this.get('loggedIn');

            if (!loggedIn) {
                // TODO: This url should not stay here like that
                this._loginRedirect('/play/online/');
            }

            this.showView('play-online', {
                model: this.get('model')
            });
        },

        showGame: function (req, res) {
            var id = parseInt(req.params.id);
            console.debug('Entering game', id);

            this.showView('online-game', {
                gameID: id,
                model: this.get('model')
            });
        },

        showLogin: function (e) {
            this.showView('login', {
                template: Y.one('#t-login'),
                model: this.get('model')
            });
        },

        _loginRedirect: function (nextUrl) {
            this._afterLoginUrl = nextUrl;
            this.navigate('/login/');
        },

        _afterAuthLogin: function (e, data) {
            if (e.src != 'remote') {
                return;
            }

            this.set('loggedIn', true);
            if (this._afterLoginUrl) {
                this.navigate(this._afterLoginUrl);
            }
        },

        _afterGameJoin: function (e, data) {
            // TODO: src == etc..
            this.navigate('/play/game/' + data.id + '/');
        }

    }, {
        ATTRS: {

            server: {
                value: null
            },

            model: {
                value: null
            },

            loggedIn: {
                value: false
            },

            routes: {
                value: [
                    {path: '/', callback: 'showMainPage'},
                    {path: '/login/', callback: 'showLogin'},
                    {path: '/play/local/', callback: 'showLocalPlay'},
                    {path: '/play/online/', callback: 'showOnlinePlay'},
                    {path: '/play/game/:id/', callback: 'showGame'}
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
               'hexagon.views.onlineplay',
               'hexagon.views.template',
               'hexagon.server.socketio',
               'hexagon.server.testserver'
              ]
});
