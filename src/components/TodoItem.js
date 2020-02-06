import React, { Component } from 'react'
import Todos from './Todos'

export class TodoItem extends Component {
  render() {
    return (
      <div>
        <p>
          {this.props.todo.title}
        </p>
      </div>
    )
  }
}

export default TodoItem

// rce + tab => generate the code