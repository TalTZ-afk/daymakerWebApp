import React, { Component } from "react";
import "./UI.css";
import "./UIHe.css";

class UIHe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: 0,
            listName: ""
        };
        this.changeCurrentList = this.changeCurrentList.bind(this);
        this.creatNewList = this.creatNewList.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.changeLang = this.changeLang.bind(this);
    }

    listIcon = [
        new Date().getHours() >= 18 || new Date().getHours() < 6 ? <i className="far fa-moon"/> : <i className="fas fa-sun"/>, 
        <i className="far fa-calendar-check"/>, 
        <i className="fas fa-clipboard-list"/>, 
        <i className="fas fa-tasks"/>
    ]

    untitledListCount = 0;

    changeCurrentList(event) {
        if(event.target !== event.currentTarget) {
            return;
        }
        this.props.changeCurrentList(event.currentTarget.id);
    }

    creatNewList() {
        this.props.addList();
    }

    toggleForm(event) {
        this.setState({ isEditing: event.currentTarget.id });
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    handleUpdate(event) {
        event.preventDefault();
        this.props.updateListName(event.target.id, this.state.listName);
        this.setState({ isEditing: 0, listName: "" });
    }

    handleRemove(event) {
        this.props.removeList(event.currentTarget.id);
    }

    handleColorChange(event) {
        this.props.changeColor(event.target.id);
    }

    changeLang(event) {
        this.props.changeLang(event.target.id);
    }

    render() {
        return (
            <div>
                <img
                    className="UI-btn UI-btn-out-he" 
                    src={this.props.user.image === undefined || this.props.user.image === null ? "%PUBLIC_URL%/../user-img.png" : this.props.user.image}
                    onClick={() => this.props.onExpandClick()} 
                    style={{
                        animation: this.props.expand ? "ui-img-drop 2s forwards" : this.props.expand !== null && "ui-img-float 1s forwards"
                    }}
                    alt="user-img"
                />
                <div className="UI-he">
                    <img
                        className="UI-btn UI-btn-in-he" 
                        src={this.props.user.image === undefined || this.props.user.image === null ? "%PUBLIC_URL%/../user-img.png" : this.props.user.image}
                        onClick={() => this.props.onExpandClick()}
                        alt="user-img"
                    />
                    <div className="user-name-he">
                        <h4>היי, {this.props.user.fullName}</h4>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown btn-dropdown-he" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-sliders-h"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-he" aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-item dropdown-item-he color-pick">
                                    <p>בחר צבע:</p>
                                    <button className="color-btn red" id="red" onClick={this.handleColorChange}></button>
                                    <button className="color-btn blue" id="blue" onClick={this.handleColorChange}></button>
                                    <button className="color-btn green" id="green" onClick={this.handleColorChange}></button>
                                    <button className="color-btn black" id="black" onClick={this.handleColorChange}></button>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item dropdown-item-he lang-pick">
                                    <p>שפות:</p>
                                    <button className="dropdown-item dropdown-item-he" id="en" onClick={this.changeLang}>English</button>
                                    <button className="dropdown-item dropdown-item-he" id="he" onClick={this.changeLang}>עברית</button>
                                </div>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item dropdown-item-he" href="/logout">התנתק/י</a>
                            </div>
                        </div>
                    </div>
                     {this.props.user.lists.map((list, index) => {
                        let result;
                        if(index < 3){
                            result = (
                                <div
                                key={this.props.user.lists[index]._id} 
                                id={index}
                                className="UI-obj-he list-name"
                                onClick={this.changeCurrentList}
                                >
                                    <h3 id={index} onClick={this.changeCurrentList}>
                                        {this.listIcon[index]} {list.name === "Today" ? "היום " : list.name === "Planned" ? "מתוכננות " : "משימות "}
                                    </h3>
                                </div>
                            )
                        } else if(this.state.isEditing === index.toString()) {
                            result = (
                                <div
                                key={this.props.user.lists[index]._id} 
                                id={index}
                                className="UI-obj-he list-name user-created-lists"
                                onClick={this.changeCurrentList} 
                                >
                                    <form id={index} className="List-edit-form-he" onSubmit={this.handleUpdate}>
                                        <input
                                        type="text"
                                        value={this.state.listName}
                                        name="listName"
                                        onChange={this.handleChange}
                                        maxLength="9"
                                        />
                                        <button><i className="fas fa-check"></i></button>
                                    </form>
                                </div>
                            )
                        } else {
                            result = (
                                <div
                                key={this.props.user.lists[index]._id} 
                                id={index} 
                                className="UI-obj-he list-name user-created-lists"
                                onClick={this.changeCurrentList} 
                                >
                                    <h3 id={index} onClick={this.changeCurrentList}>
                                        {this.listIcon[3]} {list.name}
                                    </h3>
                                    <div className="List-buttons-he">
                                        <button id={index} onClick={this.toggleForm}>
                                            <i className="fas fa-pen" />
                                        </button>
                                        <button id={index} onClick={this.handleRemove}>
                                            <i className="fas fa-trash" />
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                        return (result)
                    })}
                    <hr/>
                    <div 
                    className="UI-obj-he list-name" 
                    onClick={this.creatNewList} 
                    >
                        <h3><i className="far fa-plus-square"></i> רשימה חדשה</h3>
                    </div>
                </div>
            </div>
        );
    }
}

export default UIHe;