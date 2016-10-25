import { DTM } from "./dataTransferModels";


var express = require('express');
var moniker = require('moniker');
var app = express();
var server = require('http').createServer(app);
var io: SocketIO.Server = require('socket.io')(server);
var port = process.env.PORT || 3001;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/node_modules'));

var names = moniker.generator([moniker.adjective, moniker.noun]);

var currentRound = 1;



io.on('connection', function (socket: SocketIO.Socket) {
  // we store the username in the socket session for this client
  var socetData = socket.clientData = {
    username: names.choose(),
    score: 0
  }






  var clients = io.sockets.clients(null).connected;

  var otherClients: DTM.IClientData[] = [];
  for (var id in clients) {
    if (clients[id].clientData.username !== socket.clientData.username) {
      otherClients.push(clients[id].clientData);
    }
  }

  if (otherClients.length < 10) // for up to 10 concurrent users
  {


    socket.emit<DTM.IConnection>('connected', {
      isEnabled: true,
      round: currentRound,
      clientData: socket.clientData,
      clients: otherClients
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit<DTM.IClientData>('clientConnected', socket.clientData);


    socket.on<DTM.IAnswer>("answer", (data) => {
      currentRound++;
      socket.emit<DTM.INewScore>('newScore', {
        score: ++(socket.clientData.score),
        round: currentRound
      });
      socket.broadcast.emit<DTM.INewRound>('newRound', {
        round: currentRound,
        winner: socket.clientData
      });

    });


    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      // echo globally that this client has left
      socket.broadcast.emit<DTM.IClientData>('clientDisconnected', socket.clientData);
    });

  } else {
    socket.emit<DTM.IConnection>('noRoom', {
      isEnabled: false,
      round: currentRound,
      clientData: socket.clientData,
      clients: otherClients
    });
  }


});

module.exports = app;