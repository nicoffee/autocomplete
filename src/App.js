import React, { Component } from 'react';
import logo from './logo.svg';
import ComboBox from './components/ComboBox.js'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <ComboBox />
          <input type="text" />
      </div>
    );
  }
}

export default App;
