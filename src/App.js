import React, { Component } from 'react';
import './App.css';
import VisNetwork from "./components/visnetwork";


class App extends Component {
  render() {
    return (
      <div >
        <div className="App">
          <VisNetwork className="network" />
        </div>
      </div>
    );
  }
}

export default App;
