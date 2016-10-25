import { DTM } from "../shared/dtm";
import { Game } from "../server/game";
var moniker = require("moniker");
var names = moniker.generator([moniker.adjective, moniker.noun]);


export class IoConnection {
    constructor(io: SocketIO.Server) {
        io.on("connection", this.onConnection);
    }

    private onConnection = (socket: SocketIO.Socket) => {
        // we store the username in the socket session for this client
        var socetData = socket.clientData = {
            username: names.choose(),
            score: 0
        }

        var clients = socket.server.sockets.clients(null).connected;

        var otherClients: DTM.IClientData[] = [];
        for (var id in clients) {
            if (clients[id].clientData.username !== socket.clientData.username) {
                otherClients.push(clients[id].clientData);
            }
        }

        if (otherClients.length < 10) // for up to 10 concurrent users
        {
            this.connectionAllowed(socket, otherClients);
        } else {
            this.connectionNotAllowed(socket);
        }
    }
    private connectionAllowed = (socket: SocketIO.Socket, otherClients: DTM.IClientData[]) => {

        socket.emit<DTM.IConnection>("connected", {
            isEnabled: true,
            equation: Game.getLastEquation(),
            clientData: socket.clientData,
            clients: otherClients
        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit<DTM.IClientData>("clientConnected", socket.clientData);


        socket.on<DTM.IAnswer>("answer", (data) => {
            this.onAnswer(socket, data);
        });


        // when the user disconnects.. perform this
        socket.on("disconnect", this.onDisconnected);
    }
    private connectionNotAllowed = (socket: SocketIO.Socket) => {

        socket.emit<DTM.IConnection>("noRoom", {
            isEnabled: false,
            equation: null,
            clientData: socket.clientData,
            clients: []
        });
    }

    private onAnswer = (socket: SocketIO.Socket, data: DTM.IAnswer) => {

        var point = Game.getPoint(data);


        var message = "Sorry... you are late!";
        if (point === 1) {
            message = "Yippee... you are correct!";
        } else if (point === -1) {
            message = "Dope... wrong answer!";
        }

        if (point === 1) {
            var newEquation = Game.getNextEquation();
            socket.emit<DTM.IRoundOver>("roundOver", {
                message: "Correct ... you get a point"
            });
            socket.broadcast.emit<DTM.IRoundOver>("roundOver", {
                message: "Winner is ... "+ socket.clientData.username
            });
            setTimeout(() => {
                socket.server.sockets.emit<DTM.IEquation>("newRound", newEquation);
            }, 1000 * 5);
        } else {
            socket.emit<DTM.IRoundOver>("roundOver", {
                message: message
            });
        }


        socket.clientData.score = socket.clientData.score + point;
        socket.server.sockets.emit<DTM.INewScore>("newScore", {
            score: socket.clientData.score,
            username: socket.clientData.username,
            point: point
        });

    }
    private onDisconnected = (socket: SocketIO.Socket) => {
        // echo globally that this client has left
        if (socket && socket.broadcast)
            socket.broadcast.emit<DTM.IClientData>("clientDisconnected", socket.clientData);
    }

}