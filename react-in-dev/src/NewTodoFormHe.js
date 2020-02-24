import React, { Component } from "react";
import uuid from "uuid/v4";
import DatePicker from "react-datepicker";
import "./NewTodoFormHe.css";

class NewTodoFormHe extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      task: "",
      chosenDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
  }

  handleChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if(this.props.currentList === "1") {
      this.props.createTodo({ task: this.state.task, chosenDate: this.state.chosenDate, id: uuid(), completed: false });
    } else {
      this.props.createTodo({ task: this.state.task, id: uuid(), completed: false });
    }
    this.setState({ task: "" });
  }

  handleChangeDate(date) {
    this.setState({
      chosenDate: date
    });
  }

  render() {
    if(this.props.currentList === "1") {
      return (
        <form className="NewTodoForm-he" id="expand-press" onSubmit={this.handleSubmit}>
          <label id="expand-press" htmlFor="task">משימה חדשה</label>
          <input
            type="text"
            placeholder="משימה חדשה"
            id="task"
            name="task"
            value={this.state.task}
            onChange={this.handleChange}
          />
          <DatePicker 
            selected={this.state.chosenDate}
            onChange={this.handleChangeDate}
            minDate={new Date()}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            customInput={<button id="expand-press" type="button" className="btn-calendar-open"><i className="far fa-calendar-alt"></i></button>}
          />
          <button id="expand-press" className="add-todo">הוסף משימה</button>
        </form>
      );
    } else {
      return (
        <form className="NewTodoForm-he" onSubmit={this.handleSubmit}>
          <label htmlFor="task">משימה חדשה</label>
          <input
            type="text"
            placeholder="משימה חדשה"
            id="task"
            name="task"
            value={this.state.task}
            onChange={this.handleChange}
          />
          <button id="expand-press" className="add-todo">הוסף משימה</button>
        </form>
      );
    }
  }
}
export default NewTodoFormHe;
