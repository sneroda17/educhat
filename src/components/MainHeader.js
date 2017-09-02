import React, {PropTypes} from "react";
import styles from "../styles/MainPanel.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";

const propTypes = {
  mainHeaderType: PropTypes.string.isRequired,
  chat: PropTypes.instanceOf(Chat),
  chatParent: PropTypes.instanceOf(Chat),
  rightPanelActive: PropTypes.bool,
  toggleRightPanel: PropTypes.func.isRequired
};

const defaultProps = {
  chat: null,
  chatParent: null,
  rightPanelActive: false
};

class MainHeader extends React.Component {
  renderRightPanelToggle() {
    if (this.props.rightPanelActive) {
      return(
        <button
            styleName="toggle-right-panel toggle-right-panel__active"
            onClick={this.props.toggleRightPanel}
        >
          <img
              src="img/fill-64.svg"
              alt="toggle right panel"
              title="Toggle the right panel"
          />
        </button>
      );
    } else {
      return(
        <button styleName="toggle-right-panel" onClick={this.props.toggleRightPanel}>
          <img
              src="img/toggle-right-panel-white.svg"
              alt="toggle right panel"
              title="Toggle the right panel"
          />
        </button>
      );
    }
  }

  render() {
    const {mainHeaderType, chat, chatParent, isBotSubChat} = this.props;
    // alert(chat);
    return (<div className={mainHeaderType} styleName="main-header">
      {chat &&
        <div styleName="chat-details-container">
          <img styleName="chat-img" src={chat.picture_file.url} alt=""/>
          {mainHeaderType === "edit" ?
            chatParent ?
              <div styleName="chat-details">
                <div styleName="chat-title">
                  {chatParent.name}
                </div>
                <div className="chat-name-input" styleName="subchat-input" contentEditable="true">
                  {isBotSubChat ? "Bot Chat" : chat.name}
                </div>
              </div>
              :
              <div styleName="chat-details">
                <div className="chat-name-input" styleName="chat-input" contentEditable="true">
                  {chat.name}
                </div>
                {/* It might be possible to remove this div */}
                <div className="subchat-name" styleName="subchat-title"/>
              </div>
            :
            chatParent ?
              <div styleName="chat-details">
                <div styleName="chat-title">
                  {chatParent.name}
                </div>
                <div className="subchat-name" styleName="subchat-title">
                  {isBotSubChat ? "Bot Chat" : chat.name}
                  {chat.is_anonymous &&
                    " (This chat is anonymous, your identity will not be revealed) "
                  }
                </div>
              </div>
              :
              <div styleName="chat-details">
                <div styleName="chat-title-only">
                  {chat.name}
                </div>
                {/* It might be possible to remove this div */}
                <div className="subchat-name" styleName="subchat-title"/>
              </div>
          }
          <button styleName="toggle-comment-panel">
            <img
                src="img/comment-notification.svg"
                alt="toggle right panel"
                title="Toggle the right panel"
            />
          </button>
          {this.renderRightPanelToggle() /* TODO: Add all of the bot stuff here*/}
        </div>
      }

      {(chat && mainHeaderType === "bio") &&
        <div styleName="chat-desc">{chat.description}</div>
      }

      {(chat && mainHeaderType === "edit") &&
        <div className="chat-desc-input" styleName="chat-desc-textarea" contentEditable="true">
          {chat.description}
        </div>
      }
    </div>);
  }
}

MainHeader.propTypes = propTypes;
MainHeader.defaultProps = defaultProps;

export default cssModules(MainHeader, styles, {allowMultiple: true});
