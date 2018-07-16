import React, { Component } from 'react';
import logo from './graphql.png';
import './App.css';
import Posts from './components/Posts'
import AddPost from './components/AddPost'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fundamentals of GraphQL</h1>
        </header>

        <AddPost/>
        <Posts/>

      </div>
    );
  }
}

export default App;
