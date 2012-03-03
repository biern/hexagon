YUI.add('hexagon.models.plugs.synchronized', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs');

    var ModelPlug = namespace.Synchronized = Y.Base.create('SynchronizedPlug', Y.Plugin.Base, [], {

        initializer: function (config) {
            var host = config.host;

            this._bindHost(host);
            this._syncHostServer(host.get('server'));
            host.after('serverChange', this._afterServerChange, this);
        },

        stripped: function (obj, attrs) {
            var copy = {};
            Y.Array.each(attrs, function (a) {
                copy[a] = obj[a];
            });
            return copy;
        },

        _syncHostServer: function (server) {
            if (this._server) {
                // Unbind
                this._unbindHostServer(this._server);
            }
            if (server) {
                // Bind
                this._bindHostServer(server);
            }
            this._server = server;
        },

        _afterServerChange: function (e) {
            console.log('hostServerChange');
            this._syncHostServer(e.newVal);
        },

        _bindHost: function (host) {

        },

        _bindHostServer: function (server) {

        },

        _unbindHostServer: function (server) {

        }

    });

}, '0', {
    requires: ['plugin', 'base']
});
