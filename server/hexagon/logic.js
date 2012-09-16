// Wrapper for ylogic.js module
var fs = require('fs'),
    YUI = require('yui').getInstance();

// Eval YUI module using this YUI instance
eval(fs.readFileSync(__dirname + '/ylogic.js', 'utf-8'));

module.exports = YUI.use('hexagon.logic').Hexagon.logic;
