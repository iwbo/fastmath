import * as React from "react";
import { DTM } from "../../shared/dtm";
export interface IGame {
    equation: DTM.IEquation;
    message: string;
    handleYesClick(e: React.MouseEvent<HTMLAnchorElement>): void;
    handleNoClick(e: React.MouseEvent<HTMLAnchorElement>): void;
}


export class Game extends React.Component<IGame, any> {
    handleYesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.handleYesClick(e);
    }
    handleNoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.handleNoClick(e);
    }

    render() {
        return (
            <div>
                {this.props.equation &&
                    <div>
                        <h1>{this.props.equation.number1} {this.props.equation.operator} {this.props.equation.number2}={this.props.equation.awnser}</h1>
                        {!this.props.equation.awnsered &&
                            <div>
                                <a href="#" className="btn btn-primary" onClick={this.handleYesClick}>Yes</a>
                                <a href="#" className="btn btn-primary" onClick={this.handleNoClick}>No</a>
                            </div>
                        }
                        {this.props.equation.awnsered &&
                            <h1>
                                {this.props.message}
                            </h1>
                        }
                    </div>
                }
            </div>
        );
    }

}