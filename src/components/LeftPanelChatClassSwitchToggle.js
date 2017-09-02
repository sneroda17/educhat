/**
 * Created by mindaf93 on 7/17/17.
 */
import React, {PropTypes} from "react";
import styles from "../styles/LeftPanelChatClassSwitchToggle.css";
import cssModules from "react-css-modules";
import {onEnterKey, withPropagationStopped} from "../helpers/events";

const propTypes = {
  isShowingClasses: PropTypes.bool.isRequired,
  changeIfShowingClasses: PropTypes.func.isRequired,
  // totalChatsCount: PropTypes.number.isRequired,
  // totalClassesCount: PropTypes.number.isRequired,
  hasUnreadChatMessages: PropTypes.bool.isRequired
};

const LeftPanelChatClassSwitchToggle =
  ({isShowingClasses, changeIfShowingClasses, hasUnreadChatMessages}) => {
    return (
      <div styleName="chat-privacy-selection-box">
        {isShowingClasses ?
          <span
              styleName="chat-privacy-button chat-privacy-button--private"
          >
            <span styleName="chat-privacy-button__text--alt chat-privacy-button__text--active">
              Class
            </span>
            <span
                onClick={changeIfShowingClasses}
                onKeyDown={onEnterKey(withPropagationStopped(changeIfShowingClasses))}
                styleName={hasUnreadChatMessages ?
                "chat-privacy-button__text" :
                "chat-privacy-button__text--alt"}
                role="button"
                tabIndex="0"
            >
              Chat
              <div
                  styleName="numberCircle"
                  style={hasUnreadChatMessages ? {display: "initial"} : {display: "none"}}
              >
                <span styleName={"number"}/>
              </div>
            </span>
          </span>
          :
          <span
              styleName="chat-privacy-button chat-privacy-button--public"
          >
            <span
                onClick={changeIfShowingClasses}
                onKeyDown={onEnterKey(withPropagationStopped(changeIfShowingClasses))}
                styleName="chat-privacy-button__text--alt"
                role="button"
                tabIndex="0"
            >
              Class
            </span>
            <span styleName={hasUnreadChatMessages ?
              "chat-privacy-button__text chat-privacy-button__text--active" :
              "chat-privacy-button__text--alt chat-privacy-button__text--active"}
            >
              Chat
              <div
                  styleName="numberCircle"
                  style={hasUnreadChatMessages ? {display: "initial"} : {display: "none"}}
              >
                <span styleName={"number"}/>
              </div>
            </span>
          </span>
        }
      </div>
    );
  };

LeftPanelChatClassSwitchToggle.propTypes = propTypes;

export default cssModules(LeftPanelChatClassSwitchToggle, styles, {allowMultiple: true});
