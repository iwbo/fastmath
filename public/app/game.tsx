import * as React from "react";

export interface IGame {
    add: number;
    handleClick(e: React.MouseEvent<HTMLAnchorElement>): void
}


export class Game extends React.Component<IGame, any> {
    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.handleClick(e);
    }

    render() {
        return (
            <div>
                <h1>{this.props.add}</h1>
                <a href="#" className="btn btn-primary" onClick={this.handleClick}>
                    Click me
                </a>
            </div>
        );
    }

}