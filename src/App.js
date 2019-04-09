import React, { Component } from 'react';
import './App.css';
import VisNetwork from "./components/visnetwork";
import {Pane} from "evergreen-ui";
import Header from "./components/header"
class App extends Component {
  render() {
    return (
        <Pane>
            <Header/>
            <Pane marginLeft={12}>
                <VisNetwork className="network" />
            </Pane>
        </Pane>

    );
  }
}

export default App;
