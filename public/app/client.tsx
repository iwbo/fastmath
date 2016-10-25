import * as React from "react";
import { DTM } from "../../shared/dtm";


export class Client extends React.Component<DTM.IClientData, any> {



    render() {
        return (
            <li className="list-group-item">
                <span className="tag tag-default tag-pill float-xs-right">{this.props.score}</span>
                {this.props.username}
            </li>
        );
    }

}