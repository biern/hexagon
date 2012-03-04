YUI.add('hexagon.logic.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.logic.tests'),
        logic = Y.Hexagon.logic,
        utils = Y.Hexagon.utils;

    var bw = new Y.Hexagon.widgets.Board({
                playerStyles: {
                    player1: 'red',
                    player2: 'blue'
                }
    }).render();

    var suite = namespace.suite = new Y.Test.Suite({
        name: 'test hexagon logic',

        setUp: function () {

        },

        tearDown: function () {

        }
    });

    namespace.testPerformMove = new Y.Test.Case({

        setUp: function () {
            // '-   x   x   -   x   \n\
            //    x   1   x   -   2 \n\
            //  -   x   x   -   x   \n\
            //    -   x   x   x   x \n\
            //  -   2   2   -   x';
            // activePlayerID = 'player1'
            this.state = JSON.parse('{"size":[6,5],"allPlayers":["player1","player2"],"cells":[[{"disabled":true},{},{},{"disabled":true},{}],[{},{"playerID":"player1"},{},{"disabled":true},{"playerID":"player2"}],[{"disabled":true},{},{},{"disabled":true},{}],[{"disabled":true},{},{},{},{}],[{"disabled":true},{"playerID":"player2"},{"playerID":"player2"},{"disabled":true},{}]],"activePlayerID":"player1"}');
        },

        tearDown: function () {

        },

        testMoveToDisabled: function () {
            Y.Assert.isFalse(logic.performMove(
                this.state, {
                    from: [1, 1],
                    to: [0, 3],
                    type: 'jump'
                }));
            this.state.activePlayerID = 'player2';
            Y.Assert.isFalse(logic.performMove(
                this.state, {
                    from: [1, 4],
                    to: [0, 4],
                    type: 'clone'
                }));
        },

        testMoveWrongPlayer: function () {
            Y.Assert.isFalse(logic.performMove(
                this.state, {
                    from: [1, 4],
                    to: [1, 3],
                    type: 'clone'
                }));
        },

        testMoveToOtherPlayer: function () {
            Y.Assert.isFalse(logic.performMove(
                this.state, {
                    from: [1, 1],
                    to: [1, 4],
                    type: 'jump'
                }));
        },

        testMoveToSamePlayer: function () {
            this.state.activePlayerID = 'player2';
            Y.Assert.isFalse(logic.performMove(
                this.state, {
                    from: [1, 4],
                    to: [2, 4],
                    type: 'clone'
                }));
        },

        testClone: function () {
            var from = [1, 1], to = [2, 2],
                cTo = logic.cellAt(this.state, to),
                cFrom = logic.cellAt(this.state, from);

            Y.Assert.isTrue(logic.performMove(
                this.state, {
                    from: from,
                    to: to,
                    type: 'clone'
                }));

            Y.Assert.areEqual(cTo.playerID, cFrom.playerID,
                             'from / to cells playerID mismatch');
            Y.Assert.areEqual('player2',
                              logic.cellAt(this.state, [1, 4]).playerID,
                             'captured cell that is too distant');
            Y.Assert.areEqual(cFrom.playerID,
                              logic.cellAt(this.state, [2, 4]).playerID,
                             'did not capture other players cell');
            Y.Assert.isUndefined(logic.cellAt(this.state, [1, 3]).playerID,
                                'captured empty cell');
        },

        testJump: function () {
            var from = [1, 1], to = [2, 3],
                cTo = logic.cellAt(this.state, to),
                cFrom = logic.cellAt(this.state, from);

            Y.Assert.isTrue(logic.performMove(
                this.state, {
                    from: from,
                    to: to,
                    type: 'jump'
                }), 'move unsuccessfull');

            Y.Assert.isUndefined(cFrom.playerID,
                                'did not remove source cell playerID');
            Y.Assert.areEqual('player1', cTo.playerID,
                             'bad playerID of the new cell');
            Y.Assert.areEqual('player2',
                              logic.cellAt(this.state, [1, 4]).playerID,
                             'captured cell that is too distant');
            Y.Assert.areEqual('player1',
                              logic.cellAt(this.state, [2, 4]).playerID,
                             'did not capture other players cell');
            Y.Assert.isUndefined(logic.cellAt(this.state, [3, 2]).playerID,
                                'captured disabled cell');
        }

    });
    suite.add(namespace.testPerformMove);

}, '0', {
    requires: ['hexagon.logic',
               'hexagon.utils',
               'test']
});
