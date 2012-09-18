var util = require('util'),
    Y = require('yui').getInstance();


var YUI = require('yui/debug').YUI;

Y = YUI({ useSync: true, debug: true, filter: 'debug'});


// var YUI = require('yui/debug').YUI,
//     Y = YUI();

// Y = require('yui/debug').YUI().use('base', 'event-custom');

Y.use('base', 'event-custom');

exports.EventTarget = Y.EventTarget;

exports.augment = function (cls, options) {
    Y.augment(cls, Y.EventTarget, true, null, Y.merge({
        emitFacade: true
    }, options));

    cls.prototype.emit = cls.prototype.fire;
};


/**
 * Base class providing helpful event binding behaviour
 */
function Base (bus) {
    if (bus) {
        ((this.EVENTS || {}).on || []).forEach(function (string) {
            this._bindMethFromString(bus, string, 'on');
        }, this);
        ((this.EVENTS || {}).after || []).forEach(function (string) {
            this._bindMethFromString(bus, string, 'after');
        }, this);
    }
};

Base.prototype = {
    /**
     * Binds event name defined as a string to method defined in this instance.
     *
     * Bus is a bus on which event is fired, string is event type
     * in following format: [{ns1}[.{ns2}]].{[prefix:]eventType}
     * (ie "client.auth:request" or "auth:request" or ns1.ns2.auth:request").
     * Handler is one of 'after' or 'on'
     */
    _bindMethFromString: function (bus, string, handler) {
        var target = bus,
            eventName = string.split('.').slice(-1)[0],
            propName = '_' + handler;

        string.split('.').slice(0, -1).forEach(function (ns, i) {
            target = target.ns(ns);
            propName += ns.charAt(0).toUpperCase() + ns.slice(1);
        }, this);

        eventName.split(':').forEach(function (part) {
            propName += part.charAt(0).toUpperCase() + part.slice(1);
        });

        if (!this[propName]) {
            console.error('Object does not define handler named ' + propName);
        }

        console.log('binding', handler, eventName, propName);

        target[handler](eventName, this[propName], this);
    },

    /**
     * Add extra arguments to event object when bubbling from this instance.
     *
     * All targets of this instance will have those arguments added to
     * theirs event facade.
     */
    addBubbleArgs: function (data) {
        this._bubbleArgs = this._bubbleArgs || {};
        this._bubbleArgs.extend(data);
    }
};

/**
 * Properties applied after EventTarget is merged into class.
 */
Base.ETaugment = {
    /**
     * Override that enables adding extra arguments to event
     * when bubbling from this instancje
     */
    bubble: function (evt, args) {
        if (this._bubbleArgs) {
            args[0].extend(this._bubbleArgs);
        }
        return exports.EventTarget.prototype.bubble.apply(this, arguments);
    }
};

exports.Base = Base;

exports.subclass = function (cls, options, proto) {
    var key;

    // Order of theese cannot be changed
    util.inherits(cls, Base);
    exports.augment(cls, options);

    // Augment EventTarget properties
    for (key in Base.ETaugment) {
        if (Base.ETaugment.hasOwnProperty(key)) {
            cls.prototype[key] = Base.ETaugment[key];
        }
    }

    if (proto) {
        for (key in proto) {
            if (proto.hasOwnProperty(key)) {
                cls.prototype[key] = proto[key];
            }
        }
    }

    return cls;
};


/**
 * Wraps cls to use 'fire' instead of 'emit' to fire its events.
 */
// TODO: Remove, merge with augment
exports.wrapEmitter = function (cls, options) {
    var property = options.emitterFnName || 'emit';

    cls.prototype[property] = function (name, data) {
        return this.fire(name, data);
    };
    Y.augment(cls, Y.EventTarget, true, null, Y.merge({
        emitFacade: true
    }, options));
};
