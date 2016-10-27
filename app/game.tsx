import * as React from "react";
import { DTM } from "../shared/dtm";
export interface IGame {
    equation: DTM.IEquation;
    roundOver: DTM.IRoundOver;
    nextRoundTime: number;
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
            <div >
                {this.props.equation &&
                    <div className="card card-block text-xs-center mt-3">
                        <h1 className="display-1">{this.props.equation.number1} {this.props.equation.operator} {this.props.equation.number2}&nbsp;= {this.props.equation.awnser}&nbsp;?</h1>

                        {(this.props.roundOver === null || !this.props.roundOver.youAnswered) &&
                            <div className="btn-group btn-group-lg mt-3">
                                <a href="#" className="btn btn-success" onClick={this.handleYesClick}>Yes</a>
                                <a href="#" className="btn btn-danger" onClick={this.handleNoClick}>No</a>
                            </div>
                        }
                        {(this.props.roundOver !== null && this.props.roundOver.youAnswered) &&
                            <div className="btn-group btn-group-lg mt-3">
                                <a href="#" className="btn btn-success disabled" disabled>Yes</a>
                                <a href="#" className="btn btn-danger disabled" disabled>No</a>
                            </div>
                        }

                        {this.props.roundOver && this.props.roundOver.youAnswered &&

                            <h4 className="display-4">
                                {this.props.roundOver.point === 0 &&
                                    <span className="text-info">Sorry... you are late!</span>
                                }
                                {this.props.roundOver.point === 1 &&
                                    <span className="text-success">Yippee... you are correct!</span>
                                }
                                {this.props.roundOver.point === -1 &&
                                    <span className="text-danger">Dope... wrong answer!</span>
                                }
                            </h4>
                        }

                        {(this.props.roundOver && !this.props.roundOver.youAnswered && this.props.roundOver.winner) &&

                            <h4 className="display-4">
                                <strong>{this.props.roundOver.winner}</strong> is the winner
                            </h4>
                        }

                        {(!this.props.roundOver || (this.props.roundOver && !this.props.roundOver.youAnswered && !this.props.roundOver.winner)) &&

                            <h4 className="display-4 text-white">
                                |
                            </h4>
                        }

                        <h4 className="display-4">
                            New round in ... {this.props.nextRoundTime > 0 && this.props.nextRoundTime}
                        </h4>

                    </div>
                }
            </div>
        );
    }

}