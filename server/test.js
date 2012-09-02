var yvents = require('yvents');


function Test (server, bus) {
    yvents.Base.call(this, bus);

    var io = server.io;

    // // Room creation
    // bus.ns('client', new ClientNS(bus, io));
    // bus.client.room('test');
    // bus.client.room('auth');

    // Testing player
    bus.client.on('test:hello', function (data) {
        console.log('hello', data.name);
        data.socket.emit('test:hello', {name: data.name});
    });

    bus.client.on('auth:request', function (data) {
        console.log('hello', data.username);
    });

    bus.ns('player').on('auth:request', function (data) {
        console.log('already logged in!', data.player.username);
    });

    // // Testing room
    // bus.client.test.join(socket);
    // bus.client.test.on('auth:request', function (data) {
    //     console.log('witaj w pokoju', data.username);
    // });

    // bus.client.test.on('test signal', function (e, data) {
    //     console.log('test signal', data);
    // });

    // socket.emit('test signal', 'socket emit');
    // socket.fire('test signal', 'socket fire');

    // // To niżej nie działa
    // bus.client.test.emit('test signal', 'room emit');
    // bus.client.test.fire('test signal', 'room fire');

    // // // setTimeout(function () {
    // // //     bus.client.test.leave(socket);
    // // // }, 5000);


};

yvents.subclass(Test, {}, {

});

module.exports = Test;