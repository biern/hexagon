YUI.add('hexagon.board.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.board.tests');

    var state = namespace.state = {
        size: [5, 10],
        cells: [
            [{ playerID: 'player1' }, {}, { playerID: 'player2' }],
            [{}, { disabled: true }, { disabled: true }],
            [{}, { disabled: true }, {}]
        ]
    };

    var board = namespace.board = new Y.Hexagon.Board({
        playerID: 'player1',
        playerStyles: {
            player1: 'red'
        }
    });

    var assertFired = function (func, obj, name, handler) {
        var fired = false;
        handler = handler || function () {};
        var _handler = function () {
            fired = true;
            handler.apply(this, arguments);
        };
        var sub = obj.once(name, _handler, this);

        func();
        sub.detach();
        Y.Assert.isTrue(fired, 'Event ' + name + ' did not fire');
    };

    var suite = namespace.testSuite = new Y.Test.Suite({
        name: 'Test board',

        setUp: function () {
            console.log('setup suite');
            board.render();
        },

        tearDown: function () {
            // board.destroy();
        }
    });

    namespace.testMoves = new Y.Test.Case({

        setUp: function () {
            console.log('setup');
            board.set('state', state);
        },

        testJump: function () {
            var posFrom = [0, 0],
                posTo = [1, 0],
                fired = false;

            var subscription = board.once('*:move', function (e, move) {
                Y.Assert.areEqual(move.type, 'jump');
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
                fired = true;
            }, this);
            board.getHexAt(posFrom).set('selected', 1);
            board.getHexAt(posTo).set('selected', 1);
            subscription.detach();
            Y.Assert.isTrue(fired);
        },

        testClone: function () {
            var posFrom = [0, 0],
                posTo = [0, 1],
                fired = false;

            var subscription = board.once('*:move', function (e, move) {
                Y.Assert.areEqual(move.type, 'clone');
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
                fired = true;
            }, this);
            board.getHexAt(posFrom).set('selected', 1);
            board.getHexAt(posTo).set('selected', 1);
            subscription.detach();
            Y.Assert.isTrue(fired);
        },

        testInvalidMove: function () {
            var posFrom = [0, 0],
                posTo = [2, 2],
                fired = false;

            var subscription = board.once('*:invalidMove', function (e, move) {
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
                fired = true;
            }, this);
            board.getHexAt(posFrom).set('selected', 1);
            board.getHexAt(posTo).set('selected', 1);
            subscription.detach();
            Y.Assert.isTrue(fired);
        },

        testMoveToDisabled: function () {
            var posFrom = [0, 0],
                posTo = [2, 2];

            var subscription = board.once('*:move', function (e, move) {
                Y.Assert.fail('Move to disabled field should fail');
            }, this);

            board.getHexAt(posFrom).set('selected', 1);
            board.getHexAt(posTo).set('selected', 1);
            subscription.detach();
        }

    });
    suite.add(namespace.testMoves);

}, '0', {
    requires: ['hexagon.board', 'test']
});