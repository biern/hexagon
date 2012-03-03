
YUI(YUI_config).use('hexagon.widgets.board.tests', 'hexagon.models.plugs.boardstate.tests', 'console', function(Y){

    new Y.Console({
        width: '400px',
        height: '700px'
    }).render('#console');

    Y.Test.Runner.add(Y.Hexagon.widgets.board.tests.suite);
    Y.Test.Runner.add(Y.Hexagon.models.plugs.boardstate.tests.suite);
    Y.Test.Runner.run();
});
