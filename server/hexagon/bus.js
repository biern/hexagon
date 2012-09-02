var util = require('util'),
    yvents = require('yvents');


/**
 * Most events should bubble up to instance of this class
 */
function EventBus () {
    yvents.Base.call(this);
};

yvents.subclass(EventBus, { prefix: 'bus' }, {
    /**
     * namespace
     * Creates new 'sub' EventBus instance inside this one
     * under given namespace if it does not already exists
     */
    ns: function (name, instance) {
        if (instance) {
            if (this[name]) {
                throw 'Namespace ' + name + ' is already registered!';
            }
            this[name] = instance;
        } else if (!this[name]) {
            this[name] = new EventBus();
        }

        return this[name];
    }
});

module.exports = EventBus;
