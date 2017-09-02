// @flow

import React, {PureComponent, PropTypes} from "react";
import moment from "moment";
import ImmutablePropTypes from "react-immutable-proptypes";

import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import SubchatList from "./SubchatList";
import {onEnterKey, withPropagationStopped} from "../helpers/events";
import Chat from "../records/chat";
import User from "../records/user";

@cssModules(styles)
export default class ChatListItem extends PureComponent {
  static propTypes = {
    openChat: PropTypes.func.isRequired,
    requestLoadSubchats: PropTypes.func.isRequired,
    chat: PropTypes.instanceOf(Chat).isRequired,
    isOpen: PropTypes.bool.isRequired,
    getFirstName: PropTypes.func.isRequired,
    subchats: ImmutablePropTypes.listOf(PropTypes.instanceOf(Chat)).isRequired,
    toggleSubchatCreation: PropTypes.func.isRequired,
    activeId: PropTypes.number.isRequired,
    allSubchatsLoaded: PropTypes.bool.isRequired,
    rightPanelActive: PropTypes.bool.isRequired,
    closeRightPanel: PropTypes.func.isRequired,
    createNewBotSubchat: PropTypes.func.isRequired,
    isBotSubChat: PropTypes.bool.isRequired,
    parentId: PropTypes.number,
    showSeeMoreButton: PropTypes.bool.isRequired
    // unreadMsgsCount: PropTypes.func.isRequired
  };

  static defaultProps = {
    botPanelActive: false,
    isCreating: false
  };

  openChat = () => {
    this.props.openChat(this.props.chat.id, null);
    if (this.props.rightPanelActive) {
      this.props.closeRightPanel();
    }
  }

  requestLoadSubchats = () => this.props.requestLoadSubchats();

  renderUnreadMsgsBubble = (chatId) => {
    return (
      <div styleName={(this.props.chat.unread_count <= 99) ? "unreadMessageCircle" :
     "unreadMessageCircle-large"}
      >
        {(this.props.chat.unread_count <= 99) ? this.props.chat.unread_count : "99+"}
      </div>
    );
  }

  ifChatHasBotSubchat = () => {
    const {subchats} = this.props;
    if (subchats) {
      for (let i = 0; i < subchats.size; i++) {
        if (subchats.get(i).is_bot) {
          return true;
        }
      }
    }
    return false;
  }

  getFirstBotSubchatId = () => {
    const {subchats} = this.props;
    if (subchats) {
      for (let i = 0; i < subchats.size; i++) {
        if (subchats.get(i).is_bot) {
          return subchats.get(i).id;
        }
      }
    }
    return null;
  }

  createNewBotSubchat = () => {
    this.props.createNewBotSubchat(this.props.chat.id);
  }

  botOnClickFunction = () => {
    const ifHasBotSubchat = this.ifChatHasBotSubchat();
    if (ifHasBotSubchat) {
      const firstBotSubchatId = this.getFirstBotSubchatId();
      if (firstBotSubchatId) {
        this.props.openChat(firstBotSubchatId, this.props.chat.id);
      }
    } else {
      this.createNewBotSubchat();
    }
  }

  cutLongMessageOff = (firstName, message) => {
    if (!message) {
      return null;
    }
    const totalFirstNameLength = firstName.length;
    const maxLength = 30;
    if (message.length >= maxLength - totalFirstNameLength) {
      return message.substring(0, maxLength - totalFirstNameLength) + "..";
    } else {
      return message;
    }
  }

  render() {
    const {
      openChat,
      requestLoadSubchats,
      chat,
      isOpen,
      getFirstName,
      subchats,
      toggleSubchatCreation,
      activeId,
      allSubchatsLoaded,
      // unreadMessages,
      isBotSubChat,
      parentId,
      showSeeMoreButton
    } = this.props;

    return (
      <div
          styleName={isOpen ? "active-chat" : "chat"}
          onClick={this.openChat}
          role="listitem"
          tabIndex="0"
          onKeyDown={onEnterKey(this.openChat)}
      >
        <div>
          {(this.props.chat.unread_count > 0) && this.renderUnreadMsgsBubble()}
        </div>

        <div styleName="chat-details">
          <img
              styleName="chat-img"
              src={chat.picture_file && chat.picture_file.url}
              alt={chat.chat_name}
              style={{borderColor: `${chat.color && chat.color.hexcode}`}}
          />
          <div styleName="chat-main-details">
            <div styleName={(this.props.chat.unread_count > 0) ? "chat-name-unread" : "chat-name"}>
              {chat.name}</div>
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
              <div styleName={isOpen ? "active-chat-message-time" : "chat-message-time"}>
                {moment(chat.most_recent_message.created).fromNow()}
              </div>
            }
          </div>
        </div>
        <div styleName=""/>
        {(isOpen && subchats) &&
          <div styleName="extra-container">
            <div styleName=""/>
            {this.props.chat.is_class &&
              <div styleName={(this.props.chat.id === this.props.activeId) ? "announcements-container" : "announcements-container-else"}>
                  <img
                      styleName="announcements-icon"
                      src={(this.props.chat.id === this.props.activeId) ? "img/Announcements-active.svg" : "img/Announcements.svg"}
                      alt=""
                  />
                  <div styleName="announcements-text">Announcements</div>
                <div
                  styleName="create-subchat-container"
                  role="button"
                  onClick={withPropagationStopped(toggleSubchatCreation)}
                  tabIndex="0"
                  onKeyDown={onEnterKey(withPropagationStopped(toggleSubchatCreation))}
                >
                  <div styleName="create-subchat-stuff">
                    <img
                      styleName="create-subchat-icon"
                      src="img/group-9.svg"
                      alt=""
                    />
                    <div styleName="create-subchat-box" className="create-subchat-box">
                      Create Subchat
                      <div styleName="create-subchat-triangle"/>
                    </div>
                  </div></div>
             </div>
            }
            {this.props.chat.is_class &&
            <div
              styleName="bot-container"
              role="button"
              onClick={withPropagationStopped(this.botOnClickFunction)}
              onKeyDown={onEnterKey(withPropagationStopped(this.botOnClickFunction))}
              tabIndex="0"
            >
              <div styleName={isBotSubChat ? "bot-active" : "bot"}>
                <img
                    styleName="bot-icon"
                    src={isBotSubChat ?
                      "img/left_panel/bot-active-icon.svg" :
                      "img/left_panel/bot-icon.svg"}
                    alt=""
                />
                <div styleName={isBotSubChat ? "bot-active-text" : "bot-text"}>Bot</div>
              </div>
            </div>
            }
            {!this.props.chat.is_class
             &&
             <div
               styleName="create-subchat-container-nobot"
                 role="button"
                 onClick={withPropagationStopped(toggleSubchatCreation)}
                 tabIndex="0"
                 onKeyDown={onEnterKey(withPropagationStopped(toggleSubchatCreation))}
             >
               <div styleName="create-subchat-stuff">
                 <img
                   styleName="create-subchat-icon"
                   src="img/group-9.svg"
                   alt=""
                 />
                 <div styleName="create-subchat-box" className="create-subchat-box">
                   Create Subchat
                   <div styleName="create-subchat-triangle"/>
                 </div>
               </div></div>
             }
            <SubchatList
                subchats={subchats}
                activeId={activeId}
                openChat={openChat}
                requestLoadSubchats={requestLoadSubchats}
                allSubchatsLoaded={allSubchatsLoaded}
                parentId={parentId}
                showSeeMoreButton={showSeeMoreButton}
            />
          </div>
        }
      </div>
    );
  }
}
