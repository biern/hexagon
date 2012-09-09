YUI.add('hexagon.views.template', function (Y) {

    Y.namespace('Hexagon.views').Template = Y.Base.create('TemplateView', Y.View, [], {
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
}, '0', {
    requires: ['view', 'handlebars']
});
