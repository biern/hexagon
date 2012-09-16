var HEX_BASE_URL = "scripts/hex/",
    HEXAGON_BASE_URL = "scripts/hexagon/";

window.YUI_config = {
    filter: 'raw',
    useConsoleOutput: true,
    throwFail: true,
    groups: {
        hex: {
            base: HEX_BASE_URL,
            modules: {
	        'hex.board': {
	            path: 'board/board.js',
	            requires: ['arraylist-add', 'arraylist-filter', 'node', 'widget-parent', 'widget-child']
	        }
            }
        },
        hexagon: {
            base: HEXAGON_BASE_URL,
            modules: {
                'hexagon.app': {
                    path: 'app/app.js',
                    requires: ['app', 'handlebars',
                               'hexagon.models.game',
                               'hexagon.views.game',
                               'hexagon.views.localgame',
                               'hexagon.views.onlineplay',
                               'hexagon.server.testserver',
                               'hexagon.server.socketio']
                },

                'hexagon.logic': {
                    path: 'logic/logic.js',
                    requires: ['arraylist-add', 'arraylist-filter']
                },

                'hexagon.widgets.board': {
                    path: 'widgets/board/board.js',
                    requires: ['hex.board', 'hexagon.logic', 'plugin', 'substitute']
                },

                'hexagon.widgets.scores': {
                    path: 'widgets/scores/scores.js',
                    requires: ['hexagon.logic', 'node', 'substitute']
                },

                'hexagon.widgets.activeplayer': {
                    path: 'widgets/activeplayer/activeplayer.js',
                    requires: ['node', 'substitute']
                },

                'hexagon.views.game': {
                    path: 'views/game/game.js',
                    requires: ['hexagon.widgets.board',
                               'hexagon.widgets.scores',
                               'hexagon.widgets.activeplayer',
                               'view']
                },

                'hexagon.views.localgame': {
                    path: 'views/localgame/localgame.js',
                    requires: ['hexagon.views.game']
                },

                'hexagon.views.onlineplay': {
                    path: 'views/onlineplay/onlineplay.js',
                    requires: ['hexagon.views.template']
                },

                'hexagon.views.template': {
                    path: 'views/template/template.js',
                    requires: ['view', 'handlebars']
                },

                'hexagon.views.login': {
                    path: 'views/login/login.js',
                    requires: ['hexagon.views.template']
                },

                'hexagon.utils': {
                    path: 'utils/utils.js',
                    requires: ['test']
                },

                // TODO: separate those below from hexagon

                'hexagon.models.synchronized': {
                    path: 'models/synchronized/synchronized.js',
                    requires: ['model']
                },

                'hexagon.models.game': {
                    path: 'models/game/game.js',
                    requires: ['hexagon.models.synchronized',
                               'hexagon.models.plugs.boardstate',
                               'hexagon.models.plugs.auth']
                },

                'hexagon.models.plugs.synchronized': {
                    path: 'models/plugs/synchronized/synchronized.js',
                    requires: ['plugin', 'base']
                },

                'hexagon.models.plugs.boardstate': {
                    path: 'models/plugs/boardstate/boardstate.js',
                    requires: ['hexagon.models.plugs.synchronized',
                               'hexagon.logic']
                },

                'hexagon.models.plugs.auth': {
                    path: 'models/plugs/auth/auth.js',
                    requires: ['hexagon.models.plugs.synchronized']
                },

                'hexagon.server.socketio': {
                    path: 'server/socketio/socketio.js',
                    requires: ['base']
                },

                'hexagon.server.testserver': {
                    path: 'server/testserver/testserver.js',
                    requires: ['base']
                }
            }
        },
        hexagon_tests: {
            base: HEXAGON_BASE_URL,
            modules: {
                'hexagon.logic.tests': {
                    path: 'logic/tests.js',
                    requires: ['hexagon.logic',
                               'hexagon.utils',
                               'test']
                },

                'hexagon.widgets.board.tests': {
                    path: 'widgets/board/tests.js',
                    requires: ['hexagon.widgets.board',
                               'hexagon.utils',
                               'test']
                },

                'hexagon.models.plugs.boardstate.tests': {
                    path: 'models/plugs/boardstate/tests.js',
                    requires: ['hexagon.models.plugs.boardstate',
                               'hexagon.models.synchronized',
                               'hexagon.server.testserver',
                               'hexagon.utils',
                               'test']
                },

                'hexagon.server.tests': {
                    path: 'server/tests.js',
                    requires: ['hexagon.server.socketio',
                               'test']
                }
            }
        }
    }
};
