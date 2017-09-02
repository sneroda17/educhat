import React, {PureComponent} from "react";
import styles from "../styles/UserListItem.css";
import cssModules from "react-css-modules";
import {toggleAssignAdminDialog} from "../actions/ui/right-panel";
import ref from "../helpers/ref";
import {onEnterKey} from "../helpers/events";
import AssignAdminDialog from "./AssignAdminDialog";
import connect from "../helpers/connect-with-action-types";
import Immutable from "immutable";


@connect(state => ({
  assignAdminDialogActive: state.ui.rightPanel.assignAdminDialogActive,
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  chat: state.chats.get(state.activeChat.id),
  isAdminOrTa: state.activeChat.isAdminOrTa
}), {
  toggleAssignAdminDialog
})

@cssModules(styles)
export default class AssignAdminButton extends PureComponent {
  onButtonClick = () => {
    this.props.onChangeAssignDialogState(this.props.user.id);
  };

  componentDidMount() {
    window.addEventListener("click", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleClickOutside, false);
  }

  /**
   * Check if the mouse clicks on anywhere other than this dropdown menu arrow.
   * When the user clicks on the menu item such as "Settings",
   *  this checking work won't be triggered since this component is unmounted already.
   */
  handleClickOutside = (event) => {
    if (!this.props.assignDialogState) {
      // if this menu is already closed, then no need to check if click outside
      return;
    }
    // check if this dropDownRef exists and if the click is on
    // any target other than this component(or its children)
    if (this.dropDownRef && !this.dropDownRef.contains(event.target)) {
      // click outside => close this dropdown menu for better user experience
      this.props.actions.toggleAssignAdminDialog(false);
    }
  }

  render() {
    const {user, chat, isAdmin, isTA, isClass, admins} = this.props;
    return (
      <div
          styleName="drop-down-button"
          alt="Edit"
          onClick={this.onButtonClick}
          onKeyDown={onEnterKey(this.onButtonClick)}
          role="button"
          tabIndex="0"
      >
        <img
            ref={ref(this, "dropDownRef")}
            src="img/group-22.svg"
            alt="toggle Edit menu"
        />
        {this.props.assignDialogState &&
        <AssignAdminDialog
            user={user}
            chat={chat}
            isAdmin={isAdmin}
            isTA={isTA}
            isClass={isClass}
            admins={admins}
        />
        }
      </div>
    );
  }
}
