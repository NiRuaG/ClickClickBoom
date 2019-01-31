import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';

class App extends Component {
  render() {
    return (
      <div className="App">

        <Main />

        <footer>
          <img src={logo} className="App-logo" alt="logo" />
        </footer>

      </div>
    );
  }
}

export default App;
