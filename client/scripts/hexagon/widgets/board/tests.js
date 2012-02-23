YUI.add('hexagon.board.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.board.tests');

    var state = namespace.state = {
        size: [3, 3],
        cells: [
            [{ playerID: 'player1' }, {}, { playerID: 'player2' }],
            [{}, { disabled: true }, { disabled: true }],
            [{}, { disabled: true }, {}]
        ]
    };

    var board = namespace.board = new Y.Hexagon.Board({
        playerID: 'player1',
        activePlayerID: 'player1',
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
            board.render();
        },

        tearDown: function () {
            // board.destroy();
        }
    });

    namespace.testState = new Y.Test.Case({

        setUp: function () {
            board.set('state', state);
        },

        testPlayerID: function () {
            var pos = [0, 0];

            Y.Assert.areEqual(board.getHexAt(pos).get('playerID'),
               state.cells[pos[1]][pos[0]].playerID);

            pos = [2, 0];

            Y.Assert.areEqual(board.getHexAt(pos).get('playerID'),
               state.cells[pos[1]][pos[0]].playerID);

        },

        testDisabled: function () {
            var pos = [1, 1];

            Y.Assert.areEqual(board.getHexAt(pos).get('disabled'),
               state.cells[pos[1]][pos[0]].disabled);
        },

        testDefault: function () {
            var pos = [0, 1];

            Y.Assert.isFalse(board.getHexAt(pos).get('disabled'));
            Y.Assert.isNull(board.getHexAt(pos).get('playerID'));

        }

    });
    suite.add(namespace.testState);

    namespace.testMoves = new Y.Test.Case({

        setUp: function () {
            board.set('state', state);
        },

        testJump: function () {
            var posFrom = [0, 0],
                posTo = [1, 0],
                bState = board.get('state');

            assertFired.call(this, function () {
                board.getHexAt(posFrom).set('selected', 1);
                board.getHexAt(posTo).set('selected', 1);
            }, board, '*:move', function (e, move) {
                Y.Assert.areEqual(move.type, 'jump');
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
            });
            // TODO:
            // Y.Assert.areEqual(state.cells[posFrom].playerID,
            //                   bState.cells[posTo].playerID);
            // Y.Assert.isUndefined(bState.cells[posFrom].playerID);
        },

        testClone: function () {
            var posFrom = [0, 0],
                posTo = [0, 1],
                bState = board.get('state');

            assertFired.call(this, function () {
                board.getHexAt(posFrom).set('selected', 1);
                board.getHexAt(posTo).set('selected', 1);
            }, board, '*:move', function (e, move) {
                Y.Assert.areEqual(move.type, 'clone');
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
            });
            // TODO:
            // Y.Assert.areEqual(state.cells[posFrom].playerID,
            //                   bState.cells[posTo].playerID);
            // Y.Assert.areEqual(bState.cells[posFrom].playerID,
            //                   bState.cells[posTo].playerID);
        },

        testInvalidMove: function () {
            var posFrom = [0, 0],
                posTo = [2, 2];

            assertFired.call(this, function () {
                board.getHexAt(posFrom).set('selected', 1);
                board.getHexAt(posTo).set('selected', 1);
            }, board, '*:invalidMove', function (e, move) {
                Y.ArrayAssert.itemsAreEqual(move.from, posFrom);
                Y.ArrayAssert.itemsAreEqual(move.to, posTo);
            });
        },

        testMoveToDisabled: function () {
            var posFrom = [0, 0],
                posTo = [1, 2];

            var subscription = board.once('*:move', function (e, move) {
                Y.Assert.fail('Move to disabled field should fail');
            }, this);

            board.getHexAt(posFrom).set('selected', 1);
            board.getHexAt(posTo).set('selected', 1);
            subscription.detach();
        },

        testMoveLock: function () {
            var posFrom = [0, 0],
                posTo = [0, 1];

            board.set('activePlayerID', 'player2');

            var subscription = board.once('*:move', function (e, move) {
                Y.Assert.fail('Move when locked should fail');
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