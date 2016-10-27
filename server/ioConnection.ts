import { DTM } from "../shared/dtm";
import { Game } from "../server/game";
var moniker = require("moniker");
var names = moniker.generator([moniker.adjective, moniker.noun]);


export class IoConnection {
    constructor(io: SocketIO.Server) {
        io.on("connection", this.onConnection);

        // listen to round timer
        Game.emitter.on("nextRoundTime", (data: number) => { this.onNextRoundTime(io, data); });
    }

    private onConnection = (socket: SocketIO.Socket) => {
        // echo globally that this client has left
        socket.on("disconnect", () => { this.onDisconnected(socket) });

        // we store custom client data in the socket session for this client
        if (!socket.clientData)
            socket.clientData = {
                username: names.choose(), // pick a random name
                score: 0,
                lastRound: 0
            }

        // get custom client data from already connected clients
        var clients = socket.server.sockets.clients(null).connected;
        var otherClients: DTM.IClientData[] = [];
        for (var id in clients) {
            if (clients[id].clientData.username !== socket.clientData.username) {
                otherClients.push(clients[id].clientData);
            }
        }


        if (otherClients.length < 10){ // for up to 10 concurrent users can play
            this.connectionAllowed(socket, otherClients);
        } else {
            // display a "No room for you" message to the client 
            this.connectionNotAllowed(socket);
        }


    }
    private connectionAllowed = (socket: SocketIO.Socket, otherClients: DTM.IClientData[]) => {

        // send back custom connection info to caller
        socket.emit<DTM.IConnection>("connected", {
            isEnabled: true,
            equation: Game.getLastEquation(), // get the last equation or if no equestion start the game
            clientData: socket.clientData,
            clients: otherClients
        });

        // let others know that a client has connected
        socket.broadcast.emit<DTM.IClientData>("clientConnected", socket.clientData);

        // listen to client answer to the equation
        socket.on<DTM.IAnswer>("answer", (data) => {
            this.onAnswer(socket, data);
        });


    }
    private connectionNotAllowed = (socket: SocketIO.Socket) => {
        
        socket.emit<DTM.IConnection>("noRoom", {
            isEnabled: false,
            equation: null,
            clientData: socket.clientData,
            clients: []
        });
        socket.disconnect();
    }

    private onAnswer = (socket: SocketIO.Socket, data: DTM.IAnswer) => {
        if (data.roundID > socket.clientData.lastRound) { // don't accept multiple answers
            socket.clientData.lastRound = data.roundID;
            var point = Game.getPoint(data);
            // point == 1, first correct answer
            // point == 0, late correct answer
            // point == -1, wrong answer



            // round is always over for the caller
            socket.emit<DTM.IRoundOver>("roundOver", {
                youAnswered: true,
                point: point,
                winner: ""
            });

            if (point === 1) { // first correct answer will stop the current round 
                Game.stopRound(); // stop new round countdown

                // let everybody know that the round is over
                socket.broadcast.emit<DTM.IRoundOver>("roundOver", {
                    youAnswered: false,
                    point: point,
                    winner: socket.clientData.username
                });
                var i = 5; // A new round starts in 5 seconds after the end of last one. 
                var waitInterval = setInterval(() => {
                    this.onNextRoundTime(socket.server, --i);
                    if (i <= 0) {
                        clearInterval(waitInterval);
                    }
                }, 1000 * 1);
                this.onNextRoundTime(socket.server, i); // send the new time
            }

            if (point !== 0) { // let everybody know about the new score of the caller
                socket.clientData.score = socket.clientData.score + point;
                socket.server.sockets.emit<DTM.INewScore>("newScore", {
                    score: socket.clientData.score,
                    username: socket.clientData.username,

                });
            }
        }
    }

    private onNextRoundTime = (io: SocketIO.Server, time: number) => {
        if (time <= 0) { // start a new round
            var newEquation = Game.startNewRound();
            io.sockets.emit<DTM.IEquation>("newRound", newEquation);
        }

        io.sockets.emit<number>("nextRoundTime", time);
    }

    private onDisconnected = (socket: SocketIO.Socket) => {
        // echo globally that this client has left
        if (socket && socket.broadcast)
            socket.broadcast.emit<DTM.IClientData>("clientDisconnected", socket.clientData);
    }

}