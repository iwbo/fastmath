import * as React from "react";
import { Client } from "./client";
import { Game, IGame } from "./game";
import { DTM } from "../../shared/dtm";

declare var io: SocketIOClientStatic;



export interface MainState {
    connection: DTM.IConnection;
    gameMessage: string;
}



export class Main extends React.Component<any, MainState> {
    constructor(props: any) {
        super(props);

        this.ioSocket = io();
        this.ioSocket.on<DTM.IConnection>("noRoom", this.onNoRoom);
        this.ioSocket.on<DTM.IConnection>("connected", this.onConnected);
        this.ioSocket.on<DTM.IClientData>("clientConnected", this.onClientConnected);
        this.ioSocket.on<DTM.IClientData>("clientDisconnected", this.onClientDisconnected);
        this.ioSocket.on<DTM.INewScore>("newScore", this.onNewScore);
        this.ioSocket.on<DTM.IRoundOver>("roundOver", this.onRoundOver)
        this.ioSocket.on<DTM.IEquation>("newRound", this.onNewRound)

        this.state = {
            connection: {
                isEnabled: false,
                equation: null,
                clientData: {
                    score: 0,
                    username: "unknown"
                },
                clients: []
            },
            gameMessage: "Lets start!"
        }
    }

    ioSocket: SocketIOClient.Socket;



    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6 offset-sm-1">
                        <h1 className="display-1 text-primary">fastmath</h1>
                    </div>
                    <div className="col-sm-4">
                        {this.state.connection.equation &&
                            <h1 className="display-3 text-primary"><span className="text-nowrap">round: {this.state.connection.equation.roundID}</span></h1>
                        }
                        <h1 className="display-3 text-primary"><span className="text-nowrap">score: {this.state.connection.clientData.score}</span></h1>
                    </div>
                </div>
                <div className="row">

                    <div className="col-sm-6 offset-sm-1">
                        {this.state.connection.isEnabled &&
                            <div>
                                <h2 className="display-4">Hello <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <Game message={this.state.gameMessage} equation={this.state.connection.equation} handleYesClick={this.handleYesClick} handleNoClick={this.handleNoClick} />
                            </div>
                        }
                        {!this.state.connection.isEnabled && this.state.connection.clientData.username != "unknown" &&
                            <div>
                                <h2 className="display-4">Sorry... <br />No room for you <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <h3 className="display-6">Please wait for someone to leave the game</h3>
                            </div>
                        }
                    </div>

                    <div className="col-sm-4">
                        <ul className="list-group">
                            <li href="#" className="list-group-item active">
                                <h5 className="list-group-item-heading">
                                    {this.state.connection.clients.length}
                                    {this.state.connection.clients.length === 1 &&
                                        <span> player also playing</span>
                                    }
                                    {this.state.connection.clients.length > 1 &&
                                        <span> players also playing</span>
                                    }
                                    <span>...</span>
                                </h5>
                            </li>
                            {this.state.connection.clients.map((client) =>
                                <Client key={client.username} username={client.username} score={client.score} />
                            )}
                        </ul>
                    </div>


                </div>
            </div>
        );
    }

    handleYesClick = (e: React.MouseEvent<any>) => {
        this.sendAwnser(true);
    }
    handleNoClick = (e: React.MouseEvent<any>) => {
        this.sendAwnser(false);
    }

    onNewScore = (data: DTM.INewScore) => {


        if (data.username === this.state.connection.clientData.username) {
            this.state.connection.clientData.score = data.score;

        } else {
            this.state.connection.clients.forEach(client => {
                if (client.username === data.username) {
                    client.score = data.score;
                }
            });
        }

        this.setState(this.state);
    }

    onRoundOver = (data: DTM.IRoundOver) => {
        this.state.connection.equation.awnsered = true;
        this.state.gameMessage = data.message;
        this.setState(this.state);
    }
    onNewRound = (data: DTM.IEquation) => {
        this.state.connection.equation = data;
        this.setState(this.state);
    }
    onNoRoom = (data: DTM.IConnection) => {
        this.state.connection = data;
        this.setState(this.state);
    }
    onConnected = (data: DTM.IConnection) => {
        this.state.connection = data;
        this.setState(this.state);
    }
    onClientConnected = (data: DTM.IClientData) => {
        this.state.connection.clients.push(data);
        this.setState(this.state);

    }
    onClientDisconnected = (data: DTM.IClientData) => {
        this.state.connection.clients = this.state.connection.clients.filter((el) => {
            return el.username !== data.username;
        });
        this.setState(this.state);
    }

    sendAwnser(yes: boolean) {
        this.ioSocket.emit<DTM.IAnswer>("answer", { roundID: this.state.connection.equation.roundID, yes: yes });
    }

}