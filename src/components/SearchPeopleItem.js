import React, {PureComponent, PropTypes} from "react";

import styles from "../styles/ChatListItem.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import User from "../records/user";

@cssModules(styles)
export default class SearchPeopleItem extends PureComponent {
  static propTypes = {
    people: PropTypes.instanceOf(User).isRequired,
    createOneToOneChat: PropTypes.func.isRequired
  };

  _createOneToOneChat = () => {
    const {people, createOneToOneChat} = this.props;
    createOneToOneChat(people);
  }

  render() {
    const {people} = this.props;
    return (
      <span
          styleName={"chat"}
          onClick={this.openChat}
          role="listitem"
          tabIndex="0"
          onKeyDown={onEnterKey(this.openChat)}
      >
        <div styleName="chat-details">
          <img
              styleName="chat-img"
              src={people.picture_file && people.picture_file.url}
              alt={people.chat_name}
              style={{borderColor: `${people.color && people.color.hexcode}`}}
          />
          <div styleName="chat-main-details">
            <div styleName="chat-name">{people.first_name + " " + people.last_name}</div>
          </div>
          <div>
            <button
                type="button"
                styleName="new-people-message-button"
                onClick={this._createOneToOneChat}
            >
              Message
            </button>
          </div>
        </div>
      </span>
    );
  }
}

