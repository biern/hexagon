var sys = require('sys'),
    hex = require('./hexagon'),
    Server = require('./server'),
    Test = require('./test'),
    yvents = require('yvents');

require('./utils');

var bus = new hex.EventBus(),
    server = new Server(bus),
    auth = new hex.Auth(bus),
    test = new Test(server, bus);

server.listen(12345);