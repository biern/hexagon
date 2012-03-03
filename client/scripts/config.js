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

                'hexagon.logic': {
                    path: 'logic/logic.js',
                    requires: ['arraylist-add', 'arraylist-filter']
                },

                'hexagon.widgets.board': {
                    path: 'widgets/board/board.js',
                    requires: ['hex.board', 'hexagon.logic', 'substitute']
                },

                'hexagon.views.game': {
                    path: 'views/game/game.js',
                    requires: ['view', 'hexagon.widgets.board']
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
                    requires: ['hexagon.models.synchronized', 'hexagon.models.plugs.boardstate']
                },

                'hexagon.models.plugs.boardstate' : {
                    path: 'models/plugs/boardstate.js',
                    requires: ['plugin', 'base']
                }
            }
        },
        hexagon_tests: {
            base: HEXAGON_BASE_URL,
            modules: {
                'hexagon.widgets.board.tests': {
                    path: 'widgets/board/tests.js',
                    requires: ['hexagon.widgets.board',
                               'hexagon.utils',
                               'test']
                }

            }
        }
    }
};
