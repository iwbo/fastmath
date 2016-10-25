declare global {
    namespace SocketIO {
        interface Socket {
            clientData: DTM.IClientData,
            emit<T>(event: string, args: T): Socket;
            on<T>(event: string, func: (data: T) => void): Socket;
        }
        interface Namespace {
            emit<T>(event: string, args: T): boolean;
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
    export interface IRound {
        hasWinner: boolean;
        id: number,
        equation: IEquation,
        correctAwnser: number
    }
    export interface IEquation {
        number1: number;
        number2: number;
        awnser: number;
        operator: string;
        roundID: number;
        awnsered: boolean;
    }


    export interface IClientData {
        username: string;
        score: number;
    }


    export interface IConnection {
        isEnabled: boolean;
        equation: IEquation,
        clientData: IClientData;
        clients: IClientData[];
    }


    export interface INewScore {
        username: string;
        score: number;
        point: number;
    }
    export interface IRoundOver {
        message: string;
    }

    export interface IAnswer {
        roundID: number;
        yes: boolean;
    }
}

