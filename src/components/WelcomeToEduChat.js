/**
 * Created by mindaf93 on 7/25/17.
 */
import React from "react";
import styles from "../styles/WelcomeToEduChat.css";
import cssModules from "react-css-modules";
require("es5-shim");
require("es5-shim/es5-sham");
require("console-polyfill");


const WelcomeToEduChat = () => {
  return (
    <span styleName="welcome-body">
      <span styleName="welcome-title">Welcome To Edu.Chat</span>
    </span>
  );
};

export default cssModules(WelcomeToEduChat, styles);
