YUI.add('hexagon.models.plugs.boardstate.tests', function (Y) {

    var namespace = Y.namespace('Hexagon.models.plugs.boardstate.tests'),
        utils = Y.Hexagon.utils;

    var server, model, boardstate;

    var suite = namespace.suite = new Y.Test.Suite({
        name: 'test boardstate plug',

        setUp: function () {
            server = new Y.Hexagon.server.Test(),
            model = new Y.Hexagon.models.Synchronized({
                server: server
            });
            model.plug(Y.Hexagon.models.plugs.BoardState);
            boardstate = model[Y.Hexagon.models.plugs.BoardState.NS];
        },

        tearDown: function () {

        }
    });

    namespace.testSetup = new Y.Test.Case({
        testNameSpaceExists: function () {
            Y.Assert.isObject(boardstate, 'boardstate initialization failed');
        },

        testModelAttrExist: function () {
            Y.Assert.isObject(model.board);
        }
    });
    suite.add(namespace.testSetup);

    namespace.testEvents = new Y.Test.Case({

        setUp: function () {
            // Change to dummy function that always succeds
            // Only responses are tested
            this._plm = boardstate._performLocalMove;
            boardstate._performLocalMove = function() {
                return true;
            };
        },

        tearDown: function () {
            boardstate._performLocalMove = this._plm;
        },

        testPerformLocalMoveExists: function () {
            Y.Assert.isFunction(this._plm, '_performLocalMove does not exist, other tests\' results may be invalid');
        },

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
            }, model, 'remote:board:move', function (e, data) {
                Y.Assert.areEqual(e.sender, boardstate);
            });
        },

        /**
         * Check if state received from server fires correct events
         *
         * Checks if server->board:state generates model.board->stateChanged response.
         */
        testServerStateResponse: function () {
            var state = model.board.get('state');

            utils.assertFired.call(this, function () {
                server.fakeResponse('board:state', state);
            }, model.board, 'stateChange', function (e) {
                Y.Assert.areEqual(e.src, 'remote');
                Y.Assert.areEqual(e.sender, boardstate);
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
                model.fire('local:board:move', {}, move);
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
