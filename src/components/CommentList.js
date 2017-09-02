import React, {PureComponent, PropTypes} from "react";
import cssModules from "react-css-modules";
import styles from "../styles/CommentList.css";
import MessageRecord from "../records/message";
import CommentsRecord from "../records/comments-record";
import connect from "../helpers/connect-with-action-types";
import ChatInputComment from "../components/ChatInputComment";
import ref from "../helpers/ref";
import Message from "../components/Message";
import ImmutablePropTypes from "react-immutable-proptypes";
import User from "../records/user";

import {
  requestLoadComments,
  sendComment,
  receiveComment,
  setParentComment
} from "../actions/active-chat";
import {toggleRenderComment, openUserProfile} from "../actions/ui/main-panel";

@connect(state => {
  const parentComment = state.activeChat.parentComment;
  const filePreview = state.activeChat.filePreview;
  return {
    activeChat: state.activeChat,
    parentComment,
    filePreview,
    // messageComment: state.activeChat.getIn(["commentsList", parentComment.id]),
    users: state.users,
    currentUserId: state.currentUser.id,
    toggleRenderComment: state.ui.mainPanel.toggleRenderComment
  };
}, {
  requestLoadComments,
  receiveComment,
  sendComment,
  setParentComment,
  toggleRenderComment,
  openUserProfile
})
@cssModules(styles)
export default class CommentList extends PureComponent {
  static propTypes = {
    message: PropTypes.instanceOf(MessageRecord).isRequired,
    // messageComment: PropTypes.instanceOf(CommentsRecord),
    parentComment: PropTypes.instanceOf(MessageRecord).isRequired,
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number).isRequired,
    currentUserId: PropTypes.number.isRequired
  };

  static defaultProps = {
    // messageComment: null
  };

  scrollWrapper;

  state = {
    initialStage: true,
    scrollBarPreviousHeight: 0,
    currentChatId: null
  };

  scrollToTopOfContainer() {
    const messageScrollWrapper = this.commentsList;
    messageScrollWrapper.scrollTop = 0;
  }

  componentDidMount() {
    const {message, actions} = this.props;
    actions.requestLoadComments(message.id);
  }

  componentDidUpdate(oldProps) {
    const {message, actions, hasUnsentFile} = this.props;
    if (message !== oldProps.message) {
      actions.requestLoadComments(message.id);
    }
    if (!this.props.newMessageReceived) {
      if (this.state.initialStage) {
        // scrollToBottomOfContainer();
      } else {
        // scrollToCertainHeightOfContainer(this.state.scrollBarPreviousHeight);
      }
      // make sure that chat input is cleared if there is no unsent file
      if (!hasUnsentFile && this.chatinputref) {
        this.chatinputref.clearChatInput();
      }
    } else {
      // scrollToBottomOfContainer();
    }
  }

  sendComment = (msg) => {
    // alert(this.props.message.id);
    // alert(this.props.message.parent);
    this.props.actions.sendComment(this.props.parentComment.id, msg);
    this.setState({initialStage: true});
  };

  changeQuestionModeActive = () => {
    const {actions, questionModeActive} = this.props;
    actions.changeQuestionModeActive(!questionModeActive);
  };

  closePopup = () => {
    const {actions} = this.props;
    actions.toggleRenderComment(false);
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


  renderComments() {
    const {messageComment, users, actions, currentUserId, parentComment} = this.props;
    const commentsList = this.props.activeChat.commentsList[parentComment.id];
    console.log("commentsList: ");
    console.log(commentsList);
    // console.log("messageComment: ");
    // console.log(messageComment);
    return (
      !commentsList
        ? <img src="img/ring.gif" alt="loading chats" styleName="loading-icon"/>
        : <div>
          {commentsList.map(message =>
            <div key={message.id}>
              <Message
                key={message.id}
                message={message}
                user={users.get(message.user)}
                currentUserId={currentUserId}
                openProfilePopup={actions.openUserProfile}
              />
            </div>
          )}
        </div>);
  }

  render() {
    const {
      hasUnsentFile,
      questionModeActive,
      filePreview
    } = this.props;
    return (
      <div>
        <div styleName="comment-component-container">
          {/* <img*/}
          {/* styleName="close-popup-btn"*/}
          {/* src="img/file_preview/close-icon.svg"*/}
          {/* onClick={this.closePopup}*/}
          {/* alt="Close"*/}
          {/* tabIndex="0"*/}
          {/* role="button"*/}
          {/* onKeyDown={this.closePopup}*/}
          {/* />*/}

          <div
            styleName={!filePreview ? "chat-input-container" : ""}
            className="chat-input-container-cl">
            {/* <div styleName="chat-input">*/}
            {!filePreview ?
            <ChatInputComment
              commentInput
              sendMessage={this.sendComment}
              ifHasUnsentFile={hasUnsentFile}
              sendFile={this.sendFile}
              changeIfExistsUnsentFile={this.changeIfExistsUnsentFile}
              ref={ref(this, "chatinputref")}
              questionModeActive={questionModeActive}
              changeQuestionModeActive={this.changeQuestionModeActive}
            />
            :
            ""
          }
            {/* </div>*/}
          </div>

          <div styleName="comment-thread">
            <div
              className="comment-scroll-wrapper-cl"
              styleName="comment-scroll-wrapper"
              ref={ref(this, "scrollWrapper")}
              // onScroll={this.scrollTheMainPanelUp}
            >
              {this.renderComments()}
            </div>
          </div>
        </div>
        <div
          onClick={this.closePopup}
          role="button"
          tabIndex="0"
          onKeyDown={this.closePopup}
        />
      </div>

    );
  }
}
