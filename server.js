require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const async = require("async");
const crypto = require("crypto");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();
app.use(express.static("public"));
app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

const dbRoute = 'mongodb://localhost:27017/testDB';

mongoose.connect(dbRoute, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set('useCreateIndex', true);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const todoSchema = new mongoose.Schema({
    _id: String,
    todo: String,
    completed: Boolean,
    chosenDate: String,
    dateExpired: Boolean
});

const Todo = new mongoose.model("todo", todoSchema);

const listSchema = new mongoose.Schema({
    name: String,
    todos: [todoSchema]
});

const List = new mongoose.model("list", listSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    fullName: String,
    image: String,
    color: String,
    language: String,
    locale: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lists: [listSchema]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/daymaker"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.id, fullName: profile.displayName, image: profile._json['picture'], language: profile._json['locale'] }, function (err, user) {
      return cb(err, user);
    });
  }
));

const toDay = new List({
    name: "Today",
    todos: []
});

const planned = new List({
    name: "Planned",
    todos: []
});

const tasks = new List({
    name: "Tasks",
    todos: []
});

app.use('/daymaker', router);

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, userData) => {
        if (err) return res.json({ success: false, error: err });
        return res.send( { success: true, userData } );
    });
});

router.post('/:idAndCall', (req, res) => {
    let idAndCall = req.params.idAndCall;
    let callUpdate = idAndCall.slice(idAndCall.length - 10, idAndCall.length);
    let calladdData = idAndCall.slice(idAndCall.length - 7, idAndCall.length);
    let callCopyData = idAndCall.slice(idAndCall.length - 8, idAndCall.length);
    let callUpdateListName = idAndCall.slice(idAndCall.length - 14, idAndCall.length);
    let callUpdateColor = idAndCall.slice(idAndCall.length - 11, idAndCall.length);

    if(callUpdate === "updateData") {

        const { userId, id, currentList, update } = req.body;

        if(update === "") {
            if(currentList === undefined) {
              User.findById(userId, (err, foundUser) => {
                  if (err){
                      return res.json({ success: false, error: err });
                  } else {
                      foundUser.lists[0].todos.map(foundTodo => {
                          if(foundTodo._id === id) {
                              foundTodo.dateExpired = true;
                              foundUser.save((err) => {
                                  if (err) return res.json({ success: false, error: err });
                                  foundUser.lists[1].todos.map(foundTodo => {
                                      if(foundTodo._id === id) {
                                          foundTodo.dateExpired = true;
                                          foundUser.save((err) => {
                                              if (err) return res.json({ success: false, error: err });
                                              return res.json({ success: true });
                                          });
                                      }
                                  });
                              });
                          }
                      });
                  }
              });
            } else {
              User.findById(userId, (err, foundUser) => {
                  if (err){
                      return res.json({ success: false, error: err });
                  } else {
                      foundUser.lists[currentList].todos.map(foundTodo => {
                          if(foundTodo._id === id) {
                              foundTodo.completed = !foundTodo.completed;
                              foundUser.save((err) => {
                                  if (err) return res.json({ success: false, error: err });
                                  return res.json({ success: true });
                              });
                          }
                      });
                  }
              });
            }
        } else {
            User.findById(userId, (err, foundUser) => {
                if (err){
                    return res.json({ success: false, error: err });
                } else {
                    foundUser.lists[currentList].todos.map(foundTodo => {
                        if(foundTodo._id === id) {
                            foundTodo.todo = update;
                            foundUser.save((err) => {
                                if (err) return res.json({ success: false, error: err });
                                return res.json({ success: true });
                            });
                        }
                    });
                }
            });
        }
    } else if(callUpdate === "updateDate") {

        const { userId, id, currentList, update } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                foundUser.lists[currentList].todos.map(foundTodo => {
                    if(foundTodo._id === id) {

                        let badDate = false
                        let count = 0;
                        let updateDay = update.slice(0, 2);
                        let updateMonth = update.slice(3, 5);
                        let updateYear = update.slice(6, 10);

                        let dateDay = new Date().toISOString().slice(8, 10);
                        let dateMonth = new Date().toISOString().slice(5, 7);
                        let dateYear = new Date().toISOString().slice(0, 4);

                        let dateDayCharArray = update.split("");

                        if(updateYear < dateYear) {
                            badDate = true;
                        } else if(updateYear > dateYear) {
                            badDate = false;
                        } else if(updateMonth < dateMonth) {
                            badDate = true;
                        } else if(updateMonth > dateMonth) {
                            badDate = false;
                        } else if(updateDay < dateDay) {
                            badDate = true;
                        } else {
                            badDate = false;
                        }

                        dateDayCharArray.forEach(function(char) {

                            if(parseInt(char) === NaN) {
                                count++;
                            }

                            if(count > 2) {
                                badDate = true;
                            }
                        });

                        if(!badDate) {
                            foundTodo.chosenDate = update;
                            foundTodo.dateExpired = false;
                        }
                        
                        foundUser.save((err) => {
                            if (err) return res.json({ success: false, error: err });
                            return res.json({ success: true });
                        });
                    }
                });
            }
        });
    } else if(calladdData === "putData"){

        let todo = new Todo();

        const { userId, todo: newTodo, currentList } = req.body;

        if (!newTodo) {
            return res.json({
                success: false,
                error: 'INVALID INPUTS',
            });
        }

        if(newTodo.task !== "") {
          todo._id = newTodo.id;
          todo.todo = newTodo.task;
          todo.completed = newTodo.completed;
          if(newTodo.chosenDate !== undefined) {
              todo.chosenDate = newTodo.chosenDate;
              todo.dateExpired = false;
          }

          User.findById(userId, (err, foundUser) => {
              if (err){
                  return res.json({ success: false, error: err });
              } else {
                  foundUser.lists[currentList].todos.push(todo);
                  foundUser.save((err) => {
                      if (err) return res.json({ success: false, error: err });
                      return res.json({ success: true });
                  });
              }
          });
        } else { return res.json({ success: false }); }
    } else if(callCopyData === "copyData") {

        let todo = new Todo();

        const { userId, todo: newTodo, currentList } = req.body;

        if (!todo) {
            return res.json({
                success: false,
                error: 'INVALID INPUTS',
            });
        }

        todo._id = newTodo._id;
        todo.todo = newTodo.todo;
        todo.completed = newTodo.completed;
        todo.chosenDate = newTodo.chosenDate;
        todo.dateExpired = newTodo.dateExpired;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                foundUser.lists[currentList].todos.push(todo);
                foundUser.save((err) => {
                    if (err) return res.json({ success: false, error: err });
                    return res.json({ success: true });
                });
            }
        });
    } else if(calladdData === "addList"){

        let currentNumOfUntitledLists = 0;
        let currentNameOfUntitledLists = "";

        const { userId } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {

                if(foundUser.locale === undefined) {
                    if(foundUser.language.slice(0, 2) === "en") {
                        foundUser.lists.forEach(list => {
                            if(list.name.lastIndexOf("Untitled List") === 0) {
                               currentNumOfUntitledLists++;
                            }
                       });

                       if(currentNumOfUntitledLists !== 0) {
                           currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                       }

                       foundUser.lists.forEach(list => {
                            if(list.name === "Untitled List " + currentNameOfUntitledLists) {
                               currentNameOfUntitledLists = currentNameOfUntitledLists + " (1)";
                            }
                       });

                       let list = new List({
                           name: "Untitled List " + currentNameOfUntitledLists,
                           todos: []
                       });
                        foundUser.lists.push(list);
                        foundUser.save((err) => {
                            if (err) return res.json({ success: false, error: err });
                            return res.json({ success: true });
                        });
                    } else {
                        foundUser.lists.forEach(list => {
                            if(list.name.lastIndexOf("רשימה חדשה") !== -1) {
                               currentNumOfUntitledLists++;
                            }
                       });

                       if(currentNumOfUntitledLists !== 0) {
                           currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                       }

                       foundUser.lists.forEach(list => {
                            if(list.name === "רשימה חדשה " + currentNameOfUntitledLists ) {
                               currentNameOfUntitledLists = currentNameOfUntitledLists + " (1)";
                            }
                       });

                       let list = new List({
                           name: "רשימה חדשה " + currentNameOfUntitledLists,
                           todos: []
                       });
                        foundUser.lists.push(list);
                        foundUser.save((err) => {
                            if (err) return res.json({ success: false, error: err });
                            return res.json({ success: true });
                        });
                    }
                } else {
                    if(foundUser.locale === "en") {
                        foundUser.lists.forEach(list => {
                            if(list.name.lastIndexOf("Untitled List") === 0) {
                               currentNumOfUntitledLists++;
                            }
                       });

                       if(currentNumOfUntitledLists !== 0) {
                           currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                       }

                       foundUser.lists.forEach(list => {
                            if(list.name === "Untitled List " + currentNameOfUntitledLists) {
                               currentNameOfUntitledLists = currentNameOfUntitledLists + " (1)";
                            }
                       });

                       let list = new List({
                           name: "Untitled List " + currentNameOfUntitledLists,
                           todos: []
                       });
                        foundUser.lists.push(list);
                        foundUser.save((err) => {
                            if (err) return res.json({ success: false, error: err });
                            return res.json({ success: true });
                        });
                    } else {
                        foundUser.lists.forEach(list => {
                            if(list.name.lastIndexOf("רשימה חדשה") !== -1) {
                               currentNumOfUntitledLists++;
                            }
                       });

                       if(currentNumOfUntitledLists !== 0) {
                           currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                       }

                       foundUser.lists.forEach(list => {
                            if(list.name === "רשימה חדשה " + currentNameOfUntitledLists ) {
                               currentNameOfUntitledLists = currentNameOfUntitledLists + " (1)";
                            }
                       });

                       let list = new List({
                           name: "רשימה חדשה " + currentNameOfUntitledLists,
                           todos: []
                       });
                        foundUser.lists.push(list);
                        foundUser.save((err) => {
                            if (err) return res.json({ success: false, error: err });
                            return res.json({ success: true });
                        });
                    }
                }
            }
        });
    } else if(callUpdateListName === "updateListName") {

        let currentNumOfSameNameLists = 0;
        let currentNameOfSameNameLists = "";

        const { userId, listId, update } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {

                if(update === "") {

                    let currentNumOfUntitledLists = 0;
                    let currentNameOfUntitledLists = "";

                    if(foundUser.locale === undefined) {
                        if(foundUser.language.slice(0, 2) === "en") {
                            foundUser.lists.forEach(list => {
                                if(list.name.lastIndexOf("Untitled List") === 0) {
                                   currentNumOfUntitledLists++;
                                }
                           });

                           if(currentNumOfUntitledLists !== 0) {
                               currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                           }

                           foundUser.lists[listId].name = "Untitled List " + currentNameOfUntitledLists;
                        } else {
                            foundUser.lists.forEach(list => {
                                if(list.name.lastIndexOf("רשימה חדשה") !== -1) {
                                   currentNumOfUntitledLists++;
                                }
                           });

                           if(currentNumOfUntitledLists !== 0) {
                               currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                           }

                           foundUser.lists[listId].name =  "רשימה חדשה " + currentNameOfUntitledLists;
                        }
                    } else {
                        if(foundUser.locale === "en") {
                            foundUser.lists.forEach(list => {
                                if(list.name.lastIndexOf("Untitled List") === 0) {
                                   currentNumOfUntitledLists++;
                                }
                           });

                           if(currentNumOfUntitledLists !== 0) {
                               currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                           }

                           foundUser.lists[listId].name = "Untitled List " + currentNameOfUntitledLists;
                        } else {
                            foundUser.lists.forEach(list => {
                                if(list.name.lastIndexOf("רשימה חדשה") !== -1) {
                                   currentNumOfUntitledLists++;
                                }
                           });

                           if(currentNumOfUntitledLists !== 0) {
                               currentNameOfUntitledLists = currentNumOfUntitledLists.toString();
                           }

                           foundUser.lists[listId].name =  "רשימה חדשה " + currentNameOfUntitledLists;
                        }
                    }
                } else {
                    foundUser.lists.forEach(list => {
                        if(list.name.lastIndexOf(update) === 0) {
                            currentNumOfSameNameLists++;
                        }
                    });

                    if(currentNumOfSameNameLists !== 0) {
                        currentNameOfSameNameLists = " (" + currentNumOfSameNameLists.toString() + ")";
                    }

                    foundUser.lists[listId].name = update + currentNameOfSameNameLists;
                }

                foundUser.save((err) => {
                    if (err) return res.json({ success: false, error: err });
                    return res.json({ success: true });
                });
            }
        })
    } else if(callUpdateColor === "updateColor") {

        const { userId, colorId } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                foundUser.color = colorId;
                foundUser.save((err) => {
                    if (err) return res.json({ success: false, error: err });
                    return res.json({ success: true });
                });
            }
        });
    } else if(callUpdate === "changeLang") {

        const { userId, language } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                if(language === "en") {
                    foundUser.locale = "en"
                } else {
                    foundUser.locale = "he"
                }
                foundUser.save((err) => {
                    if (err) return res.json({ success: false, error: err });
                    return res.json({ success: true });
                });
            }
        });
    }
});

router.delete('/:idAndCall', (req, res) => {
    let idAndCall = req.params.idAndCall;
    let call = idAndCall.slice(idAndCall.length - 10, idAndCall.length);

    if(call === "deleteTodo") {

        const { userId, id, currentList } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                if(foundUser.lists[currentList] !== undefined) {
                    foundUser.lists[currentList].todos.map(foundTodo => {
                        if(foundTodo._id === id) {
                            foundTodo.remove();
                            foundUser.save((err) => {
                                if (err) return res.json({ success: false, error: err });
                                return res.json({ success: true });
                            });
                        }
                    });
                } else {
                    foundUser.lists[0].todos.map(foundTodo => {
                        if(foundTodo._id === id) {
                            foundTodo.remove();
                            foundUser.save((err) => {
                                if (err) return res.json({ success: false, error: err });
                                foundUser.lists[1].todos.map(foundTodo => {
                                    if(foundTodo._id === id) {
                                        foundTodo.remove();
                                        foundUser.save((err) => {
                                            if (err) return res.json({ success: false, error: err });
                                            return res.json({ success: true });
                                        });
                                    }
                                });
                                return res.json({ success: true });
                            });
                        }
                    });

                }
            }
        });
    } else if(call === "deleteList") {

        const { userId, listId: id } = req.body;

        User.findById(userId, (err, foundUser) => {
            if (err){
                return res.json({ success: false, error: err });
            } else {
                if(foundUser.lists[id] !== undefined) {
                    foundUser.lists[id].remove();
                    foundUser.save((err) => {
                        if (err) return res.json({ success: false, error: err });
                        return res.json({ success: true });
                    });
                }
            }
        });
    }
});

let homeRedirect = "";

function setHomeRedirect(req) {
  if(req.headers["accept-language"].slice(0,2) === "he") {
      homeRedirect = "/home/he-il";
  } else if(req.headers["accept-language"].slice(0,2) === "en") {
      homeRedirect = "/home/en-us";
  } else {
      homeRedirect = "/home/en-us";
  }
}

app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/daymaker",
    passport.authenticate("google", { failureRedirect: homeRedirect }), function(req, res) {
        User.findOne({googleId: req.user.googleId}, function(err, user) {
            if(err) {
            console.log(err);
            } else {
                if(user.lists.length === 0) {
                    User.updateOne({googleId: req.user.googleId}, {lists: [toDay, planned, tasks]}, function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                } else {}
            }
        });
        res.redirect("/");
    }
);

app.get("/home/:language", function(req, res) {
    setHomeRedirect(req);

    let language = req.params.language;
    let passwordChanged = "";
    let loginIsInvalid = "";
    let emailIsInvalid = "";
    let passwordIsInvalid = "";
    let passwordChangedMsg = "";
    let lead = "";
    let postLogin = "";
    let email = "";
    let password = "";
    let loginErrMsg = "";
    let forgotPassword ="";
    let login = "";
    let loginGoogle = "";
    let or = "";
    let postRegister = "";
    let fullName = "";
    let emailErrMsg = "";
    let passwordErrMsg1 = "";
    let passwordErrMsg2 = "";
    let passwordErrMsg3 = "";
    let register = "";
    let registerGoogle = "";

    if(req.flash("failedToLogin").length !== 0) {
      loginIsInvalid = "is-invalid";
      emailIsInvalid = "";
      passwordIsInvalid = "";
      passwordChanged = "none";
    } else if(req.flash("failedToRegister-email").length !== 0) {
      emailIsInvalid = "is-invalid";
      loginIsInvalid = "";
      passwordIsInvalid = "";
      passwordChanged = "none";
    } else if(req.flash("failedToRegister-password").length !== 0) {
      passwordIsInvalid = "is-invalid";
      loginIsInvalid = "";
      emailIsInvalid = "";
      passwordChanged = "none";
    } else if(req.flash("passwordChanged").length !== 0) {
      loginIsInvalid = "";
      emailIsInvalid = "";
      passwordIsInvalid = "";
      passwordChanged = "block";
    } else {
      passwordChanged = "none";
      loginIsInvalid = "";
      emailIsInvalid = "";
      passwordIsInvalid = "";
    }

    if(language === "en-us") {
      passwordChangedMsg = "password has been changed successfully!";
      lead = "Come and Make Your Day!";
      postLogin = "/login/en-us";
      email = "Email";
      password = "Password";
      loginErrMsg = "Invalid email or password.";
      forgotPassword = "forgot your password?";
      login = "Login";
      loginGoogle = "Sign In with Google";
      or =  "or";
      postRegister = "/register/en-us";
      fullName = "Full Name";
      emailErrMsg = "This email is already used.";
      passwordErrMsg1 = "Password must contain:";
      passwordErrMsg2 = "numbers, letters, at least one capital letter,";
      passwordErrMsg3 = "and must be longer than 8 characters.";
      register = "Register";
      registerGoogle = "Register with Google";

      res.render("home", {
        header: "partials/header",
        passwordChanged: passwordChanged,
        loginIsInvalid: loginIsInvalid,
        emailIsInvalid: emailIsInvalid,
        passwordIsInvalid: passwordIsInvalid,
        passwordChangedMsg: passwordChangedMsg,
        lead: lead,
        postLogin: postLogin,
        email: email,
        password: password,
        loginErrMsg: loginErrMsg,
        forgotPassword: forgotPassword,
        login: login,
        loginGoogle: loginGoogle,
        or: or,
        postRegister: postRegister,
        fullName: fullName,
        emailErrMsg: emailErrMsg,
        passwordErrMsg1: passwordErrMsg1,
        passwordErrMsg2: passwordErrMsg2,
        passwordErrMsg3: passwordErrMsg3,
        register: register,
        registerGoogle: registerGoogle
      });

    } else if (language === "he-il") {
      passwordChangedMsg = "הסיסמה שונתה בהצלחה";
      lead = "!עשו לעצמכם את היום";
      postLogin = "/login/he-il";
      email = "אימייל";
      password = "סיסמה";
      loginErrMsg = "מייל או סיסמה אינם נכונים";
      forgotPassword = "שכחתי סיסמה";
      login = "התחברו";
      loginGoogle = "התחברו עם גוגל";
      or = "או";
      postRegister = "/register/he-il";
      fullName = "שם מלא";
      emailErrMsg = "המייל הזה כבר קיים";
      passwordErrMsg1 = ":הסיסמה חייבת להכיל";
      passwordErrMsg2 = ",מספרים, אותיות, לפחות אות אחת גדולה";
      passwordErrMsg3 = "וחייבת להיות ארוכה מ-8 תווים";
      register = "הרשמו";
      registerGoogle = "הרשמו עם גוגל";

      res.render("home", {
        header: "partials/headerHe",
        passwordChanged: passwordChanged,
        loginIsInvalid: loginIsInvalid,
        emailIsInvalid: emailIsInvalid,
        passwordIsInvalid: passwordIsInvalid,
        passwordChangedMsg: passwordChangedMsg,
        lead: lead,
        postLogin: postLogin,
        email: email,
        password: password,
        loginErrMsg: loginErrMsg,
        forgotPassword: forgotPassword,
        login: login,
        loginGoogle: loginGoogle,
        or: or,
        postRegister: postRegister,
        fullName: fullName,
        emailErrMsg: emailErrMsg,
        passwordErrMsg1: passwordErrMsg1,
        passwordErrMsg2: passwordErrMsg2,
        passwordErrMsg3: passwordErrMsg3,
        register: register,
        registerGoogle: registerGoogle
      });

    } else {
        res.redirect("/404");
    }
});

app.get("/forgot", function(req, res) {

  let noUser = "";
  let noUserMsg = "";
  let mailSent = "";
  let mailSentMsg = "";
  let badToken = "";
  let badTokenMsg = "";
  let title = "";
  let email = "";
  let buttonReset = "";
  let buttonHome = "";

  if(req.flash("noUser").length !== 0) {
    noUser = "block";
    mailSent = "none";
    badToken = "none";
  } else if(req.flash("mailSent").length !== 0) {
    noUser = "none";
    mailSent = "block";
    badToken = "none";
  } else if(req.flash("badToken").length !== 0) {
    noUser = "none";
    mailSent = "none";
    badToken = "block";
  } else {
    noUser = "none";
    mailSent = "none";
    badToken = "none";
  }

  if(req.headers["accept-language"].slice(0,2) === "he") {

    noUserMsg = "לא נמצא חשבון עם המייל הזה";
    mailSentMsg = "מייל עם הוראות נוספות נשלח אליך, יכול להיות שהוא יגיע לספאם";
    badTokenMsg = "פעולה זו אינה תקינה או שעבר זמנה";
    title = "שכחתי סיסמה";
    email = "הכנס את המייל שלך";
    buttonReset = "שלח לי טופס שחזור";
    buttonHome = "קח אותי לעמוד הבית";

    res.render("forgot", {
      header: "partials/headerHe",
      noUser: noUser,
      mailSent: mailSent,
      badToken: badToken,
      noUserMsg: noUserMsg,
      mailSentMsg: mailSentMsg,
      badTokenMsg: badTokenMsg,
      title: title,
      email: email,
      buttonReset: buttonReset,
      buttonHome: buttonHome,
    });
  } else if(req.headers["accept-language"].slice(0,2) === "en") {

    noUserMsg = "couldn't find an account with that email";
    mailSentMsg = "mail with instructions has been sent to you (if you can't find it try in spam)";
    badTokenMsg = "token is invalid or expired";
    title = "Forgot Password";
    email = "Enter your email";
    buttonReset = "send me a reset form";
    buttonHome = "take me back home";

    res.render("forgot", {
      header: "partials/header",
      noUser: noUser,
      mailSent: mailSent,
      badToken: badToken,
      noUserMsg: noUserMsg,
      mailSentMsg: mailSentMsg,
      badTokenMsg: badTokenMsg,
      title: title,
      email: email,
      buttonReset: buttonReset,
      buttonHome: buttonHome,
    });
  } else {

    noUserMsg = "couldn't find an account with that email";
    mailSentMsg = "mail with instructions has been sent to you (if you can't find it try in spam)";
    badTokenMsg = "token is invalid or expired";
    title = "Forgot Password";
    email = "Enter your email";
    buttonReset = "send me a reset form";
    buttonHome = "take me back home";

    res.render("forgot", {
      header: "partials/header",
      noUser: noUser,
      mailSent: mailSent,
      badToken: badToken,
      noUserMsg: noUserMsg,
      mailSentMsg: mailSentMsg,
      badTokenMsg: badTokenMsg,
      title: title,
      email: email,
      buttonReset: buttonReset,
      buttonHome: buttonHome,
    });
  }
});

app.get("/reset/:token", function(req, res) {

  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, foundUser) {
    if(err) {
      console.log(err);
    } else {
      if(!foundUser) {
        req.flash("badToken", "badToken");
        return res.redirect("/forgot");
      } else {

        let title = "";
        let password = "";
        let passwordErrValidation1 = "";
        let passwordErrMsg1 = "";
        let passwordErrMsg2 = "";
        let passwordErrMsg3 = "";
        let passwordConfirm = "";
        let passwordErrValidation2 = "";
        let passwordErrMsg4 = "";
        let button = "";

        if(req.flash("failedToResetPassword-badPassword").length !== 0) {
          passwordErrValidation1 = "is-invalid";
          passwordErrValidation2 = "";
        } else if(req.flash("failedToResetPassword-notMatch").length !== 0) {
          passwordErrValidation1 = "";
          passwordErrValidation2 = "is-invalid";
        } else {
          passwordErrValidation1 = "";
          passwordErrValidation2 = "";
        }

        if(req.headers["accept-language"].slice(0,2) === "he") {

          title = "שחזור סיסמה";
          password = "הכנס סיסמה חדשה";
          passwordErrMsg1 = ":הסיסמה חייבת להכיל";
          passwordErrMsg2 = ",מספרים, אותיות, לפחות אות אחת גדולה";
          passwordErrMsg3 = "וחייבת להיות ארוכה מ-8 תווים";
          passwordConfirm = "הכנס סיסמה שוב";
          passwordErrMsg4 = "הסיסמאות לא זהות";
          button = "שחזר את הסיסמה שלי";

          res.render("reset", {
            header: "partials/headerHe",
            token: req.params.token,
            title: title,
            password: password,
            passwordErrValidation1: passwordErrValidation1,
            passwordErrMsg1: passwordErrMsg1,
            passwordErrMsg2: passwordErrMsg2,
            passwordErrMsg3: passwordErrMsg3,
            passwordConfirm: passwordConfirm,
            passwordErrValidation2: passwordErrValidation2,
            passwordErrMsg4: passwordErrMsg4,
            button: button,
           });
        } else if(req.headers["accept-language"].slice(0,2) === "en") {

          title = "Reset Password";
          password = "Enter new password";
          passwordErrMsg1 = "Password must contain:";
          passwordErrMsg2 = "numbers, letters, at least one capital letter,";
          passwordErrMsg3 = "and must be longer than 8 characters.";
          passwordConfirm = "Confirm new password";
          passwordErrMsg4 = "passwords are not the same...";
          button = "reset my password";

          res.render("reset", {
            header: "partials/header",
            token: req.params.token,
            title: title,
            password: password,
            passwordErrValidation1: passwordErrValidation1,
            passwordErrMsg1: passwordErrMsg1,
            passwordErrMsg2: passwordErrMsg2,
            passwordErrMsg3: passwordErrMsg3,
            passwordConfirm: passwordConfirm,
            passwordErrValidation2: passwordErrValidation2,
            passwordErrMsg4: passwordErrMsg4,
            button: button,
          });
        } else {

          title = "Reset Password";
          password = "Enter new password";
          passwordErrMsg1 = "Password must contain:";
          passwordErrMsg2 = "numbers, letters, at least one capital letter,";
          passwordErrMsg3 = "and must be longer than 8 characters.";
          passwordConfirm = "Confirm new password";
          passwordErrMsg4 = "passwords are not the same...";
          button = "reset my password";

          res.render("reset", {
            header: "partials/header",
            token: req.params.token,
            title: title,
            password: password,
            passwordErrValidation1: passwordErrValidation1,
            passwordErrMsg1: passwordErrMsg1,
            passwordErrMsg2: passwordErrMsg2,
            passwordErrMsg3: passwordErrMsg3,
            passwordConfirm: passwordConfirm,
            passwordErrValidation2:passwordErrValidation2 ,
            passwordErrMsg4: passwordErrMsg4,
            button: button,
          });
        }
      }
    }
  });
});

app.post("/forgot", function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({username: req.body.email}, function(err, foundUser) {
        if(err) {
          console.log(err);
        } else {
           if(!foundUser) {
             req.flash("noUser", "noUser");
             return res.redirect("/forgot");
           }

           foundUser.resetPasswordToken = token;
           foundUser.resetPasswordExpires = Date.now() + 3600000;

           foundUser.save(function(err) {
             done(err, token, foundUser);
           });
        }
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "daymakerapp@gmail.com",
          pass: process.env.APP_PASSWORD
        }
      });

      if(req.headers["accept-language"].slice(0,2) === "he") {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "שחזור הסיסמה שלך",
          text: "היי," + "\n\n" +
                "מישהו ביקש לייצר סיסמה חדשה עבור חשבון הדיימייקר שלך. בבקשה לחץ על הלינק הבא, או העתק אותו למנוע החיפוש שלך כדי לסיים את התהליך: " + "\n\n" +
                "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                "אם לא ביקשת לבצע זאת אנא התעלם מהמייל הזה. תהליך שחזור הסיסמה יהיה אפשרי רק למשך שעה. " + "\n\n" +
                "שלך, \n" + "צוות הדיימייקר"
        };
      } else if(req.headers["accept-language"].slice(0,2) === "en") {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "Reset Password",
          text: "Hey there," + "\n\n" +
                "Someone requested a new password for your Daymaker account. Please click on the following link, or paste it into your browser to complete the process:" + "\n\n" +
                "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                "if you didn't make this request please ignore this email. This password reset is only valid for the next hour." + "\n\n" +
                "Yours truely, \n" + "The Daymaker Team"
        };
      } else {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "Reset Password",
          text: "Hey there," + "\n\n" +
                "Someone requested a new password for your Daymaker account. Please click on the following link, or paste it into your browser to complete the process:" + "\n\n" +
                "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                "if you didn't make this request please ignore this email. This password reset is only valid for the next hour." + "\n\n" +
                "Yours truely, \n" + "The Daymaker Team"
        };
      }

      transporter.sendMail(mailOptions, function(err) {
        if(err) {
          console.log(err);
        } else {
          req.flash("mailSent", "An email has been sent to " + user.username + "with further instructions.");
          done(err, "done");
        }
      });
    }
  ], function(err) {
      if(err) {
        return next(err);
      } else {
        res.redirect("/forgot");
      }
    });
});

app.post("/reset/:token", function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, foundUser) {
        if(err) {
          console.log(err);
        } else {
          if(!foundUser) {
            req.flash("badToken", "badToken");
            return res.redirect("/forgot");
          } else {

            let abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
            let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let badPassword = false;

            if(req.body.password.length >= 8) {
                let count = 0;
                abc.forEach(function(letter) {
                  if(req.body.password.indexOf(letter) === -1) {
                    count++;
                  }
                  if(count === 26) {
                    req.flash("failedToResetPassword-badPassword", "failedToResetPassword-badPassword");
                    res.redirect("/reset/" + req.params.token);
                    badPassword = true;
                  }
                });
                if(!badPassword) {
                  count = 0;
                  nums.forEach(function(num) {
                    if(req.body.password.indexOf(num) === -1) {
                      count++;
                    }
                    if(count === 9) {
                      req.flash("failedToResetPassword-badPassword", "failedToResetPassword-badPassword");
                      res.redirect("/reset/" + req.params.token);
                      badPassword = true;
                    }
                  });
                }
                if(!badPassword) {
                  count = 0;
                  abc.forEach(function(letter) {
                    if(req.body.password.indexOf(letter.toUpperCase()) === -1) {
                      count++;
                    }
                    if(count === 26) {
                      req.flash("failedToResetPassword-badPassword", "failedToResetPassword-badPassword");
                      res.redirect("/reset/" + req.params.token);
                      badPassword = true;
                    }
                  });
                }
            } else {
              req.flash("failedToResetPassword-badPassword", "failedToResetPassword-badPassword");
              res.redirect("/reset/" + req.params.token);
              badPassword = true;
            }
            if(!badPassword) {
              if(req.body.password !== req.body.passwordConfirm) {
                req.flash("failedToResetPassword-notMatch", "failedToResetPassword-notMatch");
                res.redirect("/reset/" + req.params.token);
              } else {
                foundUser.setPassword(req.body.password, function(err) {
                  if(err) {
                    console.log(err);
                  } else {
                    foundUser.resetPasswordToken = undefined;
                    foundUser.resetPasswordExpires = undefined;

                    foundUser.save(function(err) {
                      done(err, foundUser);
                    });
                  }
                })
              }
            }
          }
        }
      });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "daymakerapp@gmail.com",
          pass: process.env.APP_PASSWORD
        }
      });

      if(req.headers["accept-language"].slice(0,2) === "he") {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "הסיסמה שונתה בהצלחה",
          text: "שלום," + "\n\n" +
                "המייל הזה נועד להודיע לך שהסיסמה שלך שונתה בהצלחה. שיהיה המשך יום נעים." + "\n\n" +
                "שלך, \n" + "צוות הדיימייקר"
        };
      } else if(req.headers["accept-language"].slice(0,2) === "en") {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "Password has been changed",
          text: "Hello," + "\n\n" +
                "This is a confirmation that the password for your account at Daymaker has just been changed." + "\n\n" +
                "Yours truely, \n" + "The Daymaker Team"
        };
      } else {
        var mailOptions = {
          from: "daymakerapp@gmail.com",
          to: user.username,
          subject: "Password has been changed",
          text: "Hello," + "\n\n" +
                "This is a confirmation that the password for your account at Daymaker has just been changed." + "\n\n" +
                "Yours truely, \n" + "The Daymaker Team"
        };
      }

      transporter.sendMail(mailOptions, function(err) {
        if(err) {
          console.log(err);
        } else {
          req.flash("passwordChanged", "passwordChanged");
          done(err);
        }
      });
    }
  ], function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/home");
    }
  });
});

app.post("/register/:language", function(req, res) {

    let language = req.params.language;

    let abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let badRegister = false;

    if(req.body.password.length >= 8) {
        let count = 0;
        abc.forEach(function(letter) {
          if(req.body.password.indexOf(letter) === -1) {
            count++;
          }
          if(count === 26) {
            req.flash("failedToRegister-password", "failedToRegister-password");
            res.redirect("/home/" + language);
            badRegister = true;
          }
        });
        if(!badRegister) {
          count = 0;
          nums.forEach(function(num) {
            if(req.body.password.indexOf(num) === -1) {
              count++;
            }
            if(count === 9) {
              req.flash("failedToRegister-password", "failedToRegister-password");
              res.redirect("/home/" + language);
              badRegister = true;
            }
          });
        }
        if(!badRegister) {
          count = 0;
          abc.forEach(function(letter) {
            if(req.body.password.indexOf(letter.toUpperCase()) === -1) {
              count++;
            }
            if(count === 26) {
              req.flash("failedToRegister-password", "failedToRegister-password");
              res.redirect("/home/" + language);
              badRegister = true;
            }
          });
        }
    } else {
      req.flash("failedToRegister-password", "failedToRegister-password");
      res.redirect("/home/" + language);
      badRegister = true;
    }
    if(!badRegister) {
      User.register({username: req.body.username}, req.body.password, function(err, user) {
          if(err) {
              req.flash("failedToRegister-email", "failedToRegister-email");
              console.log(err);
              res.redirect("/home/" + language);
          } else {
              passport.authenticate("local", { failureRedirect: "/home/" + language })(req, res, function() {
                User.findOne({username: req.body.username}, function(err, user) {
                      if(err) {
                          console.log(err);
                      } else {
                          user.fullName = req.body.fullName;
                          user.language = language.slice(0,2);
                          if(user.lists.length === 0) {
                              user.lists.push(toDay);
                              user.lists.push(planned);
                              user.lists.push(tasks);
                          } else {}
                          user.save();
                      }
                      res.redirect("/");
                  });
              });
          }
      });
    }
});

app.post("/login/:language", function(req, res) {
    let language = req.params.language;
    req.flash("failedToLogin", "failedToLogin");
    const user = new User({
    username: req.body.username,
    password: req.body.password
    });

    req.login(user, function(err) {
        if(!err) {
            passport.authenticate("local", { failureRedirect: "/home/" + language, failureFlash: true })(req, res, function() {
                res.redirect("/");
            });
        } else {
            console.log(err);
            res.redirect("/home/" + language);
        }
    });
});

app.get("/", function(req, res) {
    if(req.headers["accept-language"].slice(0,2) === "en") {
      if(req.user === undefined) {
          res.redirect("/home/en-us");
      } else {
          res.render("app", {userId: req.user._id});
      }
    } else if(req.headers["accept-language"].slice(0,2) === "he") {
      if(req.user === undefined) {
          res.redirect("/home/he-il");
      } else {
          res.render("app", {userId: req.user._id});
      }
    } else {
      if(req.user === undefined) {
          res.redirect("/home/en-us");
      } else {
          res.render("app", {userId: req.user._id});
      }
    }
});

app.get("/logout", function(req, res) {
    req.logout();
    if(req.headers["accept-language"].slice(0,2) === "en") {
      res.redirect("/home/en-us");
    } else if(req.headers["accept-language"].slice(0,2) === "he") {
      res.redirect("/home/he-il");
    } else {
      res.redirect("/home/en-us");
    }
});

app.get("/home", function(req, res) {
  if(req.headers["accept-language"].slice(0,2) === "en") {
    res.redirect("/home/en-us");
  } else if(req.headers["accept-language"].slice(0,2) === "he") {
    res.redirect("/home/he-il");
  } else {
    res.redirect("/home/en-us");
  }
});

app.get("*", function(req, res) {

  let header = "";
  let lead = "";
  let text = "";
  let button = "";

  if(req.headers["accept-language"].slice(0,2) === "he") {
    header = "partials/headerHe";
    lead = "!?איך הלכתם לאיבוד";
    text = "אני חושב שאתם צריכים להתחיל לנהל את החיים שלכם... כדאי לכם להשתמש בדיימייקר";
    button = "חזרה לעמוד הבית";
    res.render("404", { header: header, lead: lead, text: text, button: button });
  } else if(req.headers["accept-language"].slice(0,2) === "en") {
    header = "partials/header";
    lead = "How did you got lost!?";
    text = "I think you need to start managing your life... You should start using Daymaker 😉";
    button = "Daymaker Homepage";
    res.render("404", { header: header, lead: lead, text: text, button: button });
  } else {
    header = "partials/header";
    lead = "How did you got lost!?";
    text = "I think you need to start managing your life... You should start using Daymaker 😉";
    button = "Daymaker Homepage";
    res.render("404", { header: header, lead: lead, text: text, button: button });
  }
});

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
