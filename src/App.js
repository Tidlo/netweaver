import React, {Component} from 'react';
import './App.css';
import Visnetwork from "./components/Visnetwork";
import {Pane} from "evergreen-ui";
import {HotKeys} from "react-hotkeys";


const keyMap = {
    DELETE_SELECTED: "del",
    ADD_ROUTER: "r",
    ADD_SWITCH: "s",
    ADD_CLIENT: "c",
    ADD_EDGE: ["e", "l"],
};


class App extends Component {
  render() {
    return (
        <HotKeys keyMap={keyMap}>
            <Pane>
                <Pane marginLeft={12}>
                    <Visnetwork className="network"/>
                </Pane>
            </Pane>
        </HotKeys>
    );
  }
}

export default App;
