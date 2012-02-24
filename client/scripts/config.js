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
                'hexagon.gameview': {
                    path: 'gameview/gameview.js',
                    requires: ['view', 'hexagon.widgets.board']
                },
                'hexagon.gamemodel': {
                    path: 'gamemodel/gamemodel.js',
                    requires: ['model']
                },
                'hexagon.widgets.board': {
                    path: 'widgets/board/board.js',
                    requires: ['hex.board', 'hexagon.logic', 'substitute']
                },
                'hexagon.logic': {
                    path: 'logic/logic.js',
                    requires: ['arraylist-add', 'arraylist-filter']
                }
            }
        },
        hexagon_tests: {
            base: HEXAGON_BASE_URL,
            modules: {
                'hexagon.widgets.board.tests': {
                    path: 'widgets/board/tests.js',
                    requires: ['hexagon.widgets.board', 'test']
                }
            }
        }
    }
};
