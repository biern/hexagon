YUI.add('hexagon.views.onlineplay', function (Y) {

    Y.namespace('Hexagon.views').OnlinePlay = Y.Base.create('OnlinePlayView', Y.Hexagon.views.Template, [], {

        initializer: function () {

        },

        render: function () {
            this.constructor.superclass.render.apply(this);
            this.get('model').send('game:quick');
        }

    }, {
        ATTRS: {

            template: {
                value: Y.one('#t-play-online')
            }

        }
    });

}, '0', {
    requires: ['hexagon.views.template']
});
