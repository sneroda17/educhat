import React, {Component, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import styles from "../styles/SettingsPanel.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";
import bindSate from "../helpers/bind-state";
import ref from "../helpers/ref";
import ChatSettingPrivacyToggle from "../components/ChatSettingPrivacyToggle";


@cssModules(styles, {allowMultiple: true})
/* eslint-disable react/no-set-state */
export default class SettingsPanel extends Component {
  static propTypes = {
    chats: ImmutablePropTypes.orderedMapOf(PropTypes.instanceOf(Chat)),
    activeChat: PropTypes.instanceOf(Chat),
    changeChatDetails: PropTypes.func.isRequired,
    admins: ImmutablePropTypes.setOf(PropTypes.number),
    currentUserId: PropTypes.number.isRequired,
    isMuted: PropTypes.bool.isRequired,
    isSearchable: PropTypes.bool.isRequired,
    leaveChat: PropTypes.func.isRequired,
    startDeleteChat: PropTypes.func.isRequired,
    isBotChat: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAddNewUserFromParent: PropTypes.func.isRequired,
    isClass: PropTypes.bool.isRequired
  };

  static defaultProps = {
    chats: null,
    admins: null,
    activeChat: null
  }

  constructor(props) {
    super(props);
    const {activeChat} = props;

    this.state = {
      isEditingName: false,
      isEditingDesc: false,
      isEditingInfo: false,
      newChatName: activeChat.name,
      newChatDesc: activeChat.description,
      isMuted: this.props.isMuted,
      isSearchable: this.props.isSearchable,
      addNewUserFromParent: this.props.chats.get(activeChat.id).add_new_users_from_parent
    };
  }

  _toggleEditName = () => {
    const {activeChat, changeChatDetails} = this.props;
    const {isEditingName, newChatName} = this.state;

    if (isEditingName) {
      // Whenever the user closes the editing panel, we send the data in the form to
      // the api(same thing happens to description)
      changeChatDetails(activeChat.id, newChatName, activeChat.description);
      this.setState({isEditingName: false});
    } else {
      this.setState({isEditingName: true});
    }
  };

  _toggleEditDesc = () => {
    const {changeChatDetails, activeChat} = this.props;
    const {isEditingDesc, newChatName, newChatDesc} = this.state;

    if(isEditingDesc) {
      this.setState({isEditingDesc: false});
      changeChatDetails(activeChat.id, newChatName, newChatDesc);
    } else {
      this.setState({isEditingDesc: true});
    }
  }

  toggleEditInfo = () => {
    const {changeChatDetails, activeChat} = this.props;
    const {isEditingInfo, newChatName, newChatDesc} = this.state;
    if (isEditingInfo) {
      changeChatDetails(activeChat.id, newChatName, newChatDesc);
      this.setState({isEditingInfo: false, isEditingName: false, isEditingDesc: false});
    } else {
      this.setState({isEditingInfo: true, isEditingName: true, isEditingDesc: true});
    }
  }

  _updateChatDesc = (e) => this.setState({newChatDesc: e.target.value});

  _leaveChat = () => this.props.leaveChat(
    this.props.activeChat.id, this.props.currentUserId, this.props.activeChat.parent);

  uploadChatPicture = () => {
    const {uploadChatPicture} = this.props;

    const picture = this.fileUpload.files[0];
    uploadChatPicture(picture, "Lucas2");
  }

  toggleNotifications = () => {
    const {currentUserId, activeChat, toggleNotifications} = this.props;
    this.setState({isMuted: !this.state.isMuted});
    toggleNotifications(currentUserId, activeChat.id, !this.state.isMuted);
  }

  toggleAddNewUserFromParent = () => {
    const {activeChat, toggleAddNewUserFromParent} = this.props;
    this.setState({addNewUserFromParent: !this.state.addNewUserFromParent});
    toggleAddNewUserFromParent(activeChat.id, !this.state.addNewUserFromParent);
  }


  startDeleteChat = () => this.props.startDeleteChat(
    this.props.activeChat.id, this.props.activeChat.parent);

  togglePrivacy = () => {
    const {activeChat, togglePrivacy} = this.props;
    this.setState({isSearchable: !this.state.isSearchable});
    togglePrivacy(activeChat.id, !this.state.isSearchable);
  }

  toggleBox = () => {
    const x = document.getElementById("toggleBoxSettings");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  render() {
    const {admins, currentUserId, activeChat, isUploadingChatPicture, isClass
    } = this.props;
    const {isEditingName, isEditingDesc, isEditingInfo, isMuted} = this.state;

    return (
      <div styleName="right-event-container">
        <div styleName="chat-settings">
          { /* <img src={activeChat.picture_file.url}
           alt="change chat logo" styleName="chat-picture"/> */}
          {!isEditingInfo &&
          <button styleName={admins.has(currentUserId) ? "edit-button" : "edit-button-invisible"}
              onClick={this.toggleEditInfo}
          >
            <div styleName={admins.has(currentUserId) ? "edit-text" : "edit-text-invisible"}>
              Edit
            </div>
          </button>
          }
          {isEditingInfo &&
          <button styleName={admins.has(currentUserId) ? "save-button" : "save-button-invisible"}
              onClick={this.toggleEditInfo}
          >
            <div styleName={admins.has(currentUserId) ? "save-text" : "save-text-invisible"}>
              Save
            </div>
          </button>
          }
          <div styleName={isEditingInfo ? "chat-image-upload" : "chat-image-upload-disabled"}>
            <label htmlFor="chat-pic-input">
              {isUploadingChatPicture ?
                <img src="img/ring.gif" alt="uploading chat"/>
                :
                <div>
                  <img
                      styleName={isEditingInfo ? "chat-picture-hoverable" : "chat-picture"}
                      src={activeChat.picture_file.url}
                      alt="change chat logo"
                  />
                  { admins.has(currentUserId) && isEditingInfo &&
                  <img styleName="upload-img" src="img/change-profile-pic-icon.svg" alt=""/>
                  }
                </div>
              }
            </label>
            { admins.has(currentUserId) && isEditingInfo &&
            <input
                id="chat-pic-input"
                type="file"
                accept="image/*"
                ref={ref(this, "fileUpload")}
                onChange={this.uploadChatPicture}
            />
            }
          </div>
          <div styleName="chat-settings-name">
            {isEditingName ?
              <input
                  type="text"
                  styleName="chat-name-form"
                  {...bindSate(this, "newChatName")}
                  onKeyPress={this._sendNewName}
              />
              :
              <input
                  type="text"
                  styleName="chat-name-form"
                  {...bindSate(this, "newChatName")}
                  onKeyPress={this._sendNewName}
                  disabled
              />
            }
            {/* admins.has(currentUserId) &&
              <button styleName="edit-settings-btn" onClick={this._toggleEditName}>
                <img src="img/pencil-icon.svg" alt="edit name"/>
              </button>
              */
            }
          </div>
          <div styleName={isEditingInfo ? "name-desc-line-blue" : "name-desc-line"}/>
          <p styleName="chat-settings-desc">
            {isEditingDesc ?
              <textarea
                  styleName="chat-desc-form"
                  {...bindSate(this, "newChatDesc")}
                  cols="36" rows="6"
                  onKeyPress={this._updateChatDesc}
                  placeholder="Add a new description!"
              />
              :
              <textarea
                  styleName="chat-desc-form"
                  {...bindSate(this, "newChatDesc")}
                  cols="36" rows="6"
                  onKeyPress={this._updateChatDesc}
                  disabled
                  placeholder={activeChat.description === "" ?
                  "Add a new description!" : activeChat.description}
              />
            }

            { /* admins.has(currentUserId) &&
              <button styleName="edit-settings-btn" onClick={this._toggleEditDesc}>
                <img src="img/pencil-icon.svg" alt="edit description"/>
              </button>
              */
            }
          </p>
          <div styleName={isEditingInfo ? "line-blue" : "line"}/>
        </div>
        <div styleName="Rectangle-box">
          <i styleName="material-icons">build</i>
          <button
              id="show-advanced-settings"
              styleName="advanced-settings-button"
              type="button"
              onClick={this.toggleBox}
          >
            Advanced Settings
          </button>
        </div>
        <div
            id="toggleBoxSettings"
            styleName="hidden"
        >
          <div styleName="Rectangle-box">
            <ChatSettingPrivacyToggle
                isSearchable={this.state.isSearchable}
                togglePrivacy={this.togglePrivacy}
                isAdmin={admins.has(currentUserId)}
            />
          </div>
          <div styleName="small-line"/>
          <div styleName="Rectangle-box">
            <form>
              <i styleName="Notification-icon">notifications</i>
              <label styleName="notifications-text">
                {isMuted ?
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleNotifications}
                      defaultChecked="true"
                  />
                  :
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleNotifications}
                  />
                }
                Notifications
              </label>
            </form>
          </div>
          <div styleName="small-line"/>
          { this.props.chats.get(activeChat.id).parent ?
            <div>
          <div styleName="Rectangle-box">
            <form>
              <i styleName="Notification-icon">notifications</i>
              <label styleName={admins.has(currentUserId) ? "notifications-text" : "notifications-text-grey"}>
                { admins.has(currentUserId) ?
                  (this.props.chats.get(activeChat.id).add_new_users_from_parent ?
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleAddNewUserFromParent}
                      defaultChecked="true"
                  />
                  :
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleAddNewUserFromParent}
                  />)
                  :
                  (this.props.chats.get(activeChat.id).add_new_users_from_parent ?
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleAddNewUserFromParent}
                      defaultChecked="true"
                      disabled
                  />
                  :
                  <input
                      type="checkbox"
                      name="notifications"
                      styleName="notifications-checkbox"
                      onClick={this.toggleAddNewUserFromParent}
                      disabled
                  />)
                }
                Add users from Parent
              </label>
            </form>
          </div>
          <div styleName="small-line"/>
        </div>
          :
          ""
        }
          <div styleName="Rectangle-box">
            <i styleName="Notification-icon">delete</i>
            { /* <div styleName="chat-leave-archive">
             {(admins.has(currentUserId) && !this.props.isBotChat()
             && !this.props.activeChat.is_class) &&
             <button styleName="archive-btn" onClick={this.props.addBot}>Add bot</button>
             }
             {admins.has(currentUserId) && admins.size === 1 ?
             <input
             styleName="disabled-leave-btn" */ }
            {admins.has(currentUserId) ?
              <button
                  id="delete-chat-button"
                  styleName="delete-chat-button"
                  type="button"
                  onClick={this.startDeleteChat}
              >
                {isClass ? "Delete Class" : "Delete Chat"}
              </button>
              :
              <button
                  id="delete-chat-button"
                  styleName="delete-chat-button-grey"
                  type="button"
                  disabled
              >
                {isClass ? "Delete Class" : "Delete Chat"}
              </button>
            }
          </div>
          <div styleName="small-line"/>
          <div styleName="Rectangle-box">
            <img
                styleName="Leave-chat-icon"
                alt="Leave Chat Icon"
                src="img/logout-icon.svg"
            />
            { /* styleName="archive-btn leave-btn" */ }
            {admins.has(currentUserId) && admins.size === 1 ?
              <button styleName="Leave-chat-button-grey"
                  disabled
              >
                {isClass ? "Leave Class" : "Leave Chat"}
              </button>
              :
              <button styleName="Leave-chat-button"
                  onClick={this._leaveChat}
              >
                {isClass ? "Leave Class" : "Leave Chat"}
              </button>
            }
          </div>
        </div>
        <div styleName="line"/>
      </div>
    );
  }
}
