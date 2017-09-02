/**
 * Created by mindaf93 on 7/25/17.
 */
import React, {PropTypes} from "react";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";

const propTypes = {
  isShowingClasses: PropTypes.bool.isRequired
};

const NoChatsOrClassesDisplay = ({isShowingClasses}) =>
  <div styleName="search-no-result-container">
    <p styleName="search-no-result-title">Hi!</p>
    <p styleName="search-no-result-body">
      It seems that you are not in
    </p>
    <p styleName="search-no-result-body">
      any {isShowingClasses ? "class" : "chat"}~
    </p>
  </div>;

NoChatsOrClassesDisplay.propTypes = propTypes;

export default cssModules(NoChatsOrClassesDisplay, styles);
