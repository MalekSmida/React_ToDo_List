import React, { Component } from 'react';
import Todos from './components/Todos'
import './App.css';

class App extends Component {
  state = {
    todos: [
      {
        id: 1,
        title: 'work hard',
        completed: false
      },
      {
        id: 2,
        title: 'go to gym',
        completed: true
      },
      {
        id: 3,
        title: 'have fun',
        completed: false
      },
    ]
  }

  render () {
    //console.log(this.state.todos)
    //todos={this.state.todos} to pass todos state as props to child component
    return (
      <div className="App">
        <Todos todos={this.state.todos}/>
      </div>
    );
  }
}

export default App;
