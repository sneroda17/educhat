// @flow

import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import store from "./store";
import App from "./App";
import "./styles/index.css";
require("es5-shim");
require("es5-shim/es5-sham");
require("console-polyfill");
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById("root")
);
