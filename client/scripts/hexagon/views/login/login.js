YUI.add('hexagon.views.login', function (Y) {

    Y.namespace('Hexagon.views').Login = Y.Base.create('LoginView', Y.Hexagon.views.Template, [], {

        events: {
            '#login button': { click: '_onLoginButton' }
        },

        initializer: function () {
            var model = this.get('model');

            model.on('local:auth:login', this._onLoginResponse, this);

            this.on('loadingChange', this._onLoadingChange, this);
        },

        _onLoadingChange: function (e) {
            this.get('container').toggleClass('loading', e.newVal);
        },

        _onLoginButton: function (e) {
            e.preventDefault();

            this.set('loading', true);
            // TODO: Prefixy zamiast src
            this.get('model').fire('local:auth:login', {}, {
                username: Y.one('input.login').get('value')
            });
        },

        _onLoginResponse: function (e, data) {
            if (e.src !== 'remote') {
                return;
            }
            this.set('loading', false);
            this.fire('login', {}, data);
        }

    }, {
        ATTRS: {

            loading: {
                value: false
            },

            model: {
                value: null
            }
        }
    });

}, '0', {
    requires: ['hexagon.views.template']
});
