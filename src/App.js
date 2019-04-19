import React, {Component} from 'react';
import './App.css';
import Visnetwork from "./components/Visnetwork";
import {Pane} from "evergreen-ui";

class App extends Component {
  render() {
    return (
        <Pane>
            {/*<Header/>*/}
            <Pane marginLeft={12}>
                <Visnetwork className="network"/>
            </Pane>
        </Pane>

    );
  }
}

export default App;
