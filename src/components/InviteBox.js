import React, {Component, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import connect from "../helpers/connect-with-action-types";
import {
  refreshInviteSuggestionList,
  addUserToInviteList,
  removeUserFromInviteList,
  closeInviteSuggestionList,
  showInviteListErrorMessage,
  hideInviteListErrorMessage,
  closeInviteBox
} from "../actions/ui/right-panel";
import {invite, inviteNewFromParent} from "../actions/active-chat";
import styles from "../styles/InviteBox.css";
import cssModules from "react-css-modules";
import InviteAutoComplete from "./InviteAutoComplete";
import InviteUserList from "./InviteUserList";
import User from "../records/user";
import ref from "../helpers/ref";

function scrollToTopOfContainer() {
  const messageScrollWrapper = document.getElementsByClassName("invited-user-list");
  if (messageScrollWrapper && messageScrollWrapper[0] && messageScrollWrapper[0].scrollTop !== 0) {
    messageScrollWrapper[0].scrollTop = 0;
  }
}

const validEmail =
/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line

@connect(state => ({
  inviteSuggestionList: state.ui.rightPanel.inviteSuggestionList,
  inviteList: state.ui.rightPanel.inviteList,
  usersListInActiveChat: state.activeChat.users,
  inviteUserError: state.ui.rightPanel.inviteUserError,
  inviteUserErrorMessage: state.ui.rightPanel.inviteUserErrorMessage,
  inviteUserProcessing: state.ui.rightPanel.inviteUserProcessing,
  inviteInterfaceActive: state.ui.rightPanel.inviteInterfaceActive
  // parentId: state.activeChat.parentId,
  // ifInviteNewFromParent: state.activeChat.ifInviteNewFromParent
}), {
  refreshInviteSuggestionList,
  addUserToInviteList,
  removeUserFromInviteList,
  invite,
  closeInviteSuggestionList,
  showInviteListErrorMessage,
  hideInviteListErrorMessage,
  inviteNewFromParent,
  closeInviteBox
})
@cssModules(styles)
export default class InviteBox extends Component {
  static propTypes = {
    inviteSuggestionList: ImmutablePropTypes.listOf(PropTypes.instanceOf(User)),
    inviteList: ImmutablePropTypes.orderedSetOf(PropTypes.instanceOf(User)).isRequired,
    usersListInActiveChat: PropTypes.any, // FIX
    inviteUserError: PropTypes.bool.isRequired,
    inviteUserErrorMessage: PropTypes.string.isRequired,
    inviteUserProcessing: PropTypes.bool.isRequired,
    ifPastedAnything: PropTypes.bool.isRequired,
    // parentId: PropTypes.number,
    // ifInviteNewFromParent: PropTypes.bool.isRequired,
    inviteBoxActive: PropTypes.bool.isRequired,
    inviteInterfaceActive: PropTypes.bool.isRequired
  };

  static defaultProps = {
    inviteSuggestionList: null,
    usersListInActiveChat: null,
    ifPastedAnything: false,
    inviteBoxActive: false
    // parentId: null
  };
  focusOnInviteInput = () => this.inviteInput.focus();

  cleanInviteInput = () => {
    const {actions} = this.props;

    this.inviteInput.value = "";
    actions.closeInviteSuggestionList();
  }

  addJustEmailToList(email) {
    const {actions} = this.props;
    // if (email && /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
    if (email && validEmail.test(email)) {
      const user = {email};
      this.addUserToInviteList(user);
    // activeInviteButton
    } else {
      actions.showInviteListErrorMessage("Select user or input valid email!");
    }
  }

  refreshInviteSuggestionList = (e) => {
    e.persist();
    setTimeout(() => {
      const {actions} = this.props;
      if (this.props.inviteUserError) { // if there's an error
        actions.hideInviteListErrorMessage();
      }
      const name = e.target.value;
      if (!name || name.trim().length === 0) {
        actions.refreshInviteSuggestionList(name);
        // in order to cancel the previous task, we need to call the sagas worker again
      } else {
        if (e.key === "Enter") { // if they clicked enter
          this.addJustEmailToList(name);
        } else if (!this.props.ifPastedAnything) { // if they didnt paste anything
          actions.refreshInviteSuggestionList(name);
        } else {
          this.props.ifPastedAnything = false;
          actions.refreshInviteSuggestionList(name);
        }
      }
    }, 0);
  };

  addUserToInviteList = (user) => {
    const {actions} = this.props;
    if (user.id) {
      if (this.ifInviteListContainsThisUser(user, this.props.inviteList)) {
        actions.showInviteListErrorMessage("This user is already in the invite box!");
      } else {
        actions.addUserToInviteList(user);
      }
    } else {
      if (this.ifInviteListContainsThisEmail(user, this.props.inviteList)) {
        actions.showInviteListErrorMessage("This email is already in the invite box!");
      } else {
        actions.addUserToInviteList(user);
      }
    }
    this.cleanInviteInput();
    scrollToTopOfContainer();
  };

  removeUserFromInviteList = (user) => {
    const {actions} = this.props;
    actions.removeUserFromInviteList(user);
  };

  ifInviteListContainsThisEmail = (user, inviteList) => {
    if (user.id) {
      return false;
    }
    for (const eachUser of inviteList) {
      if (eachUser.email.valueOf() === user.email.valueOf()) {
        return true;
      }
    }
    return false;
  };

  ifInviteListContainsThisUser = (user, inviteList) => {
    if (!user.id) {
      return false;
    }
    for (const eachUser of inviteList) {
      if (eachUser.id === user.id) {
        return true;
      }
    }
    return false;
  }

  ifUserListContainsThisUser = (user, userList) => {
    if (!user.id) {
      return false;
    }
    for (const eachUserID of userList) {
      if (eachUserID === user.id) {
        return true;
      }
    }
    return false;
  }
  ifInviteEveryone = (inviteEveryone) => {
    const {actions} = this.props;
    actions.inviteNewFromParent(!inviteEveryone);
  }

  invite = () => {
    const {actions, inviteList} = this.props;

    const userList = [];
    inviteList.forEach(user => {
      if (user.id) {
        userList.push(user.id);
      } else {
        userList.push(user.email);
      }
    });

    if (userList.length === 0) {
      actions.showInviteListErrorMessage("No one is invited!");
    } else {
      actions.invite(userList);
    }
  };

  invitePastedList = (e) => {
    const list = e.clipboardData.getData("Text");
    e.persist();
    setTimeout(() => {
      if (this.confirmPastedAListOfEmail()) {
        const emailList = list.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (emailList) {
          emailList.forEach((email) => this.addJustEmailToList(email));
        }
        this.cleanInviteInput();
        this.props.ifPastedAnything = true;
      }
    }, 10);
  };

  confirmPastedAListOfEmail = () =>
    confirm(// eslint-disable-line no-alert
      "Did you just paste a list of email to invite?");

  renderErrorMessage() {
    return (
      <p styleName="invite-box-error"
          style={{visibility: this.props.inviteUserError ? "visible" : "hidden"}}
      >
        {this.props.inviteUserErrorMessage}
      </p>
    );
  }

  toggleBox = () => {
    const x = document.getElementById("toggleBox");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  };

  onButtonClick = () => {
    const {inviteBoxActive} = this.props;
    this.props.actions.closeInviteBox(!inviteBoxActive);
  };

  render() {
    const {inviteList, inviteSuggestionList, inviteUserError} = this.props;
    return (
      <div styleName="invite-container">
        {this.renderErrorMessage()}
        {this.props.inviteUserProcessing ?
          <img src="img/ring.gif" styleName="invite-box-loading" alt="loading chats"/>
          :
          <div>
            <div styleName="fixed-container">
              <span>
                <button
                    styleName={(!inviteList || inviteList.size === 0)
                    ? "invite-button"
                    : "active-invite-button"}
                    onClick={this.invite}
                >
                  Invite
                </button>
                <button
                    styleName="skip-button"
                    onClick={this.onButtonClick}
                >
                  cancel
                </button>
              </span>
              <div
                  className="invite-input-container"
                  styleName="invite-input-container"
                  onFocus={this.focusOnInviteInput}
                  tabIndex="0"
              >
                <img styleName="add-people-img" src="img/right_panel/shape.svg" alt="add people"/>
                <span>
                  <input
                      type="text"
                      styleName="invite-input"
                      ref={ref(this, "inviteInput")}
                      onChange={this.refreshInviteSuggestionList}
                      onPaste={this.invitePastedList}
                      placeholder="Search by name or email"
                  />
                </span>
              </div>
              {this.props.inviteSuggestionList && this.props.inviteInterfaceActive
              && this.inviteInput.value !== "" &&
                <InviteAutoComplete
                    inviteAutoCompleteList={inviteSuggestionList}
                    addUserToInviteList={this.addUserToInviteList}
                    inviteUserError={inviteUserError}
                    usersListInActiveChat={this.props.usersListInActiveChat}
                />
              }
            </div>
            <div styleName="fixed-list">
              <InviteUserList
                  inviteList={inviteList}
                  removeUserFromInviteList={this.removeUserFromInviteList}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}
