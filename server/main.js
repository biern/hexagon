var sys = require('sys'),
    hex = require('./hexagon'),
    Server = require('./server'),
    yvents = require('yvents');

require('./utils');

var bus = new hex.EventBus(),
    server = new Server(bus),
    auth = new hex.Auth(bus);

server.listen(12345);
