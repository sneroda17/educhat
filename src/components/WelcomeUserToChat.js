/**
 * Created by mindaf93 on 7/25/17.
 */
/**
 * Created by mindaf93 on 7/25/17.
 */
import React from "react";
import styles from "../styles/WelcomeUserToChat.css";
import cssModules from "react-css-modules";

const WelcomeUserToChat = () => {
  return (
    <span styleName="welcome-body">
      <span styleName="welcome-title">--- Be the first one to say something in this chat! ---</span>
    </span>
  );
};

export default cssModules(WelcomeUserToChat, styles);

