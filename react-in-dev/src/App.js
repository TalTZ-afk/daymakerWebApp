import React, { Component } from "react";
import axios from "axios";
import TodoList from "./TodoList";
import TodoListHe from "./TodoListHe";
import UI from "./UI";
import UIHe from "./UIHe";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: null,
      boolean: false,
      user: null,
      currentList: 0
    };
    this.getUserFromDb = this.getUserFromDb.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.toggleCompletion = this.toggleCompletion.bind(this);
    this.remove = this.remove.bind(this);
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleChangeCurrentList = this.handleChangeCurrentList.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);
    this.handleListNameUpdate = this.handleListNameUpdate.bind(this);
    this.copyPlannedTodo = this.copyPlannedTodo.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleAlertedTodo = this.handleAlertedTodo.bind(this);
    this.handleChangeLang = this.handleChangeLang.bind(this);
  }

  componentDidMount() {
    this.getUserFromDb();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getUserFromDb = () => {
    //let getUrl = "daymaker/" + document.getElementById('userId').innerHTML;
    let getUrl = window.location.href.slice(0, 20) + "1/daymaker/5e4c290492d81d7474b1af01";
    
    
    fetch(getUrl)
    .then((response) => response.json())
    .then((res) => this.setState({ user: res.userData }));
    
  };

  create(newTodo) {
    let getURL = "daymaker/putData";
    axios.post(getURL, {
      userId: this.state.user._id,
      todo: newTodo,
      currentList: this.state.currentList
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  update(id, updatedTask, isDate) {
    if(isDate) {
      let objIdsToUpdate = this.state.user.lists[this.state.currentList].todos.filter(t => {return t._id === id});
      let [objIdToUpdate] = objIdsToUpdate;
      let idToUpdate = objIdToUpdate._id;

      let getURL = "daymaker/updateDate";
      axios.post(getURL, {
        userId: this.state.user._id,
        id: idToUpdate,
        currentList: this.state.currentList,
        update: updatedTask
      }).then(res => {res !== undefined && this.getUserFromDb()});
    } else {
      let objIdsToUpdate = this.state.user.lists[this.state.currentList].todos.filter(t => {return t._id === id});
      let [objIdToUpdate] = objIdsToUpdate;
      let idToUpdate = objIdToUpdate._id;

      let getURL = "daymaker/updateData";
      axios.post(getURL, {
        userId: this.state.user._id,
        id: idToUpdate,
        currentList: this.state.currentList,
        update: updatedTask
      }).then(res => {res !== undefined && this.getUserFromDb()});
    }
    
  }

  toggleCompletion(id) {
    let objIdsToUpdate = this.state.user.lists[this.state.currentList].todos.filter(t => {return t._id === id});
    let [objIdToUpdate] = objIdsToUpdate;
    let idToUpdate = objIdToUpdate._id;

    let getURL = "daymaker/updateData";
    axios.post(getURL, {
      userId: this.state.user._id,
      id: idToUpdate,
      currentList: this.state.currentList,
      update: ""
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  remove(id, isPlannedDelete) {

    if(isPlannedDelete) {
      let getURL = "daymaker/deleteTodo";
      axios.delete(getURL, {
        data: {
          userId: this.state.user._id,
          id: id
        }
      }).then(res => {res !== undefined && this.getUserFromDb()});
    } else {
      let objIdsToDelete = this.state.user.lists[this.state.currentList].todos.filter(t => {return t._id === id});
      let [objIdToDelete] = objIdsToDelete;
      let idToDelete = objIdToDelete._id;

      let getURL = "daymaker/deleteTodo";
      axios.delete(getURL, {
        data: {
          userId: this.state.user._id,
          id: idToDelete,
          currentList: this.state.currentList
        }
      }).then(res => {res !== undefined && this.getUserFromDb()});
    }
  }

  handleExpandClick(event) {
    if(event === undefined) {
      if(this.state.expand === null) {
        this.setState({expand: true});
      } else {
        this.setState({expand: !this.state.expand});
      }
    }

    if(this.state.expand === true && event !== undefined) {
      if(event.target.id === "expand-press") {
        this.setState({expand: false});
      }
    }
  }

  handleChangeCurrentList(newCurrentList) {
    this.setState({currentList: newCurrentList, expand: false});
  }
  
  handleAddList() {
    let getURL = "daymaker/addList";
    axios.post(getURL, {
      userId: this.state.user._id
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  handleListNameUpdate(listId, newListName) {
    let getURL = "daymaker/updateListName";
    axios.post(getURL, {
      userId: this.state.user._id,
      listId: listId,
      update: newListName
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  handleRemoveList(listId) {
    let getURL = "daymaker/deleteList";
    axios.delete(getURL, {
      data: {
        userId: this.state.user._id,
        listId: listId
      }
    }).then(res => {res !== undefined && this.getUserFromDb()});

    if(listId < this.state.currentList && this.state.user.lists.length !== 4) {
      this.setState({currentList: (this.state.currentList - 1)});
    } else {
      this.setState({currentList: 0});
    }

    if(listId === this.state.currentList) {
      this.setState({currentList: 0});
    }
  }

  copyPlannedTodo(plannedTodo) {
    let getURL = "daymaker/copyData";
    axios.post(getURL, {
      userId: this.state.user._id,
      todo: plannedTodo,
      currentList: 0
    });

    getURL = "daymaker/deleteTodo";
    axios.delete(getURL, {
      data: {
        userId: this.state.user._id,
        id: plannedTodo._id,
        currentList: "1"
      }
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  handleChangeColor(colorId) {
    let getURL = "daymaker/updateColor";
    axios.post(getURL, {
      userId: this.state.user._id,
      colorId: colorId
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  handleAlertedTodo(plannedTodo) {
    let getURL = "daymaker/updateData";
    axios.post(getURL, {
      userId: this.state.user._id,
      id: plannedTodo,
      update: ""
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  handleChangeLang(language) {
    let getURL = "daymaker/changeLang";
    axios.post(getURL, {
      userId: this.state.user._id,
      language: language
    }).then(res => {res !== undefined && this.getUserFromDb()});
  }

  render() {
    if(this.state.user !== null){
      if((this.state.user.locale === undefined && this.state.user.language.slice(0, 2) === "en") || this.state.user.locale === "en") {
        return (
          <div className="main-div" id="expand-press" onClick={this.handleExpandClick} style={{
              animation: this.state.expand ? "slide-right 1s both" : this.state.expand !== null && "slide-left 1s both"
            }} >
            <TodoList 
              user={this.state.user} 
              currentList={this.state.currentList}
              create={this.create}
              update={this.update}
              toggleCompletion={this.toggleCompletion}
              delete={this.remove}
              doPlannedTodo={this.copyPlannedTodo}
              handleAlertedTodo={this.handleAlertedTodo}
            />
            <UI 
              onExpandClick={this.handleExpandClick} 
              expand={this.state.expand}
              user={this.state.user}
              changeCurrentList={this.handleChangeCurrentList}
              addList={this.handleAddList}
              updateListName={this.handleListNameUpdate}
              removeList={this.handleRemoveList}
              changeColor={this.handleChangeColor}
              changeLang={this.handleChangeLang}
            />
          </div>
        );
      } else {
        return (
          <div className="main-div" id="expand-press" onClick={this.handleExpandClick} style={{
              animation: this.state.expand ? "slide-left-he 1s both" : this.state.expand !== null && "slide-right-he 1s both",
              direction: "rtl"
            }} >
            <TodoListHe
              user={this.state.user} 
              currentList={this.state.currentList}
              create={this.create}
              update={this.update}
              toggleCompletion={this.toggleCompletion}
              delete={this.remove}
              doPlannedTodo={this.copyPlannedTodo}
              handleAlertedTodo={this.handleAlertedTodo}
            />
            <UIHe
              onExpandClick={this.handleExpandClick} 
              expand={this.state.expand}
              user={this.state.user}
              changeCurrentList={this.handleChangeCurrentList}
              addList={this.handleAddList}
              updateListName={this.handleListNameUpdate}
              removeList={this.handleRemoveList}
              changeColor={this.handleChangeColor}
              changeLang={this.handleChangeLang}
            />
          </div>
        );
      }
    } else {
      return <div></div>;
    }
  }
}

export default App;
