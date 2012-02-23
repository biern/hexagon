var HEX_BASE_URL = "scripts/hex/",
    HEXAGON_BASE_URL = "scripts/hexagon/";

YUI({

    filter: 'raw',
    useConsoleOutput: true,
    throwFail: true,
    groups: {
        hex: {
            base: HEX_BASE_URL,
            modules: {
	        'hex.board': {
	            path: 'board.js',
	            requires: ['arraylist-add', 'arraylist-filter', 'node', 'widget-parent', 'widget-child']
	        }
            }
        },
        hexagon: {
            base: HEXAGON_BASE_URL,
            modules: {
                'hexagon.gameview': {
                    path: 'gameview.js',
                    requires: ['view', 'hexagon.board']
                },
                'hexagon.gamemodel': {
                    path: 'gamemodel.js',
                    requires: ['model']
                },
                'hexagon.board': {
                    path: 'widgets/board/board.js',
                    requires: ['hex.board', 'hexagon.logic', 'substitute']
                },
                'hexagon.logic': {
                    path: 'logic.js',
                    requires: ['arraylist-add', 'arraylist-filter']
                }
            }
        }
    }

}).use('hexagon.gameview', 'hexagon.gamemodel', function(Y){
    var model = new Y.Hexagon.GameModel(),
        view = new Y.Hexagon.GameView({ model: model });

    view.render();

});
