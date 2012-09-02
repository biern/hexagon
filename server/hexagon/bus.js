var util = require('util'),
    yvents = require('yvents');


/**
 * Most events should bubble up to instance of this class
 */
function EventBus () {
    // yvents.Base.call(this);
};


// util.inherits(EventBus, yvents.Base);

/**
 * namespace
 * Creates new 'sub' EventBus instance inside this one
 * under given namespace if it does not already exists
 */
EventBus.prototype.ns = function (name, instance) {
    if (!this[name]) {
        this[name] = new EventBus();
    }
    // if (!this[name] || instance) {
    //     this[name] = instance || new EventBus();
    // }

    return this[name];
};


yvents.augment(EventBus, {
    prefix: 'bus'
});

module.exports = EventBus;
