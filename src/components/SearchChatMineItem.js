import React, {PureComponent, PropTypes} from "react";
import moment from "moment";
// import ImmutablePropTypes from "react-immutable-proptypes";

import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import Chat from "../records/chat";

@cssModules(styles)
export default class SearchChatMineItem extends PureComponent {
  static propTypes = {
    chat: PropTypes.instanceOf(Chat).isRequired,
    getFirstName: PropTypes.func.isRequired,
    switchToThisChatOrClass: PropTypes.func.isRequired
  };

  renderUnreadMsgsBubble = (chatId, unreadMessages = "") => {
    /* if(unreadMessages)
     return <p>N: {unreadMessages.unreadMessages[chatId.toString()].unreadMsgsCount}</p>;
     else
     return <p>N: unreadMessages</p>;*/
  }

  cutLongMessageOff = (firstName, message) => {
    if (!message) {
      return null;
    }
    const totalFirstNameLength = firstName ? firstName.length : 0;
    const maxLength = 30;
    if (message.length >= maxLength - totalFirstNameLength) {
      return message.substring(0, maxLength - totalFirstNameLength) + "..";
    } else {
      return message;
    }
  }

  _switchToThisChatOrClass = () => {
    const {switchToThisChatOrClass, chat} = this.props;
    switchToThisChatOrClass(chat.get("id"), chat.get("is_class"));
  }

  render() {
    const {
      chat,
      isOpen,
      getFirstName,
      unreadMessages
    } = this.props;
    // console.log(unreadMessages);
    /*
     let unreadMsgsCount = undefined;
     if(unreadMessages) {
     console.log("old life", unreadMessages);
     unreadMsgsCount = unreadMessages[chat.id.toString()].unreadMsgsCount;
     } */

    return (
      <div
          styleName="chat"
          onClick={this._switchToThisChatOrClass}
          role="listitem"
          tabIndex="0"
          onKeyDown={onEnterKey(this._switchToThisChatOrClass)}
      >
        <div styleName="chat-details">
          {this.renderUnreadMsgsBubble(chat.id, unreadMessages)}
          <img
              styleName="chat-img"
              src={chat.picture_file && chat.picture_file.url}
              alt={chat.chat_name}
              style={{borderColor: `${chat.color && chat.color.hexcode}`}}
          />
          <div styleName="chat-main-details">
            <div styleName="chat-name">{chat.name}</div>
            {(!isOpen && chat.most_recent_message) &&
            <div styleName="chat-last-message">
              {getFirstName(chat.most_recent_message.user)}: {
                  this.cutLongMessageOff(
                    getFirstName(chat.most_recent_message.user), chat.most_recent_message.text)
              }
            </div>
            }
          </div>
          <div styleName="chat-right-details">
            {chat.most_recent_message &&
              <div styleName="chat-message-time">
                {moment(chat.most_recent_message.created).fromNow()}
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

