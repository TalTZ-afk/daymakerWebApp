import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let userId = document.getElementById("userId").innerHTML;

ReactDOM.render(<App userId={userId} />, document.getElementById("root"));

serviceWorker.unregister();
