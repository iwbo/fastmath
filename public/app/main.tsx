import * as React from "react";
import { Client } from "./client";
import { Game, IGame } from "./game";
import { DTM } from "../../dataTransferModels";

declare var io: SocketIOClientStatic;



export interface MainState {
    connection: DTM.IConnection;
}



export class Main extends React.Component<any, MainState> {
    constructor(props: any) {
        super(props);

        this.ioSocket = io();
        this.ioSocket.on<DTM.IConnection>('noRoom', this.ioNoRoom);
        this.ioSocket.on<DTM.IConnection>('connected', this.ioConnected);
        this.ioSocket.on<DTM.IClientData>('clientConnected', this.ioClientConnected);
        this.ioSocket.on<DTM.IClientData>('clientDisconnected', this.ioClientDisconnected);
        this.ioSocket.on<DTM.INewRound>('newRound', this.ioNewRound);
        this.ioSocket.on<DTM.INewScore>('newScore', this.ioNewScore);

        this.state = {
            connection: {
                isEnabled: false,
                round: 0,
                clientData: {
                    score: 0,
                    username: "unknown"
                },
                clients: []
            }
        }
    }

    ioSocket: SocketIOClient.Socket;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-6 offset-sm-1">
                        <h1 className="display-1 text-primary">fastmath</h1>
                    </div>
                    <div className="col-sm-4">
                        <h1 className="display-3 text-primary"><span className="text-nowrap">round: {this.state.connection.round}</span>
                        <br /><span className="text-nowrap">score: {this.state.connection.clientData.score}</span></h1>
                    </div>
                </div>
                <div className="row">

                    <div className="col-sm-6 offset-sm-1">
                        {this.state.connection.isEnabled &&
                            <div>
                                <h2 className="display-4">Hello <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <Game add={2} handleClick={this.handleClick} />
                            </div>
                        }
                        {!this.state.connection.isEnabled && this.state.connection.clientData.username != "unknown" &&
                            <div>
                                <h2 className="display-4">Sorry... <br />No room for you <strong>{this.state.connection.clientData.username}</strong>!</h2>
                                <h3 className="display-6">Please wait for someone to leave the game</h3>
                            </div>
                        }
                    </div>
                    {this.state.connection.clients.length > 0 &&
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
                    }

                </div>
            </div>
        );
    }

    handleClick = (e: React.MouseEvent<any>) => {
        this.ioSendAwnser(8);
    }

    ioNewRound = (data: DTM.INewRound) => {

        this.state.connection.round = data.round;

        this.state.connection.clients.forEach(client => {
            if (client.username === data.winner.username) {
                client.score = data.winner.score;
            }
        });

        this.setState({ connection: this.state.connection });
    }
    ioNewScore = (data: DTM.INewScore) => {
        this.state.connection.round = data.round;
        this.state.connection.clientData.score = data.score;
        this.setState({ connection: this.state.connection });
    }

    ioNoRoom = (data: DTM.IConnection) => {
        this.setState({ connection: data });
    }
    ioConnected = (data: DTM.IConnection) => {
        this.setState({ connection: data });
    }
    ioClientConnected = (data: DTM.IClientData) => {
        this.state.connection.clients.push(data);
        this.setState({ connection: this.state.connection });

    }
    ioClientDisconnected = (data: DTM.IClientData) => {
        this.state.connection.clients = this.state.connection.clients.filter((el) => {
            return el.username !== data.username;
        });
        this.setState({ connection: this.state.connection });
    }

    ioSendAwnser(value: number) {
        this.ioSocket.emit<DTM.IAnswer>("answer", { round: this.state.connection.round, value: value })
    }

}