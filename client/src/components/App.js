import React, { Component } from 'react';
import logo from './../graphql.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fundamentals of GraphQL</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code>.
        </p>
      </div>
    );
  }
}

export default App;
