import React, { Component } from "react";
import "./List.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isEditing: false,
        newListName: this.props.listName
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }
  handleRemove() {
    this.props.removeTodo(this.props.id);
  }
  toggleForm() {
    this.setState({ isEditing: !this.state.isEditing });
  }
  handleUpdate(evt) {
    evt.preventDefault();
    //take new task data and pass up to parent
    this.props.updateTodo(this.props.id, this.state.newListName);
    this.setState({ isEditing: false });
  }
  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }
  render() {
    let result;
    if (this.state.isEditing) {
      result = (
        <CSSTransition key='editing' timeout={500} classNames='form'>
          <form className='Todo-edit-form' onSubmit={this.handleUpdate}>
            <input
              type='text'
              value={this.state.newListName}
              name='newListName'
              onChange={this.handleChange}
            />
            <button>Save</button>
          </form>
        </CSSTransition>
      );
    } else {
      result = (
        <CSSTransition key='normal' timeout={500} classNames='task-text'>
          <li className='Todo-task'>
            {this.props.newListName}
          </li>
        </CSSTransition>
      );
    }
    return (
      <TransitionGroup
        className={this.props.id > 2 ? "UI-obj list-name user-created-list" : "UI-obj list-name"}
      >
        {result}
        <div className='Todo-buttons'>
          <button onClick={this.toggleForm}>
            <i className='fas fa-pen' />
          </button>
          <button onClick={this.handleRemove}>
            <i className='fas fa-trash' />
          </button>
        </div>
      </TransitionGroup>
    );
  }
}
export default List;