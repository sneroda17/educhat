// @flow
import connect from "../helpers/connect-with-action-types";
import React, {PropTypes, Component} from "react";
import styles from "../styles/UserListItem.css";
import cssModules from "react-css-modules";
import User from "../records/user";
import Chat from "../records/chat";
import Immutable from "immutable";
import {toggleAssignAdminDialog} from "../actions/ui/right-panel";
import AssignAdminButton from "./AssignAdminButton";
import ImmutablePropTypes from "react-immutable-proptypes";

@connect(state => ({
  assignAdminDialogActive: state.ui.rightPanel.assignAdminDialogActive,
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  // chat: state.chats.get(state.activeChat.id),
  isAdminOrTa: state.activeChat.isAdminOrTa
}), {
  toggleAssignAdminDialog
  // toggleAssignAdminOrTa
})

@cssModules(styles)
export default class UserListItem extends Component {
  static propTypes = {
    openUserPopup: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool,
    isClass: PropTypes.bool,
    currentUserIsAdmin: PropTypes.bool.isRequired,
    // currentUserIsTA: PropTypes.bool.isRequired,
    // assignAdminDialogActive: PropTypes.bool.isRequired,
    user: PropTypes.instanceOf(User).isRequired,
    assignDialogState: PropTypes.bool.isRequired,
    onChangeAssignDialogState: PropTypes.func.isRequired,
    chat: PropTypes.instanceOf(Chat),
    admins: ImmutablePropTypes.setOf(PropTypes.number)
  };

  static defaultProps = {
    isAdmin: false,
    isTA: false,
    assignDialogState: false,
    // isAdminOrTa: "",
    chat: null,
    isClass: false,
    admins: null
  };

  openProfile = () => this.props.openUserPopup(this.props.user.id);

  render() {
    const {
      user,
      chat,
      isAdmin,
      isTA,
      currentUserIsAdmin,
      assignDialogState,
      onChangeAssignDialogState,
      isClass,
      admins
    } = this.props;

    return (
      <div
          styleName="user-profile-button"
          id={user.id}
      >
        <span>
          <div styleName="user" data-user-id={user.id} >
            <button
                styleName="user-profile"
                onClick={this.openProfile}
                title={`View ${user.first_name}'s profile`}
            >
              <div styleName="user-details-container">
                <img styleName="user-img" src={user.picture_file.url} alt={user.first_name}/>
                <div>
                  {user.is_online
                    ? <div styleName="online-circle"/>
                    : <div styleName=""/>
                  }
                </div>
                <div styleName="user-name">{user.first_name} {user.last_name}</div>
                {isAdmin && <div styleName="admin">Admin</div>}
                {isTA && <div styleName="ta">TA</div>}
              </div>
            </button>
            <span>
              {currentUserIsAdmin &&
                <div>
                  <AssignAdminButton
                      user={user}
                      onChangeAssignDialogState={onChangeAssignDialogState}
                      assignDialogState={assignDialogState}
                      chat={chat}
                      isAdmin={isAdmin}
                      isTA={isTA}
                      isClass={isClass}
                      admins={admins}
                  />
                </div>
              }
            </span>
          </div>
        </span>
      </div>
    );
  }
}
