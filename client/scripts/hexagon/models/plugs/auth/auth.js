YUI.add('hexagon.models.plugs.auth', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs');

    var ModelPlug = namespace.Auth = Y.Base.create('AuthPlug', Y.Hexagon.models.plugs.Synchronized, [], {

        initializer: function (config) {
            var host = config.host;

            this._addHostAttrs(host);
            this.loginLast();
        },

        loginLast: function () {
            var username = Y.Cookie.get('username');

            if (this._authAttrs.get('loggedIn')) {
                return;
            }

            if (username) {
                this.get('host').fire('local:auth:login', {}, {
                    username: username
                });
            }
        },

        _bindHost: function (host) {
            host.after('local:auth:login', this._afterLogin, this);
            host.after('socket:disconnect', this._afterDisconnect, this);
            host.after('socket:connected', this._afterConnected, this);
        },

        _bindHostServer: function (server) {
            server.after('response:auth:login', this._afterLoginReceived, this);
        },

        _unbindHostServer: function (server) {

        },

        _afterLoginReceived: function (e, data) {
            // TODO: Przemyśleć nazewnictwo eventów (usunąć 'Response' z końca i dodać 'src'?)
            // TODO: Zamiast src w eventach używać prefixu?
            // local:auth:login
            // remote:auth:login
            // sync:auth:login

            if (data.success) {
                this._authAttrs.set('player', data.player);
                Y.Cookie.set('username', data.player.username);
            } else {
                this._authAttrs.set('player', null);
            }
            this._authAttrs.set('loggedIn', data.success);
            this.get('host').fire('remote:auth:login', data);
        },

        _afterDisconnect: function () {
            this._authAttrs.set('loggedIn', false);
        },

        _afterConnected: function () {
            this.loginLast();
        },

        _afterLogin: function (e, data) {
            this.get('host').send('auth:request', data);
        },

        _addHostAttrs: function (host) {
            this._authAttrs = host.attrNamespace('auth');
            this._authAttrs.addAttrs(ModelPlug.ADD_ATTRS);
        }

    }, {

        NS: 'AuthPlug',

        ADD_ATTRS: {

            loggedIn: {
                value: false
            },

            player: {
                value: null
            }

        }
    });

}, '0', {
    requires: ['hexagon.models.plugs.synchronized',
               'cookie']
});
