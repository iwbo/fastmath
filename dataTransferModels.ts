declare global {
    namespace SocketIO {
        interface Socket {
            clientData: DTM.IClientData,
            emit<T>(event: string, args: T): Socket;
            on<T>(event: string, func: (data: T) => void): Socket;
        }
    }

    namespace SocketIOClient {
        interface Socket {
            clientData: DTM.IClientData,
            emit<T>(event: string, args: T): Socket;
            on<T>(event: string, func: (data: T) => void): Socket;
        }
    }
}


export module DTM {

    export interface IClientData {
        username: string;
        score: number;
    }


    export interface IConnection {
        isEnabled: boolean;
        round: number;
        clientData: IClientData;
        clients: IClientData[];
    }


    export interface INewScore {
        round: number;
        score: number;
    }
    export interface INewRound {
        round: number;
        winner: IClientData;
    }

    export interface IAnswer {
        round: number;
        value: number;
    }
}

