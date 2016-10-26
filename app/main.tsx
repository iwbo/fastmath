import * as React from "react";
import { Client } from "./client";
import { Game, IGame } from "./game";
import { DTM } from "../shared/dtm";

declare var io: SocketIOClientStatic;



export interface MainState {
    connection: DTM.IConnection;
    roundOver: DTM.IRoundOver;
    nextRoundTime: number;
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
        this.ioSocket.on<number>("nextRoundTime", this.onNextRoundTime)


        this.state = {
            connection: {
                isEnabled: false,
                equation: null,
                clientData: {
                    score: 0,
                    username: "unknown",
                    lastRound: 0
                },
                clients: []

            },
            roundOver: null,
            nextRoundTime: 0
        }
    }

    ioSocket: SocketIOClient.Socket;



    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-8 offset-sm-2">
                        <h1 className="display-1 text-primary">fastmath</h1>
                        <h4 className="display-4 text-primary">
                            {this.state.connection.equation &&
                                <span className="text-nowrap">round: {this.state.connection.equation.roundID}&nbsp;&nbsp;</span>
                            }
                            <span className="text-nowrap">score: {this.state.connection.clientData.score}</span>
                        </h4>
                    </div>
                </div>
                <div className="row">

                    <div className="col-sm-8 offset-sm-2">
                        {this.state.connection.isEnabled &&
                            <div>
                                <h2 className="display-4">Hello <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <Game nextRoundTime={this.state.nextRoundTime} roundOver={this.state.roundOver} equation={this.state.connection.equation} handleYesClick={this.handleYesClick} handleNoClick={this.handleNoClick} />
                            </div>
                        }
                        {!this.state.connection.isEnabled && this.state.connection.clientData.username != "unknown" &&
                            <div>
                                <h2 className="display-4">Sorry... <br />No room for you <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <h3 className="display-6">Please wait for someone to leave the game</h3>
                            </div>
                        }
                    </div>

                    <div className="col-sm-8 offset-sm-2 mt-3 mb-3">
                        <ul className="list-group">
                            <li href="#" className="list-group-item active">
                                {this.state.connection.clients.length > 0 &&
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
                                }

                                {this.state.connection.clients.length === 0 &&
                                    <h5 className="list-group-item-heading">
                                        <a target="_blank" href="https://goo.gl/kxK4L9" className="text-white">You are all alone!</a>
                                    </h5>
                                }
                            </li>
                            {this.state.connection.clients.map((client) =>
                                <Client key={client.username} username={client.username} lastRound={client.lastRound} score={client.score} />
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
        this.state.roundOver = data;
        console.log(data);
        this.setState(this.state);
    }
    onNewRound = (data: DTM.IEquation) => {
        this.state.connection.equation = data;
        this.state.roundOver = null;
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

    onNextRoundTime = (data:number) =>{
        this.state.nextRoundTime = data;
        this.setState(this.state);
    }

    sendAwnser(yes: boolean) {
        this.ioSocket.emit<DTM.IAnswer>("answer", { roundID: this.state.connection.equation.roundID, yes: yes });
    }

}