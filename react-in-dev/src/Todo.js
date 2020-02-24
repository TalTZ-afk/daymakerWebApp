import React, { Component } from "react";
import "./Todo.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      task: this.props.task,
      date: ""
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDateUpdate = this.handleDateUpdate.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleRemove() {
    this.props.removeTodo(this.props.id, false);
  }

  toggleForm() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  handleUpdate(evt) {
    evt.preventDefault();
    this.props.updateTodo(this.props.id, this.state.task);
    this.setState({ isEditing: false });
  }

  handleDateUpdate(evt) {
    evt.preventDefault();
    this.props.updateDate(this.props.id, this.state.date, true);
    this.setState({ isEditing: false });
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  handleToggle(evt) {
    this.props.toggleTodo(this.props.id);
  }

  render() {
    let result;
    if (this.state.isEditing) {
      if(this.props.chosenDate !== undefined) {
        result = (
          <CSSTransition key="editing" timeout={500} classNames="form">
            <div>
              <form className="Todo-edit-form" onSubmit={this.handleUpdate}>
                <input
                  type="text"
                  value={this.state.task}
                  name="task"
                  onChange={this.handleChange}
                />
                <button 
                  style={{
                    background: this.props.color, 
                    marginRight: this.props.language === "en" ? "" : "5px"
                  }}
                >
                  {this.props.language === "en" ? "save" : "שמור"}
                </button>
              </form>

              <form className="Todo-edit-form" onSubmit={this.handleDateUpdate}>
                <input
                  className="dateUpdateInput"
                  type="text"
                  name="date"
                  onChange={this.handleChange}
                  placeholder="dd/mm/yyyy"
                />
                <button 
                  style={{
                    background: this.props.color, 
                    marginRight: this.props.language === "en" ? "" : "5px",
                    marginTop: "5px"
                  }}
                >
                  {this.props.language === "en" ? "save" : "שמור"}
                </button>
              </form>
            </div>
          </CSSTransition>
        );
      } else {
        result = (
          <CSSTransition key="editing" timeout={500} classNames="form">
            <form className="Todo-edit-form" onSubmit={this.handleUpdate}>
              <input
                type="text"
                value={this.state.task}
                name="task"
                onChange={this.handleChange}
              />
              <button 
                style={{
                  background: this.props.color, 
                  marginRight: this.props.language === "en" ? "" : "5px"
                }}
              >
                {this.props.language === "en" ? "save" : "שמור"}
              </button>
            </form>
          </CSSTransition>
        );
      }
    } else {
      result = (
        <CSSTransition key="normal" timeout={500} classNames="task-text">
          <div>
          <li className={this.props.language === "en" ? "Todo-task" : "Todo-task-he"}  id="expand-press" onClick={this.handleToggle}>
            {this.props.task}
            <h6 style={{color: (this.props.dateExpired !== undefined && this.props.dateExpired) ? "red" : "white"}}>{ this.props.chosenDate && this.props.chosenDate }</h6>
          </li>
          <div className={this.props.language === "en" ? "Todo-buttons" : "Todo-buttons-he"}>
            <button onClick={this.toggleForm}>
              <i className="fas fa-pen" />
            </button>
            <button onClick={this.handleRemove}>
              <i className="fas fa-trash" />
            </button>
          </div>
          </div>
        </CSSTransition>
      );
    }
    return (
      <TransitionGroup
        className={this.props.completed ? "Todo completed" : "Todo"}  id="expand-press"
      >
        {result}
        
      </TransitionGroup>
    );
  }
}
export default Todo;
