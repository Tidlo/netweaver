import React, {Component} from 'react';
import './App.css';
import Visnetwork from "./components/Visnetwork";
import {Pane} from "evergreen-ui";
import {withHotKeys} from "react-hotkeys";


const keyMap = {
    TEST: "t"
};

const handlers = {
    TEST: () => console.log("Test")
};

class App extends Component {
  render() {
      const visnetwork = withHotKeys(Visnetwork);
    return (
        <Pane>
            {/*<Header/>*/}
            <Pane marginLeft={12}>
                <Visnetwork className="network" keyMap={keyMap} handlers={handlers}/>
            </Pane>
        </Pane>

    );
  }
}

export default App;
