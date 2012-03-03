YUI.add('hexagon.models.plugs.boardstate.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs.boardstate.tests'),
        utils = Y.Hexagon.utils;

    var server, game, boardstate;

    var suite = namespace.suite = new Y.Test.Suite({
        name: 'test boardstate plug',

        setUp: function () {
            server = new Y.Hexagon.server.Test(),
            game = new Y.Hexagon.models.Synchronized({
                server: server
            });
            game.plug(Y.Hexagon.models.plugs.BoardState);
            boardstate = game[Y.Hexagon.models.plugs.BoardState.NS];
        },

        tearDown: function () {
            delete server;
            delete game;
        }
    });

    namespace.testSetup = new Y.Test.Case({
        testNameSpaceExists: function () {
            Y.Assert.isObject(boardstate, 'boardstate initialization failed');
        },

        testModelAttrExist: function () {
            Y.Assert.isObject(game.board);
        }
    });
    suite.add(namespace.testSetup);

    namespace.testEvents = new Y.Test.Case({

        /**
         * Check if move received from server fires correct events
         *
         * Checks if server->board:move generates model->board:move response
         */
        testServerMoveResponse: function () {
            var move = {
                from: [0, 0],
                to: [1, 1],
                type: 'jump'
            };

            utils.assertFired.call(this, function () {
                server.fakeResponse('board:move', move);
            }, game, 'board:move', function (e, data) {

            });
        },

        /**
         * Check if state received from server fires correct events
         *
         * Checks if server->board:state generates model.board->stateChanged response.
         */
        testServerStateResponse: function () {
            var state = game.board.get('state');

            utils.assertFired.call(this, function () {
                server.fakeResponse('board:state', state);
            }, game.board, 'stateChange', function (e) {

            });
        },

        /**
         * Check if a move made loccaly is then sent to the server
         *
         * Checks if model->board:move with src: 'local' generates
         * server->send(board:move, move)
         */
        testLocalMove: function () {
            var move = {
                from: [0, 0],
                to: [1, 1],
                type: 'jump'
            };

            utils.assertFired.call(this, function () {
                game.fire('board:move', { src: 'local' }, move);
            }, server, 'sendRequested', function (e, request) {
                if (request.name === 'board:move') {
                    utils.assertObjectParams(request.data, move);
                } else {
                    Y.Assert.fail('Unexpected request name "' + request.name + '"');
                }
            });
        }
    });
    suite.add(namespace.testEvents);

}, '0', {
    requires: ['hexagon.models.plugs.boardstate',
               'hexagon.models.synchronized',
               'hexagon.server.testserver',
               'hexagon.utils',
               'test']
});
