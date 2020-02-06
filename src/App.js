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
        completed: false
      },
      {
        id: 3,
        title: 'have fun',
        completed: false
      },
    ]
  }

  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id==id) {
        todo.completed = !todo.completed
      }
      return todo;
    })})
  }

  render () {
    //console.log(this.state.todos)
    //todos={this.state.todos} to pass todos state as props to child component
    return (
      <div className="App">
        <Todos todos={this.state.todos} markComplete={this.markComplete}/>
      </div>
    );
  }
}

export default App;
