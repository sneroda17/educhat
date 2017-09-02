import React, {PropTypes} from "react";

import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";

const propTypes = {
  searchMode: PropTypes.string.isRequired
};

const defaultProps = {
  searchMode: "mine"
};

const WelcomeSearchMessage = ({searchMode}) => {
  if (searchMode === "mine") {
    return (
      <div styleName="search-welcome-container">
        <p styleName="search-welcome-title">Welcome!</p>
        <p styleName="search-welcome-body">{"Search for classes and chats you are in!"}</p>
      </div>
    );
  } else if (searchMode === "new") {
    return (
      <div styleName="search-welcome-container">
        <p styleName="search-welcome-title">Welcome!</p>
        <p styleName="search-welcome-body">{"Search for classes and chats you can join!"}</p>
      </div>
    );
  } else if (searchMode === "people") {
    return (
      <div styleName="search-welcome-container">
        <p styleName="search-welcome-title">Welcome!</p>
        <p styleName="search-welcome-body">{"Search for people you and start chatting!"}</p>
      </div>
    );
  } else {
    return (
      <div styleName="search-welcome-container">
        <p styleName="search-welcome-title">Oops!</p>
        <p styleName="search-welcome-body">{"Please hit the back button to exit!"}</p>
      </div>
    );
  }
};

WelcomeSearchMessage.WelcomeSearchMessage = propTypes;
WelcomeSearchMessage.WelcomeSearchMessage = defaultProps;

export default cssModules(WelcomeSearchMessage, styles);

