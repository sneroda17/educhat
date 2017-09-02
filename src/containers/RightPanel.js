// @flow

import React, {PureComponent, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import connect from "../helpers/connect-with-action-types";

import RightUserContainer from "../components/RightUserContainer";
import RightFileContainer from "../components/RightFileContainer";

import SettingsPanel from "../components/SettingsPanel";

import UserListItem from "../components/UserListItem";
import FileListItem from "../components/FileListItem";
import {changeChatDetails, leaveChat, startDeleteChat} from "../actions/chats";
import {setFilePreview, requestPageResources, uploadChatPicture,
  toggleNotifications, togglePrivacy, toggleAddNewUserFromParent} from "../actions/active-chat";
import {
  changeActivePanel
} from "../actions/ui/right-panel";
import {openUserProfile} from "../actions/ui/main-panel";

import CreateChatorClass from "../components/CreateChatorClass";
import SubChatSetup from "../components/SubChatSetup";
import {setCreating} from "../actions/current-user";
import {
  toggleRightPanel, toggleInviteBox, toggleAssignAdminDialog} from "../actions/ui/right-panel";

import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";

import Immutable from "immutable";

import User from "../records/user";
import Message from "../records/message";
import Chat from "../records/chat";

import {onEnterKey} from "../helpers/events";
import memoize from "../helpers/memoize";
import InviteBox from "../components/InviteBox";

@connect(state => ({
  chats: state.chats,
  rightPanelActive: state.ui.rightPanel.rightPanelActive,
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  admins: state.activeChat.admins,
  currentUserId: state.currentUser.id,
  tas: state.activeChat.tas,
  resources: state.activeChat.resources,
  activePanel: state.ui.rightPanel.activePanel,
  inviteSuggestionList: state.ui.rightPanel.inviteSuggestionList,
  isCreating: state.currentUser.isCreating,
  activeChat: state.chats.get(state.activeChat.id),
  ifAllFilesLoaded: state.activeChat.ifAllFilesLoaded,
  currentUserIsAdmin: state.activeChat.admins && state.activeChat.admins.has(state.currentUser.id),
  currentUserIsTA: state.activeChat.tas && state.activeChat.tas.has(state.currentUser.id),
  chat: state.chats.get(state.activeChat.id),
  isUploadingChatPicture: state.activeChat.isUploadingChatPicture,
  inviteBoxActive: state.ui.rightPanel.inviteBoxActive,
  isMuted: state.activeChat.isMuted,
  isSearchable: state.activeChat.isSearchable,
  // assignAdminDialogActive: state.ui.rightPanel.assignAdminDialogActive,
  isAdminOrTa: state.activeChat.isAdminOrTa,
  isClass: state.activeChat.isClass
}), {
  changeActivePanel,
  changeChatDetails,
  setFilePreview,
  requestPageResources,
  openUserProfile,
  setCreating,
  toggleRightPanel,
  leaveChat,
  startDeleteChat,
  uploadChatPicture,
  toggleInviteBox,
  toggleNotifications,
  toggleAddNewUserFromParent,
  togglePrivacy,
  toggleAssignAdminDialog
})
@cssModules(styles, {allowMultiple: true})
export default class RightPanel extends PureComponent {

  constructor() {
    super();
    this.clickFileUpload = this.clickFileUpload.bind(this);
    this.state = {
      assignDialogsState: null
    };
  }

  static propTypes = {
    rightPanelActive: PropTypes.bool.isRequired,
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number),
    admins: ImmutablePropTypes.setOf(PropTypes.number),
    currentUserId: PropTypes.number.isRequired,
    isMuted: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    tas: ImmutablePropTypes.setOf(PropTypes.number),
    resources: ImmutablePropTypes.listOf(PropTypes.instanceOf(Message)),
    activePanel: PropTypes.string.isRequired,
    isCreating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    activeChat: PropTypes.instanceOf(Chat),
    clickFileUploadInRightPanel: PropTypes.func.isRequired,
    ifAllFilesLoaded: PropTypes.bool.isRequired,
    currentUserIsAdmin: PropTypes.bool,
    currentUserIsTA: PropTypes.bool,
    // chat: PropTypes.instanceOf(Chat),
    isUploadingChatPicture: PropTypes.bool.isRequired,
    inviteBoxActive: PropTypes.bool.isRequired,
    // assignAdminDialogActive: PropTypes.bool.isRequired,
    isClass: PropTypes.bool
  };

  static defaultProps = {
    users: null,
    admins: null,
    tas: null,
    resources: null,
    activeChat: null,
    currentUserIsAdmin: false,
    currentUserIsTA: false,
    // chat: null,r
    isUploadingChatPicture: false,
    isClass: false
  };

  componentWillReceiveProps(props) {
    if (props.users) {
      let userList = new Immutable.Map(this.props.users);
      // console.log(userList);
      userList = userList.delete(this.props.currentUserId);
      this.setState({
        assignDialogsState: userList.map(user => false)
      });
    }
  }
  onChangeAssignDialogState = (id) => {
    const newState = !this.state.assignDialogsState.get(id);
    const newList = this.state.assignDialogsState.set(id, newState);
    this.setState({assignDialogsState: newList});
  }

  isBotChat = () => {
    const botID = 1;// we asume that the bot will always be user id 1
    if (this.props.users) {
      return this.props.users.get(botID);
    }
    return false;
  }

  // DONE: The first time this is displayed, we should request the full list of
  // all users in the chat (which we don't necessarily have yet and which is paginated)
  // This is exposed as ecapi.chatUser.getAll(chat)
  // but redux actions will need to be created/changed
  renderUserList = () => {
    const {users, admins, tas, actions, currentUserIsAdmin,
      activeChat, currentUserIsTA, isClass} = this.props;

    if (!users || !admins || !tas) {
      return <img styleName="invite-box-loading" src="img/ring.gif" alt="loading users"/>;
    } else {
      return (
        <div styleName="user-list">
          {
            users.toArray().map((user) => {
              const assignDialogState = this.state.assignDialogsState.get(user.id);
              return (
                <UserListItem
                    key={user.id}
                    user={user}
                    chat={activeChat}
                    isAdmin={admins.has(user.id)}
                    isTA={tas.has(user.id)}
                    openUserPopup={actions.openUserProfile}
                    currentUserIsAdmin={currentUserIsAdmin}
                    currentUserIsTA={currentUserIsTA}
                    assignDialogState={assignDialogState}
                    onChangeAssignDialogState={this.onChangeAssignDialogState}
                    isClass={isClass}
                    admins={admins}
                />
              );
            })
          }
        </div>
      );
    }
  };

  renderFileList = () => {
    const {resources, ifAllFilesLoaded, actions} = this.props;
    if (resources && resources.size !== 0) {
      return (
        <div>
          {resources.map(message =>
            (message.file && !message.event) &&
            <FileListItem
                key={message.id}
                message={message}
                setFilePreview={actions.setFilePreview}
            />
          )}
          {!ifAllFilesLoaded &&
          <button styleName="see-more-file-button" onClick={actions.requestPageResources}>
            <img styleName="see-more-file-icon" src="img/left_panel/see-more-icon.svg" alt=""/>
            <div>Load More Files</div>
          </button>
          }
        </div>
      );
    }

    return <div styleName="no-files-message"><p>This chat has no files</p></div>;
  };

  clickFileUpload = () => {
    const {clickFileUploadInRightPanel} = this.props;
    clickFileUploadInRightPanel();
  }

  renderContainer() {
    const {
      activePanel,
      activeChat,
      currentUserId,
      admins,
      isCreating,
      actions,
      currentUserIsAdmin,
      isUploadingChatPicture,
      inviteBoxActive,
      isMuted,
      isSearchable,
      isClass,
      chats
    } = this.props;

    if (activePanel === "user") {
      if (isCreating === "subchat_setup") {
        return <SubChatSetup renderUserList={this.renderUserList}/>;
      } else {
        return (
          <RightUserContainer
              renderUserList={this.renderUserList}
              currentUserIsAdmin={currentUserIsAdmin}
              inviteBoxActive={inviteBoxActive}
          />);
      }
    } else if (activePanel === "setting") {
      return (
        (!activeChat || !admins) ?
          <img src="img/ring.gif" alt="loading"/>
          :
          <SettingsPanel
              isBotChat={this.isBotChat}
              activeChat={activeChat}
              currentUserId={currentUserId}
              isMuted={isMuted}
              isSearchable={isSearchable}
              admins={admins}
              changeChatDetails={actions.changeChatDetails}
              leaveChat={actions.leaveChat}
              startDeleteChat={actions.startDeleteChat}
              isUploadingChatPicture={isUploadingChatPicture}
              uploadChatPicture={actions.uploadChatPicture}
              toggleNotifications={actions.toggleNotifications}
              toggleAddNewUserFromParent={actions.toggleAddNewUserFromParent}
              togglePrivacy={actions.togglePrivacy}
              isClass={isClass}
              chats={chats}
          />
      );
    } else if (activePanel === "file") {
      return (
        <RightFileContainer
            renderFileList={this.renderFileList}
            clickFileUpload={this.clickFileUpload}
            currentUserIsAdmin={currentUserIsAdmin}
        />);
    }

    return null;
  }

  changePanelStyling(type) {
    const {activePanel} = this.props;

    if (type === activePanel) {
      return activePanel + "-panel-icon";
    } else {
      return "panel-icon";
    }
  }

  changePanelSrc(type) {
    const {activePanel} = this.props;

    const path = "img/right_panel/";
    if(type === activePanel) {
      return path + "filled-" + type + "-icon.svg";
    } else{
      return path + type + "-icon.svg";
    }
  }

  toggleSubchatCreation = () => {
    const {rightPanelActive, isCreating, actions} = this.props;

    if (rightPanelActive) {
      actions.toggleRightPanel();
    }
    if (isCreating === "subchat") {
      actions.setCreating(false);
    }
  }

  renderSubChatCreation() {
    const {isCreating} = this.props;

    if (isCreating === "subchat") {
      return <CreateChatorClass chatOrClass="Subchat" toggle={this.toggleSubchatCreation}/>;
    }

    return null;
  }

  changeActivePanel = memoize(panel => () => this.props.actions.changeActivePanel(panel));

  renderInviteBox() {
    const {inviteBoxActive} = this.props;
    if (inviteBoxActive) {
      return <InviteBox/>;
    }
    return null;
  }

  render() {
    const {activePanel, rightPanelActive, isCreating} = this.props;

    return (
      <div
          className={activePanel}
          styleName="rightPanel"
          style={{display: rightPanelActive ? "block" : "none"}}
      >
        {isCreating === "subchat" && this.renderSubChatCreation()}
        {isCreating !== "subchat" &&
        <div styleName="panel-container">
          <img
              styleName={this.changePanelStyling("user")}
              src={this.changePanelSrc("user")}
              onClick={activePanel !== "user" && this.changeActivePanel("user")}
              onKeyDown={onEnterKey(this.changeActivePanel("user"))}
              alt="users"
              title="users"
              tabIndex="0"
              role="tab"
          />
          <img
              styleName={this.changePanelStyling("file")}
              src={this.changePanelSrc("file")}
              onClick={activePanel !== "file" && this.changeActivePanel("file")}
              onKeyDown={onEnterKey(this.changeActivePanel("file"))}
              alt="files"
              title="files"
              tabIndex="0"
              role="tab"
          />
          <img
              styleName={this.changePanelStyling("setting")}
              src={this.changePanelSrc("setting")}
              onClick={activePanel !== "setting" && this.changeActivePanel("setting")}
              onKeyDown={onEnterKey(this.changeActivePanel("setting"))}
              alt="settings"
              title="settings"
              tabIndex="0"
              role="tab"
          />
        </div>
        }
        {isCreating !== "subchat" && this.renderContainer()}
      </div>
    );
  }
}
