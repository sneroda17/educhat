import React, {PropTypes, Component} from "react";
import styles from "../styles/UserListItem.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import connect from "../helpers/connect-with-action-types";
import {promoteUserType, removeUser, deleteUserType} from "../actions/active-chat";
import Immutable from "immutable";


@connect(state => ({
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  chat: state.chats.get(state.activeChat.id)
  // isAdminOrTa: state.activeChat.isAdminOrTa
}), {
  promoteUserType,
  removeUser,
  deleteUserType
})

@cssModules(styles)
export default class AssignAdminDialog extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool,
    isClass: PropTypes.bool
  };

  static defaultProps = {
    isAdmin: false,
    isTA: false,
    admins: null,
    isClass: false
  };

  makeAdmin = () => {
    const userId = this.props.user.get("id");
    const chatId = this.props.chat.get("id");
    this.props.actions.promoteUserType("ADMIN", userId, chatId);
  };
  makeTA = () => {
    const userId = this.props.user.get("id");
    const chatId = this.props.chat.get("id");
    this.props.actions.promoteUserType("TA", userId, chatId);
  };
  deleteAdmin = () => {
    const userId = this.props.user.get("id");
    const chatId = this.props.chat.get("id");
    this.props.actions.deleteUserType("DELETE_ADMIN", userId, chatId);
  };
  deleteTA = () => {
    const userId = this.props.user.get("id");
    const chatId = this.props.chat.get("id");
    this.props.actions.deleteUserType("DELETE_TA", userId, chatId);
  };
  removeThisUser = () => {
    const userId = this.props.user.get("id");
    const chatId = this.props.chat.get("id");
    this.props.actions.removeUser(chatId, userId);
  }
  render() {
    const {isAdmin, isTA, isClass, admins} = this.props;
    return (
      <div>
        <div styleName="edu-chat-bgm">
          <div styleName="dropdown-content">
            <ul styleName="edu-chat-dialog-list" role="menu">
              {isAdmin ?
                <div>
                  {admins.size === 1 ?
                    <li
                        styleName="edu-chat-dialog-list-item-disable"
                        tabIndex="0"
                        role="menuitem"
                    >
                      Delete Admin
                    </li>
                    :
                    <li
                        styleName="edu-chat-dialog-list-item"
                        onClick={this.deleteAdmin}
                        tabIndex="0"
                        role="menuitem"
                        onKeyDown={onEnterKey(this.deleteAdmin)}
                    >
                      Delete Admin
                    </li>
                  }
                </div>
                :
                <li
                    styleName="edu-chat-dialog-list-item"
                    onClick={this.makeAdmin}
                    tabIndex="0"
                    role="menuitem"
                    onKeyDown={onEnterKey(this.makeAdmin)}
                >
                  Make Admin
                </li>
              }
              {isClass &&
              <div>
                {isTA ?
                  <li
                      styleName="edu-chat-dialog-list-item"
                      onClick={this.deleteTA}
                      tabIndex="0"
                      role="menuitem"
                      onKeyDown={onEnterKey(this.deleteTA)}
                  >
                    Delete TA
                  </li>
                  :
                  <li
                      styleName="edu-chat-dialog-list-item"
                      onClick={this.makeTA}
                      tabIndex="0"
                      role="menuitem"
                      onKeyDown={onEnterKey(this.makeTA)}
                  >
                    Make TA
                  </li>
                }
              </div>
              }
              {admins.size === 1 && isAdmin ?
                <li
                    styleName="edu-chat-dialog-list-item-disable"
                    tabIndex="0"
                    role="menuitem"
                >
                  Remove
                </li>
                :
                <li
                    styleName="edu-chat-dialog-list-item"
                    onClick={this.removeThisUser}
                    tabIndex="0"
                    role="menuitem"
                    onKeyDown={onEnterKey(this.removeThisUser)}
                >
                  Remove
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
