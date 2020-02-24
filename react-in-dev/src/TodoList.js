import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import NewTodoForm from "./NewTodoForm";
import Todo from "./Todo";
import "./TodoList.css";
import "./TodoListHe.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class TodoList extends Component {
  constructor(props) {
    super(props);

    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleToggleCompletion = this.handleToggleCompletion.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.printDayAndMonth = this.printDayAndMonth.bind(this);
    this.handleTodoToday = this.handleTodoToday.bind(this);
    this.removeTodoYesterday = this.removeTodoYesterday.bind(this);
    this.printColor = this.printColor.bind(this);
    this.alertTodoYesterday = this.alertTodoYesterday.bind(this);
  }

  date = new Date().getDate();
  day;
  month;
  fullDate = this.printDayAndMonth() + this.date;

  dateString = new Date().toISOString();
  year = this.dateString.toString().slice(0, 4);
  month = this.dateString.toString().slice(5, 7);
  day = this.dateString.toString().slice(8, 10);
  yesterday = this.day - 1;
  currentDate = this.day + "/" + this.month + "/" + this.year;
  yesterdayDate = this.yesterday + "/" + this.month + "/" + this.year;

  printDayAndMonth() {
    
    switch (new Date().getMonth()) {
      case 0:
        this.month = "January";
        break;
      case 1:
        this.month = "February";
        break;
      case 2:
        this.month = "March";
        break;
      case 3:
        this.month = "April";
        break;
      case 4:
        this.month = "May";
        break;
      case 5:
        this.month = "June";
        break;
      case 6:
        this.month = "July";
        break;
      case 7:
        this.month = "August";
        break;
      case 8:
        this.month = "September";
        break;
      case 9:
        this.month = "October";
        break;
      case 10:
        this.month = "November";
        break;
      default:
        this.month = "December";
    }

    switch (new Date().getDay()) {
      case 0:
        this.day = "Sunday";
        break;
      case 1:
        this.day = "Monday";
        break;
      case 2:
        this.day = "Tuesday";
        break;
      case 3:
        this.day = "Wednesday";
        break;
      case 4:
        this.day = "Thursday";
        break;
      case 5:
        this.day = "Friday";
        break;
      default:
        this.day = "Saturday";
    }
    return (this.day + ", " + this.month + " ");
  }

  color = "";

  printColor() {
    switch(this.props.user.color) {
      case "blue":
        this.color = "#38b2f8";
        break;
      case "green":
        this.color = "#42e6a4";
        break;
      case "black":
        this.color = "black";
        break;
      default:
        this.color = "#FF6666";
    }
    return this.color;
  }

  handleCreate(newTodo) {
    this.props.create(newTodo);
  }

  handleUpdate(id, updatedTask, isDate) {
    this.props.update(id, updatedTask, isDate);
  }

  handleToggleCompletion(id) {
    this.props.toggleCompletion(id);
  }

  handleRemove(id, isPlannedDelete) {
    this.props.delete(id, isPlannedDelete);
  }

  handleTodoToday(plannedTodo) {
    let count = 0;
    this.props.user.lists[0].todos.map(todo => (
      todo._id !== plannedTodo._id && count++
    ));
    if(count === this.props.user.lists[0].todos.length) {
      this.props.doPlannedTodo(plannedTodo);
    }
  }

  removeTodoYesterday(plannedTodo) {
    this.props.delete(plannedTodo._id, true);
  }

  alertTodoYesterday(plannedTodo) {
    this.props.handleAlertedTodo(plannedTodo._id, true);
  }

  render() {
    this.props.user.lists[1].todos.map(plannedTodo => (
      plannedTodo.chosenDate === this.currentDate && (this.handleTodoToday(plannedTodo))
    ));

    this.props.user.lists[0].todos.map(plannedTodo => {
      if(plannedTodo.chosenDate !== undefined) {
        if(plannedTodo.chosenDate === this.yesterdayDate) {
          if(plannedTodo.completed) {
            return this.removeTodoYesterday(plannedTodo);
          } else {
            if(plannedTodo.dateExpired === false) {
              return this.alertTodoYesterday(plannedTodo);
            }
          }
        }
      }
    });

    const todos = this.props.user.lists[this.props.currentList].todos.map(todo => {
      return (
        <CSSTransition key={todo._id} timeout={500} classNames='todo'>
          <Todo
            key={todo._id}
            id={todo._id}
            task={todo.todo}
            completed={todo.completed}
            chosenDate={todo.chosenDate}
            color={this.printColor()}
            language={this.props.user.locale === undefined ? this.props.user.language.slice(0, 2) : this.props.user.locale}
            dateExpired={todo.dateExpired}
            removeTodo={this.handleRemove}
            updateTodo={this.handleUpdate}
            updateDate={this.handleUpdate}
            toggleTodo={this.handleToggleCompletion}
          />
        </CSSTransition>
      );
    });
    return (
      <div className="TodoList" id="expand-press" style={{background: this.printColor()}}>
        {
          this.props.user.lists[this.props.currentList].name === "Today" ? 
            <div>
            <h1  id="expand-press">{this.props.user.lists[this.props.currentList].name}</h1>
            <h4  id="expand-press">{this.fullDate}</h4>
            </div>
          :
            <h1  id="expand-press">{this.props.user.lists[this.props.currentList].name}</h1>
        }
        
        <NewTodoForm currentList={this.props.currentList} createTodo={this.handleCreate} />

        <ul>
          <TransitionGroup className="todo-list">{todos}</TransitionGroup>
        </ul>
      </div>
    );
  }
}
export default TodoList;
