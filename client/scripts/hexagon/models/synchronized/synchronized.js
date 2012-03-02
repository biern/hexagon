YUI.add('hexagon.models.synchronized', function (Y) {

    Y.namespace('Hexagon.models').Synchronized = Y.Base.create('SynchrnoizedModel', Y.Model, [], {

        attrNamespace: function (name) {
            if (this[name] === undefined) {
                this[name] = new Y.Attribute();
            }
            return this[name];
        }

    }, {

        ATTRS: {

            server: {
                value: null
            }

        }

    });

}, '0', { requires: ['model'] });
