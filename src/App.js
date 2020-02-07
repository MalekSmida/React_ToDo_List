import React, { Component } from 'react';
import Todos from './components/Todos'
import Header from './components/layout/Header'
import './App.css';
import AddTodo from './components/AddTodo';

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


  //Toggle completed

  markComplete = (id) => {
    this.setState({ todos: this.state.todos.map(todo => {
      if(todo.id===id) {
        todo.completed = !todo.completed
      }
      return todo;
    })})
  }

  //Delete todo

  delTodo = (id) => {
    this.setState({ todos: [...this.state.todos.filter(todo => todo.id !== id)]});
  }

  //Add todo

  addTodo = (title) => {
    //console.log(title)
    const newTodo ={
      id: 4,
      title,
      competed: false
    }
    this.setState({todos: [...this.state.todos, newTodo]});
  }

  render () {
    //console.log(this.state.todos)
    //todos={this.state.todos} to pass todos state as props to child component
    return (
      <div className="App">
        <div className="container">
          <Header/>
          <AddTodo addTodo={this.addTodo}/>
          <Todos todos={this.state.todos} markComplete={this.markComplete} delTodo={this.delTodo}/>
        </div>
      </div>
    );
  }
}

export default App;
