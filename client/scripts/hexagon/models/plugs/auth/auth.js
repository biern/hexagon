YUI.add('hexagon.models.plugs.auth', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs');

    var ModelPlug = namespace.Auth = Y.Base.create('AuthPlug', Y.Hexagon.models.plugs.Synchronized, [], {

        initializer: function (config) {
            var host = config.host;

            this._addHostAttrs(host);
        },

        _bindHost: function (host) {
            host.after('auth:login', this._afterLogin, this);
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
            } else {
                this._authAttrs.set('player', null);
            }
            this._authAttrs.set('loggedIn', data.success);
            this.get('host').fire('auth:login', {src: 'remote'}, data);
        },

        _afterLogin: function (e, data) {
            if (e.src === 'local') {
                this.get('host').send('auth:request', data);
            }
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
    requires: ['hexagon.models.plugs.synchronized']
});
