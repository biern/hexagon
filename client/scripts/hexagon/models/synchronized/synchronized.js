YUI.add('hexagon.models.synchronized', function (Y) {

    Y.namespace('Hexagon.models').Synchronized = Y.Base.create('SynchrnoizedModel', Y.Model, [], {

        initializer: function () {
            this.after('serverChange', this._afterServerChange, this);
        },

        attrNamespace: function (name) {
            if (this[name] === undefined) {
                this[name] = new Y.Attribute();
            }
            return this[name];
        },

        send: function (signalName, data) {
            this.get('server').send(signalName, data);
            // console.log('sending: "' + signalName + '" with: ', data);
            // // this.get('server').send(signalName, data);
        }

    }, {

        ATTRS: {

            server: {
                value: null
            }

        }

    });

}, '0', { requires: ['model'] });
