
YUI(YUI_config).use('hexagon.board.tests', function(Y){
    var tests = Y.Hexagon.board.tests;
    Y.Test.Runner.add(tests.testSuite);
    Y.Test.Runner.run();
});
