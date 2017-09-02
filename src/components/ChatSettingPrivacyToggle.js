import React, {PropTypes} from "react";
import styles from "../styles/ChatSettingPrivacyToggle.css";
import cssModules from "react-css-modules";

const propTypes = {
  isSearchable: PropTypes.bool.isRequired,
  togglePrivacy: PropTypes.func.isRequired
};

const ChatSettingPrivacyToggle = ({isSearchable, togglePrivacy, isAdmin}) => {
  return (
    <div styleName="chat-privacy-selection-box">
      {isSearchable ?
          (isAdmin ?
            <button
                styleName="chat-privacy-button chat-privacy-button--public"
                onClick={togglePrivacy}
            >
              <span styleName="chat-privacy-button__text">Private</span>
              <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Public
          </span>
            </button>
          :
            <button
                styleName="chat-privacy-button chat-privacy-button--public--disabled"
                onClick={togglePrivacy}
                disabled
            >
              <span styleName="chat-privacy-button__text">Private</span>
              <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Public
          </span>
            </button>)
        :
        (isAdmin ?
          <button
              styleName="chat-privacy-button chat-privacy-button--private"
              onClick={togglePrivacy}
          >
            <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Private
            </span>
            <span styleName="chat-privacy-button__text">Public</span>
          </button>
            :
          <button
              styleName="chat-privacy-button chat-privacy-button--private--disabled"
              onClick={togglePrivacy}
              disabled
          >
            <span styleName="chat-privacy-button__text chat-privacy-button__text--active">
            Private
            </span>
            <span styleName="chat-privacy-button__text">Public</span>
          </button>
        )
      }
    </div>
  );
};

ChatSettingPrivacyToggle.propTypes = propTypes;

export default cssModules(ChatSettingPrivacyToggle, styles, {allowMultiple: true});
