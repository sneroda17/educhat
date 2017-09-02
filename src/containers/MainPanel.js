// @flow

import React, {PureComponent, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import connect from "../helpers/connect-with-action-types";
import Immutable from "immutable";

import Message from "../components/Message";
import File from "../components/File";

import WelcomeClass from "../components/WelcomeClass";
import WelcomeUserToChat from "../components/WelcomeUserToChat";

import MainHeader from "../components/MainHeader";
import ChatInput from "../components/ChatInput";
import {
  receiveMessage,
  sendMessage,
  sendFile,
  setFilePreview,
  changeIfExistsUnsentFile,
  requestLoadChat,
  startLoadChat
} from "../actions/active-chat";
import {
  changeHeaderType,
  openUserProfile,
  changeQuestionModeActive
} from "../actions/ui/main-panel";
import {addUsers} from "../actions/users";
import {changeChatDetails} from "../actions/chats";
import {toggleRightPanel} from "../actions/ui/right-panel";
import {toggleRenderComment} from "../actions/ui/main-panel";


import FilePreview from "../components/FilePreview";
import styles from "../styles/MainPanel.css";
import cssModules from "react-css-modules";
import RightPanel from "../containers/RightPanel";
import ProfileViewPopup from "../components/ProfileViewPopup";
import WelcomeToEduChat from "../components/WelcomeToEduChat";
import BotFilesPanel from "../components/BotFilesPanel";
import AdminBotChatPanel from "../components/AdminBotChatPanel";
import Question from "../components/Question";
import {setCreating} from "../actions/current-user";

import MessageRecord from "../records/message";
import User from "../records/user";
import Chat from "../records/chat";
import FileRecord from "../records/file";
import ref from "../helpers/ref";

import {requestPageMessages} from "../actions/active-chat";
import {messageRecived} from "../actions/socket";

import Socket from "../helpers/socket";
import {notify} from "../helpers/notifications";

function scrollToBottomOfContainer() {
  const messageScrollWrapper = document.getElementsByClassName("message-scroll-wrapper");
  messageScrollWrapper[0].scrollTop = messageScrollWrapper[0].scrollHeight;
}

function scrollToCertainHeightOfContainer(h) {
  const messageScrollWrapper = document.getElementsByClassName("message-scroll-wrapper");
  messageScrollWrapper[0].scrollTop = messageScrollWrapper[0].scrollHeight - h;
}

@connect(state => ({
  messages: state.activeChat.messages,
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  activeChatId: state.activeChat.id,
  typedMessage: state.activeChat.typedMessage,
  chat: state.chats.get(state.activeChat.id),
  chats: state.chats,
  parentChat: state.activeChat.parentId && state.chats.get(state.activeChat.parentId),
  currentUserIsAdmin: state.activeChat.admins && state.activeChat.admins.has(state.currentUser.id),
  filePreview: state.activeChat.filePreview,
  mainHeaderType: state.ui.mainPanel.mainHeaderType,
  rightPanelActive: state.ui.rightPanel.rightPanelActive,
  userProfilePopupData: state.ui.mainPanel.userProfilePopupData,
  currentUserId: state.currentUser.id,
  isCreating: state.currentUser.isCreating,
  admins: state.activeChat.admins,
  tas: state.activeChat.tas,
  hasUnsentFile: state.activeChat.hasUnsentFile,
  hasMessagesLoaded: state.activeChat.hasMessagesLoaded,
  isFirstTimeLoadingMessages: state.activeChat.isFirstTimeLoadingMessages,
  newMessageReceived: state.ui.mainPanel.newMessageReceived,
  questionModeActive: state.ui.mainPanel.questionModeActive,
  isBotSubChat: state.activeChat.isBotSubChat,
  isAdminChat: state.activeChat.isAdminChat
}), {
  receiveMessage,
  sendMessage,
  changeHeaderType,
  addUsers,
  changeChatDetails,
  sendFile,
  toggleRightPanel,
  openUserProfile,
  setCreating,
  setFilePreview,
  changeIfExistsUnsentFile,
  requestPageMessages,
  messageRecived,
  changeQuestionModeActive,
  startLoadChat,
  requestLoadChat,
  toggleRenderComment
})
@cssModules(styles)
export default class MainPanel extends PureComponent {

  constructor() {
    super();
    this.clickFileUploadInRightPanel = this.clickFileUploadInRightPanel.bind(this);
    this.changeIfExistsUnsentFile = this.changeIfExistsUnsentFile.bind(this);
    this.changeQuestionModeActive = this.changeQuestionModeActive.bind(this);
    new Socket(this.getMessage);
  }

  getMessage = ({message, user}) => {
    this.props.actions.messageRecived(message, user);
    if(this.props.currentUserId !== user.id) {
      notify(message, user, () => this.props.actions.requestLoadChat(
        parseInt(message.chat, 10), null, false));
    }
  };

  static propTypes = {
    messages: ImmutablePropTypes.listOf(PropTypes.instanceOf(MessageRecord)),
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number),
    activeChatId: PropTypes.number,
    chat: PropTypes.instanceOf(Chat),
    chats: ImmutablePropTypes.mapOf(PropTypes.instanceOf(Chat), PropTypes.number),
    parentChat: PropTypes.instanceOf(Chat),
    currentUserIsAdmin: PropTypes.bool,
    filePreview: PropTypes.instanceOf(FileRecord),
    mainHeaderType: PropTypes.string.isRequired,
    rightPanelActive: PropTypes.bool.isRequired,
    userProfilePopupData: PropTypes.instanceOf(User),
    currentUserId: PropTypes.number.isRequired,
    isCreating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    hasUnsentFile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    messages: null,
    users: null,
    activeChatId: null,
    chat: null,
    chats: null,
    parentChat: null,
    filePreview: null,
    userProfilePopupData: null,
    currentUserIsAdmin: false,
    hasUnsentFile: false
  };

  state = {
    initialStage: true,
    scrollBarPreviousHeight: 0,
    currentChatId: null
  };

  componentDidUpdate() {
    // const messageScrollWrapper = document.getElementsByClassName("message-scroll-wrapper");
    // messageScrollWrapper[0].scrollTop = messageScrollWrapper[0].scrollHeight;
    // alert(messageScrollWrapper[0].scrollHeight);
    if (!this.state.currentChatId || (this.state.currentChatId !== this.props.activeChatId)) {
      this.setState({initialStage: true, currentChatId: this.props.activeChatId});
    }
    const {hasUnsentFile} = this.props;
    if (!this.props.newMessageReceived) {
      if (this.state.initialStage) {
        scrollToBottomOfContainer();
      } else {
        scrollToCertainHeightOfContainer(this.state.scrollBarPreviousHeight);
      }
      // make sure that chat input is cleared if there is no unsent file
      if (!hasUnsentFile && this.chatinputref) {
        this.chatinputref.clearChatInput();
      }
    } else {
      /**
       * Do not delete this!!!!!!!!!!!!
       */
      // const messageScrollWrapper = document.getElementsByClassName("message-scroll-wrapper");
      // // alert(messageScrollWrapper[0].scrollTop);
      // // alert(messageScrollWrapper[0].scrollHeight);
      // const currentPosition =
      //    messageScrollWrapper[0].scrollTop + messageScrollWrapper[0].offsetHeight;
      // const bottom = messageScrollWrapper[0].scrollHeight;
      // // alert(currentPosition);
      // // alert(bottom);
      // // alert(currentPosition > bottom * 0.9);
      // if (currentPosition > bottom * 0.9) {
      //   scrollToBottomOfContainer();
      // }
      scrollToBottomOfContainer();
    }
  }


  renderMessages() {
    const {
      activeChatId,
      messages,
      users,
      currentUserId,
      chats,
      actions,
      admins,
      tas,
      isFirstTimeLoadingMessages
    } = this.props;
    // if there is no activeChatId in the reducer
    // (Eg.: when the user opens the app for the first time)
    if (activeChatId === 0 || chats.size === 0) {
      return <WelcomeToEduChat/>;
    }

    if (isFirstTimeLoadingMessages) {
      return(
        <img src="img/ring.gif" alt="loading chats" styleName="loading-icon"/>
      );
    } else if (!messages || messages.size === 0) {
      return <WelcomeUserToChat/>;
    } else {
      return (
        <div>
          {messages && messages.map((message) => {
            // this if clause should be removed after backend issue fixed
            if (message.user && !users.get(message.user)) {
              // return <p key={message.id}>This is a message sent by someone who has left</p>;
              if (message.file) {
                if(this.props.isBotSubChat) {
                  // we don't show files as messages in the bot chat
                  return "";
                } else {
                  return (
                    <File
                        key={message.id}
                        currentUserId={currentUserId}
                        message={message}
                        user={new User(null)}
                        setFilePreview={actions.setFilePreview}
                        fileName={message.file.name}
                        openProfilePopup={this.openProfilePopup}
                    />
                  );
                }
              } else {
                return (
                  <div key={message.id}>
                    <Message
                        key={message.id}
                        message={message}
                        user={null}
                        isAdmin={false}
                        isSelf={false}
                        isTA={false}
                        currentUserId={currentUserId}
                        openProfilePopup={this.openProfilePopup}
                    />
                  </div>
                );
              }
            }

            if (message.file) {
              const isMessageFromBot = message.user === 1;
              if(this.props.isBotSubChat && !isMessageFromBot) {
                // we don't show files as messages in the bot chat
                return "";
              }
              return (
                <File
                    key={message.id}
                    currentUserId={currentUserId}
                    message={message}
                    user={users.get(message.user)}
                    setFilePreview={actions.setFilePreview}
                    openProfilePopup={this.openProfilePopup}
                />

              );
            } else if(message.is_question && this.props.isAdminChat) {
              return(<Question key={message.id} message={message} user={users.get(message.user)}/>);
            } else {
              const thisUser = users.get(message.user);
              return (
                <div key={message.id}>
                  <Message
                      key={message.id}
                      message={message}
                      user={thisUser}
                      isAdmin={thisUser ? admins.has(thisUser.id) : false}
                      isSelf={thisUser ? currentUserId === thisUser.id : false}
                      isTA={thisUser ? tas.has(thisUser.id) : false}
                      currentUserId={currentUserId}
                      openProfilePopup={this.openProfilePopup}
                  />
                </div>
              );
            }
          })}
        </div>
      );
    }
  }

  setFilePreview(file) {
    const {actions} = this.props;
    actions.setFilePreview(file);
  }

  openProfilePopup = (userId) => {
    const {actions} = this.props;
    actions.openUserProfile(userId);
  };

  sendMessage = msg => {
    const {actions} = this.props;

    if (!/\S/.test(msg)) return;

    actions.sendMessage(msg);
    scrollToBottomOfContainer();
    this.setState({initialStage: true});
  };

  changeQuestionModeActive = () => {
    const {actions, questionModeActive} = this.props;
    actions.changeQuestionModeActive(!questionModeActive);
  };

  changeMainHeader = (headerType) => {
    const {mainHeaderType, actions} = this.props;

    if (mainHeaderType === headerType) {
      actions.changeHeaderType("normal");
    } else {
      actions.changeHeaderType(headerType);
    }
  };

  chatChatDetails = (headerType) => {
    const {actions, activeChatId} = this.props;

    const chatDesc = document.getElementsByClassName("chat-desc-input")[0].innerHTML;
    const chatName = document.getElementsByClassName("chat-name-input")[0].innerHTML;
    actions.changeChatDetails(activeChatId, chatName, chatDesc);
    this.changeMainHeader(headerType);
  };

  sendFile = (...args) => {
    const {actions} = this.props;

    actions.sendFile(...args);
    scrollToBottomOfContainer();
    actions.changeIfExistsUnsentFile(false);
    this.setState({initialStage: true});
  };

  renderFilePreview() {
    const {filePreview} = this.props;
    const {hasUnsentFile, isBotSubChat, activeChatId,
      questionModeActive} = this.props;
    if (filePreview) {
      return (
        <FilePreview
            ifHasUnsentFile={hasUnsentFile}
            isBotSubChat={isBotSubChat}
            questionModeActive={questionModeActive}
            activeChatId={activeChatId}
            changeIfExistsUnsentFile={this.changeIfExistsUnsentFile}
        />);
    } else {
      return "";
    }
  }

  toggleThisRightPanel = () => {
    const {rightPanelActive, isCreating, actions} = this.props;

    if (rightPanelActive && isCreating === "subchat") {
      actions.setCreating(false);
      return;
    }
    actions.toggleRightPanel();
  };
  /**
   * This function is triggered when user click on the upload button in the right panel.
   * When it is triggered, we then trigger a click on the fileupload button in the main panel.
   */
  clickFileUploadInRightPanel() {
    this.chatinputref.uploadNewFile();
  }

  // change state when user upload the new file, cancel the file upload or send the file already
  changeIfExistsUnsentFile(statusBoolean) {
    const {actions} = this.props;
    actions.changeIfExistsUnsentFile(statusBoolean);
  }

  requestPageMessages = () => {
    const {actions} = this.props;
    actions.requestPageMessages();
  };

  // trigger this function when scroll up the main panel
  scrollTheMainPanelUp = (e) => {
    const d = e.target;
    if (d.scrollTop === 0 && !this.props.hasMessagesLoaded) {
      this.setState({scrollBarPreviousHeight: d.scrollHeight});
      this.requestPageMessages();
      this.setState({
        initialStage: false
      });
    }
  };

  closePopup = () => {
    const {actions} = this.props;
    actions.toggleRenderComment(false);
  };

  render() {
    const {
      userProfilePopupData,
      chat,
      parentChat,
      mainHeaderType,
      rightPanelActive,
      currentUserIsAdmin,
      hasUnsentFile,
      isBotSubChat,
      questionModeActive,
      activeChatId,
      isAdminChat,
      messages
    } = this.props;

    return (
      <div styleName="main-panel-container">
        {userProfilePopupData && <ProfileViewPopup/>}
        <div styleName="main-panel">
          <MainHeader
              chat={chat}
              chatParent={parentChat}
              isBotSubChat={isBotSubChat}
              mainHeaderType={mainHeaderType}
              rightPanelActive={rightPanelActive}
              toggleRightPanel={this.toggleThisRightPanel}
          />

          <div styleName="message-container">
            <div styleName="inner-panel-container">
              <div
                  className="message-scroll-wrapper"
                  styleName="message-scroll-wrapper"
                  onScroll={this.scrollTheMainPanelUp}
              >
                {
                   (chat && chat.is_class) &&
                   <WelcomeClass
                       chatName={chat.name}
                       chatPicture={chat.picture_file.url}
                       chatDesc={chat.description}
                       message={messages}
                   />
                }
                {this.renderMessages()}
              </div>

              {(
                (chat && !chat.is_class)
                || (chat && chat.is_class && currentUserIsAdmin)
              ) &&
              <div styleName="chat-input-container">
                <ChatInput
                    ifHasUnsentFile={hasUnsentFile}
                    sendMessage={this.sendMessage}
                    sendFile={this.sendFile}
                    changeIfExistsUnsentFile={this.changeIfExistsUnsentFile}
                    ref={ref(this, "chatinputref")}
                    isBotSubChat={isBotSubChat}
                    questionModeActive={questionModeActive}
                    changeQuestionModeActive={this.changeQuestionModeActive}
                    activeChatId={activeChatId}
                  /* ref={chatinputref => this.chatinputref = chatinputref}*/
                />
              </div>
              }
            </div>
            {(!isBotSubChat && !isAdminChat) &&
            <RightPanel
                clickFileUploadInRightPanel={this.clickFileUploadInRightPanel}
            />}
            {(isBotSubChat && this.props.rightPanelActive) && <BotFilesPanel/>}
            {(isAdminChat && this.props.rightPanelActive) && <AdminBotChatPanel/>}
          </div>
        </div>
        {this.renderFilePreview()}
      </div>
    );
  }
}
