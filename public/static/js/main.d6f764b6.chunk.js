(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{160:function(e,t,a){},161:function(e,t,a){},162:function(e,t,a){},163:function(e,t,a){},164:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),i=a(21),r=a.n(i),o=(a(78),a(42)),l=a(11),d=a(12),c=a(14),h=a(13),u=a(4),m=a(15),p=a(9),b=a.n(p),g=(a(96),a(22)),k=a(52),v=a.n(k),f=a(68),y=a.n(f),C=(a(99),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={task:"",chosenDate:new Date},a.handleChange=a.handleChange.bind(Object(u.a)(a)),a.handleSubmit=a.handleSubmit.bind(Object(u.a)(a)),a.handleChangeDate=a.handleChangeDate.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"handleChange",value:function(e){this.setState(Object(g.a)({},e.target.name,e.target.value))}},{key:"handleSubmit",value:function(e){e.preventDefault(),"1"===this.props.currentList?this.props.createTodo({task:this.state.task,chosenDate:this.state.chosenDate,id:v()(),completed:!1}):this.props.createTodo({task:this.state.task,id:v()(),completed:!1}),this.setState({task:""})}},{key:"handleChangeDate",value:function(e){this.setState({chosenDate:e})}},{key:"render",value:function(){return"1"===this.props.currentList?s.a.createElement("form",{className:"NewTodoForm",onSubmit:this.handleSubmit},s.a.createElement("label",{htmlFor:"task"},"New Todo"),s.a.createElement("input",{type:"text",placeholder:"New Todo",id:"task",name:"task",value:this.state.task,onChange:this.handleChange}),s.a.createElement(y.a,{selected:this.state.chosenDate,onChange:this.handleChangeDate,minDate:new Date,showYearDropdown:!0,yearDropdownItemNumber:15,scrollableYearDropdown:!0,customInput:s.a.createElement("button",{type:"button",className:"btn-calendar-open"},s.a.createElement("i",{className:"far fa-calendar-alt"}))}),s.a.createElement("button",{className:"add-todo"},"Add Todo")):s.a.createElement("form",{className:"NewTodoForm",onSubmit:this.handleSubmit},s.a.createElement("label",{htmlFor:"task"},"New Todo"),s.a.createElement("input",{type:"text",placeholder:"New Todo",id:"task",name:"task",value:this.state.task,onChange:this.handleChange}),s.a.createElement("button",{className:"add-todo"},"Add Todo"))}}]),t}(n.Component)),E=(a(160),a(168)),L=a(169),w=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).state={isEditing:!1,task:a.props.task},a.handleRemove=a.handleRemove.bind(Object(u.a)(a)),a.toggleForm=a.toggleForm.bind(Object(u.a)(a)),a.handleChange=a.handleChange.bind(Object(u.a)(a)),a.handleUpdate=a.handleUpdate.bind(Object(u.a)(a)),a.handleToggle=a.handleToggle.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"handleRemove",value:function(){this.props.removeTodo(this.props.id,!1)}},{key:"toggleForm",value:function(){this.setState({isEditing:!this.state.isEditing})}},{key:"handleUpdate",value:function(e){e.preventDefault(),this.props.updateTodo(this.props.id,this.state.task),this.setState({isEditing:!1})}},{key:"handleChange",value:function(e){this.setState(Object(g.a)({},e.target.name,e.target.value))}},{key:"handleToggle",value:function(e){this.props.toggleTodo(this.props.id)}},{key:"render",value:function(){var e;return e=this.state.isEditing?s.a.createElement(E.a,{key:"editing",timeout:500,classNames:"form"},s.a.createElement("form",{className:"Todo-edit-form",onSubmit:this.handleUpdate},s.a.createElement("input",{type:"text",value:this.state.task,name:"task",onChange:this.handleChange}),s.a.createElement("button",null,"Save"))):s.a.createElement(E.a,{key:"normal",timeout:500,classNames:"task-text"},s.a.createElement("li",{className:"Todo-task",onClick:this.handleToggle},this.props.task,s.a.createElement("h6",null,this.props.chosenDate&&this.props.chosenDate))),s.a.createElement(L.a,{className:this.props.completed?"Todo completed":"Todo"},e,s.a.createElement("div",{className:"Todo-buttons"},s.a.createElement("button",{onClick:this.toggleForm},s.a.createElement("i",{className:"fas fa-pen"})),s.a.createElement("button",{onClick:this.handleRemove},s.a.createElement("i",{className:"fas fa-trash"}))))}}]),t}(n.Component),j=(a(161),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).date=(new Date).getDate(),a.fullDate=a.printDayAndMonth()+a.date,a.dateString=(new Date).toISOString(),a.year=a.dateString.toString().slice(0,4),a.month=a.dateString.toString().slice(5,7),a.day=a.dateString.toString().slice(8,10),a.yesterday=a.day-1,a.currentDate=a.day+"/"+a.month+"/"+a.year,a.yesterdayDate=a.yesterday+"/"+a.month+"/"+a.year,a.color="",a.state={intervalIsSet:!1,copiedTodo:null},a.handleCreate=a.handleCreate.bind(Object(u.a)(a)),a.handleUpdate=a.handleUpdate.bind(Object(u.a)(a)),a.handleToggleCompletion=a.handleToggleCompletion.bind(Object(u.a)(a)),a.handleRemove=a.handleRemove.bind(Object(u.a)(a)),a.printDayAndMonth=a.printDayAndMonth.bind(Object(u.a)(a)),a.handleTodoToday=a.handleTodoToday.bind(Object(u.a)(a)),a.printColor=a.printColor.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"printDayAndMonth",value:function(){switch((new Date).getMonth()){case 0:this.month="January";break;case 1:this.month="February";break;case 2:this.month="March";break;case 3:this.month="April";break;case 4:this.month="May";break;case 5:this.month="June";break;case 6:this.month="July";break;case 7:this.month="August";break;case 8:this.month="September";break;case 9:this.month="October";break;case 10:this.month="November";break;default:this.month="December"}switch((new Date).getDay()){case 0:this.day="Sunday";break;case 1:this.day="Monday";break;case 2:this.day="Tuesday";break;case 3:this.day="Wednesday";break;case 4:this.day="Thursday";break;case 5:this.day="Friday";break;default:this.day="Saturday"}return this.day+", "+this.month+" "}},{key:"printColor",value:function(){switch(this.props.user.color){case"blue":this.color="#38b2f8";break;case"green":this.color="#42e6a4";break;case"black":this.color="black";break;default:this.color="#FF6666"}return this.color}},{key:"handleCreate",value:function(e){this.props.create(e)}},{key:"handleUpdate",value:function(e,t){this.props.update(e,t)}},{key:"handleToggleCompletion",value:function(e){this.props.toggleCompletion(e)}},{key:"handleRemove",value:function(e,t){this.props.delete(e,t)}},{key:"handleTodoToday",value:function(e){var t=0;this.props.user.lists[0].todos.map((function(a){return a._id!==e._id&&t++})),t===this.props.user.lists[0].todos.length&&this.props.copyPlannedTodo(e)}},{key:"removeTodoYesterday",value:function(e){this.props.delete(e._id,!0)}},{key:"render",value:function(){var e=this;this.props.user.lists[1].todos.map((function(t){return t.chosenDate===e.currentDate&&e.handleTodoToday(t)})),this.props.user.lists[1].todos.map((function(t){return t.chosenDate===e.yesterdayDate&&e.removeTodoYesterday(t)}));var t=this.props.user.lists[this.props.currentList].todos.map((function(t){return s.a.createElement(E.a,{key:t._id,timeout:500,classNames:"todo"},s.a.createElement(w,{key:t._id,id:t._id,task:t.todo,completed:t.completed,chosenDate:t.chosenDate,removeTodo:e.handleRemove,updateTodo:e.handleUpdate,toggleTodo:e.handleToggleCompletion}))}));return s.a.createElement("div",{className:"TodoList",style:{background:this.printColor()}},"Today"===this.props.user.lists[this.props.currentList].name?s.a.createElement("div",null,s.a.createElement("h1",null,this.props.user.lists[this.props.currentList].name),s.a.createElement("h4",null,this.fullDate)):s.a.createElement("h1",null,this.props.user.lists[this.props.currentList].name),s.a.createElement(C,{currentList:this.props.currentList,createTodo:this.handleCreate}),s.a.createElement("ul",null,s.a.createElement(L.a,{className:"todo-list"},t)))}}]),t}(n.Component)),O=(a(162),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).listIcon=[(new Date).getHours()>=18||(new Date).getHours()<6?s.a.createElement("i",{className:"far fa-moon"}):s.a.createElement("i",{className:"fas fa-sun"}),s.a.createElement("i",{className:"far fa-calendar-check"}),s.a.createElement("i",{className:"fas fa-clipboard-list"}),s.a.createElement("i",{className:"fas fa-tasks"})],a.untitledListCount=0,a.state={isEditing:0,listName:""},a.changeCurrentList=a.changeCurrentList.bind(Object(u.a)(a)),a.creatNewList=a.creatNewList.bind(Object(u.a)(a)),a.toggleForm=a.toggleForm.bind(Object(u.a)(a)),a.handleChange=a.handleChange.bind(Object(u.a)(a)),a.handleUpdate=a.handleUpdate.bind(Object(u.a)(a)),a.handleRemove=a.handleRemove.bind(Object(u.a)(a)),a.handleColorChange=a.handleColorChange.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"changeCurrentList",value:function(e){e.target===e.currentTarget&&this.props.changeCurrentList(e.currentTarget.id)}},{key:"creatNewList",value:function(){this.props.addList()}},{key:"toggleForm",value:function(e){this.setState({isEditing:e.currentTarget.id})}},{key:"handleChange",value:function(e){this.setState(Object(g.a)({},e.target.name,e.target.value))}},{key:"handleUpdate",value:function(e){e.preventDefault(),this.props.updateListName(e.target.id,this.state.listName),this.setState({isEditing:0,listName:""})}},{key:"handleRemove",value:function(e){this.props.removeList(e.currentTarget.id)}},{key:"handleColorChange",value:function(e){this.props.changeColor(e.target.id)}},{key:"render",value:function(){var e=this;return s.a.createElement("div",null,s.a.createElement("img",{className:"UI-btn UI-btn-out",src:void 0===this.props.user.image||null===this.props.user.image?"%PUBLIC_URL%/../user-img.png":this.props.user.image,onClick:function(){return e.props.onExpandClick()},style:{animation:this.props.expand?"ui-img-drop 1s forwards":null!==this.props.expand&&"ui-img-float 1s forwards"},alt:"user-img"}),s.a.createElement("div",{className:"UI"},s.a.createElement("img",{className:"UI-btn UI-btn-in",src:void 0===this.props.user.image||null===this.props.user.image?"%PUBLIC_URL%/../user-img.png":this.props.user.image,onClick:function(){return e.props.onExpandClick()},alt:"user-img"}),s.a.createElement("div",{className:"user-name"},s.a.createElement("h4",null,"Hi, ",this.props.user.username),s.a.createElement("div",{class:"dropdown"},s.a.createElement("button",{class:"btn btn-secondary dropdown btn-dropdown",type:"button",id:"dropdownMenuButton","data-toggle":"dropdown","aria-haspopup":"true","aria-expanded":"false"},s.a.createElement("i",{class:"fas fa-sliders-h"})),s.a.createElement("div",{class:"dropdown-menu","aria-labelledby":"dropdownMenuButton"},s.a.createElement("div",{class:"dropdown-item color-pick"},s.a.createElement("p",null,"Pick a Color:"),s.a.createElement("button",{class:"color-btn red",id:"red",onClick:this.handleColorChange}),s.a.createElement("button",{class:"color-btn blue",id:"blue",onClick:this.handleColorChange}),s.a.createElement("button",{class:"color-btn green",id:"green",onClick:this.handleColorChange}),s.a.createElement("button",{class:"color-btn black",id:"black",onClick:this.handleColorChange})),s.a.createElement("div",{class:"dropdown-divider"}),s.a.createElement("a",{class:"dropdown-item",href:"/logout"},"Log Out")))),this.props.user.lists.map((function(t,a){return a<3?s.a.createElement("div",{key:e.props.user.lists[a]._id,id:a,className:"UI-obj list-name",onClick:e.changeCurrentList},s.a.createElement("h3",{id:a,onClick:e.changeCurrentList},e.listIcon[a]," "+t.name)):e.state.isEditing===a.toString()?s.a.createElement("div",{key:e.props.user.lists[a]._id,id:a,className:"UI-obj list-name user-created-lists",onClick:e.changeCurrentList},s.a.createElement("form",{id:a,className:"List-edit-form",onSubmit:e.handleUpdate},s.a.createElement("input",{type:"text",value:e.state.listName,name:"listName",onChange:e.handleChange}),s.a.createElement("button",null,s.a.createElement("i",{className:"fas fa-check"})))):s.a.createElement("div",{key:e.props.user.lists[a]._id,id:a,className:"UI-obj list-name user-created-lists",onClick:e.changeCurrentList},s.a.createElement("h3",{id:a,onClick:e.changeCurrentList},e.listIcon[3]," "+t.name),s.a.createElement("div",{className:"List-buttons"},s.a.createElement("button",{id:a,onClick:e.toggleForm},s.a.createElement("i",{className:"fas fa-pen"})),s.a.createElement("button",{id:a,onClick:e.handleRemove},s.a.createElement("i",{className:"fas fa-trash"}))))})),s.a.createElement("hr",null),s.a.createElement("div",{className:"UI-obj list-name",onClick:this.creatNewList},s.a.createElement("h3",null,s.a.createElement("i",{className:"far fa-plus-square"})," New List"))))}}]),t}(n.Component)),N=(a(163),function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(c.a)(this,Object(h.a)(t).call(this,e))).urlLength=22,a.getUserFromDb=function(){var e=window.location.href,t=e.slice(a.urlLength,e.length);e=e-t+"daymaker/"+decodeURIComponent(t),b.a.get(e).then((function(e){a.setState({user:e.data})}))},a.state={expand:null,intervalIsSet:null,user:null,currentList:0},a.create=a.create.bind(Object(u.a)(a)),a.update=a.update.bind(Object(u.a)(a)),a.toggleCompletion=a.toggleCompletion.bind(Object(u.a)(a)),a.remove=a.remove.bind(Object(u.a)(a)),a.handleExpandClick=a.handleExpandClick.bind(Object(u.a)(a)),a.handleChangeCurrentList=a.handleChangeCurrentList.bind(Object(u.a)(a)),a.handleAddList=a.handleAddList.bind(Object(u.a)(a)),a.handleRemoveList=a.handleRemoveList.bind(Object(u.a)(a)),a.handleChangeColor=a.handleChangeColor.bind(Object(u.a)(a)),a}return Object(m.a)(t,e),Object(d.a)(t,[{key:"componentDidMount",value:function(){if(this.getUserFromDb(),!this.state.intervalIsSet){var e=setInterval(this.getUserFromDb,100);this.setState({intervalIsSet:e})}}},{key:"componentWillUnmount",value:function(){this.state.intervalIsSet&&(clearInterval(this.state.intervalIsSet),this.setState({intervalIsSet:null}))}},{key:"create",value:function(e){var t=window.location.href;t=t.slice(0,this.urlLength),t+="daymaker",t+="/putData",b.a.post(t,{userId:this.state.user._id,todo:e,currentList:this.state.currentList})}},{key:"update",value:function(e,t){var a=this.state.user.lists[this.state.currentList].todos.filter((function(t){return t._id===e})),n=Object(o.a)(a,1)[0]._id,s=window.location.href;s=s.slice(0,this.urlLength),s+="daymaker",s+="/updateData",b.a.post(s,{userId:this.state.user._id,id:n,currentList:this.state.currentList,update:t})}},{key:"toggleCompletion",value:function(e){var t=this.state.user.lists[this.state.currentList].todos.filter((function(t){return t._id===e})),a=Object(o.a)(t,1)[0]._id,n=window.location.href;n=n.slice(0,this.urlLength),n+="daymaker",n+="/updateData",b.a.post(n,{userId:this.state.user._id,id:a,currentList:this.state.currentList,update:""})}},{key:"remove",value:function(e,t){if(t){var a=window.location.href;a=a.slice(0,this.urlLength),a+="daymaker",a+="/deleteTodo",b.a.delete(a,{data:{userId:this.state.user._id,id:e}})}else{var n=this.state.user.lists[this.state.currentList].todos.filter((function(t){return t._id===e})),s=Object(o.a)(n,1)[0]._id,i=window.location.href;i=i.slice(0,this.urlLength),i+="daymaker",i+="/deleteTodo",b.a.delete(i,{data:{userId:this.state.user._id,id:s,currentList:this.state.currentList}})}}},{key:"handleExpandClick",value:function(e){void 0===e&&(null===this.state.expand?this.setState({expand:!0}):this.setState({expand:!this.state.expand})),!0===this.state.expand&&void 0!==e&&"main-div"===e.target.id&&this.setState({expand:!1})}},{key:"handleChangeCurrentList",value:function(e){this.setState({currentList:e})}},{key:"handleAddList",value:function(){var e=window.location.href;e=e.slice(0,this.urlLength),e+="daymaker",e+="/addList",b.a.post(e,{userId:this.state.user._id})}},{key:"handleListNameUpdate",value:function(e,t){var a=window.location.href;a=a.slice(0,this.urlLength),a+="daymaker",a+="/updateListName",b.a.post(a,{userId:this.state.user._id,listId:e,update:t})}},{key:"handleRemoveList",value:function(e){var t=window.location.href;t=t.slice(0,this.urlLength),t+="daymaker",t+="/deleteList",b.a.delete(t,{data:{userId:this.state.user._id,listId:e}}),e<this.state.currentList&&4!==this.state.user.lists.length?this.setState({currentList:this.state.currentList-1}):this.setState({currentList:0}),e===this.state.currentList&&this.setState({currentList:0})}},{key:"copyPlannedTodo",value:function(e){var t=window.location.href;t=t.slice(0,this.urlLength),t+="daymaker",t+="/copyData",b.a.post(t,{userId:this.state.user._id,todo:e,currentList:0})}},{key:"handleChangeColor",value:function(e){var t=window.location.href;t=t.slice(0,this.urlLength),t+="daymaker",t+="/updateColor",b.a.post(t,{userId:this.state.user._id,colorId:e})}},{key:"render",value:function(){return null!==this.state.user?s.a.createElement("div",{className:"main-div",id:"main-div",onClick:this.handleExpandClick,style:{animation:this.state.expand?"slide-right 1s both":null!==this.state.expand&&"slide-left 1s both"}},s.a.createElement(j,{user:this.state.user,currentList:this.state.currentList,create:this.create,update:this.update,toggleCompletion:this.toggleCompletion,delete:this.remove,copyPlannedTodo:this.copyPlannedTodo}),s.a.createElement(O,{onExpandClick:this.handleExpandClick,expand:this.state.expand,user:this.state.user,changeCurrentList:this.handleChangeCurrentList,addList:this.handleAddList,updateListName:this.handleListNameUpdate,removeList:this.handleRemoveList,changeColor:this.handleChangeColor})):s.a.createElement("div",null)}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(N,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},73:function(e,t,a){e.exports=a(164)},78:function(e,t,a){},99:function(e,t,a){}},[[73,1,2]]]);
//# sourceMappingURL=main.d6f764b6.chunk.js.map