import React, {PureComponent, PropTypes} from "react";

import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import Chat from "../records/chat";

@cssModules(styles)
export default class SearchChatNewItem extends PureComponent {
  static propTypes = {
    newChat: PropTypes.instanceOf(Chat).isRequired,
    joinNewChatOrClass: PropTypes.func.isRequired
  };

  _joinNewChatOrClass = () => {
    const {newChat, joinNewChatOrClass} = this.props;
    joinNewChatOrClass(newChat.id);
  }

  render() {
    const {newChat} = this.props;

    return (
      <div
          styleName={"chat"}
          onClick={this.openChat}
          role="listitem"
          tabIndex="0"
          onKeyDown={onEnterKey(this.openChat)}
      >
        <div styleName="chat-details">
          <img
              styleName="chat-img"
              src={newChat.picture_file && newChat.picture_file.url}
              alt={newChat.chat_name}
              style={{borderColor: `${newChat.color && newChat.color.hexcode}`}}
          />
          <div styleName="chat-main-details">
            <div styleName="chat-name">{newChat.name}</div>
          </div>
          <div>
            <button
                type="button"
                styleName="new-chat-join-button"
                onClick={this._joinNewChatOrClass}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    );
  }
}

