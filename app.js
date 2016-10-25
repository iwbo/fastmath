"use strict";
var express = require('express');
var moniker = require('moniker');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3001;
server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/node_modules'));
var names = moniker.generator([moniker.adjective, moniker.noun]);
var currentRound = 1;
io.on('connection', function (socket) {
    // we store the username in the socket session for this client
    var socetData = socket.clientData = {
        username: names.choose(),
        score: 0
    };
    var clients = io.sockets.clients(null).connected;
    var otherClients = [];
    for (var id in clients) {
        if (clients[id].clientData.username !== socket.clientData.username) {
            otherClients.push(clients[id].clientData);
        }
    }
    if (otherClients.length < 10) {
        socket.emit('connected', {
            isEnabled: true,
            round: currentRound,
            clientData: socket.clientData,
            clients: otherClients
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('clientConnected', socket.clientData);
        socket.on("answer", function (data) {
            currentRound++;
            socket.emit('newScore', {
                score: ++(socket.clientData.score),
                round: currentRound
            });
            socket.broadcast.emit('newRound', {
                round: currentRound,
                winner: socket.clientData
            });
        });
        // when the user disconnects.. perform this
        socket.on('disconnect', function () {
            // echo globally that this client has left
            socket.broadcast.emit('clientDisconnected', socket.clientData);
        });
    }
    else {
        socket.emit('noRoom', {
            isEnabled: false,
            round: currentRound,
            clientData: socket.clientData,
            clients: otherClients
        });
    }
});
module.exports = app;
