// @flow

import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/Message.css";
import cssModules from "react-css-modules";
import moment from "moment";
import MessageRecord from "../records/message";
import User from "../records/user";
import Autolinker from "autolinker";
import sanitizeHtml from "sanitize-html";

import {
  setParentComment,
  markAsBestAnswer,
  starMessage,
  unstarMessage,
  requestLoadComments
} from "../actions/active-chat";
import CommentList from "../components/CommentList";

import {toggleRenderComment} from "../actions/ui/main-panel";
import {forwardQuestionToTheBot} from "../actions/active-chat";
import connect from "../helpers/connect-with-action-types";

// import CommentsRecord from "../records/comments-record";


@connect(state => ({
  toggleRenderComment: state.ui.mainPanel.toggleRenderComment,
  parentComment: state.activeChat.parentComment,
  admins: state.activeChat.admins,
  questionModeActive: state.ui.mainPanel.questionModeActive,
  activeChatId: state.activeChat.id,
  filePreview: state.activeChat.filePreview
}), {
  toggleRenderComment,
  setParentComment,
  markAsBestAnswer,
  starMessage,
  unstarMessage,
  forwardQuestionToTheBot,
  requestLoadComments
})


@cssModules(styles)
export default class Message extends PureComponent {
  static propTypes = {
    message: PropTypes.instanceOf(MessageRecord).isRequired,
    openProfilePopup: PropTypes.func.isRequired,
    user: PropTypes.instanceOf(User),
    currentUserId: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool,
    isTA: PropTypes.bool,
    isSelf: PropTypes.bool,
    // toggleRenderComment: PropTypes.bool.isRequired,
    parentComment: PropTypes.instanceOf(MessageRecord),
    filePreview: PropTypes.instanceOf(MessageRecord)
  };

  static defaultProps = {
    user: null,
    isAdmin: false,
    isTA: false,
    isSelf: false,
    parentComment: null,
    filePreview: null
  };

  state = {
    toggleRenderComment: false,
    isMouseOnComment: false,
    markedAsHelpful: false,
    displayThankYouForwardMessage: false
  };
  openProfile = () => this.props.openProfilePopup(this.props.user.id);

  renderMsg = () => {
    // Look for urls and turn them into links, also make sure we run an html sanatizer
    // before we render that.
    const messageWithLink = Autolinker.link(this.props.message.text, {className: "msgLink"});
    const SanitizedMessage = sanitizeHtml(messageWithLink, {
      allowedTags: ["a"],
      allowedAttributes: {
        "a": ["href", "target"]
      }
    });
    return {__html: SanitizedMessage};
  };

  mouseEnter = () => {
    this.setState({isMouseOnComment: true});
  };

  mouseLeave = () => {
    this.setState({isMouseOnComment: false});
  };

  isMessageFromBot = () => {
    const userId = this.props.user.id;
    const botId = 1;
    return userId === botId;
  };

  markAsHelpful = () => {
    this.setState({markedAsHelpful: true});
    this.setState({displayThankYouForwardMessage: true}, () => {
      setTimeout(() => this.setState({displayThankYouForwardMessage: false}), 1000);
    });
  };


  forwardQuestionToTheBot = () => {
    this.props.actions.forwardQuestionToTheBot(this.props.activeChatId);
  };

  renderMessageWithUser = (user, message, currentUserId, isAdmin, isSelf, isTA, parentComment, filePreview) => {
    const {toggleRenderComment} = this.props;
    return(
      <div
        styleName={message.parent ? "comment" : "message"}
        data-message-id={message.id}
        data-style={(user.id === currentUserId && message.parent === null)
          ? "current_user_message"
          : "other_user_message"}
      >
        <div className="user-image-container">
          {user &&
          <button styleName="user-image-btn" onClick={this.openProfile}>
            <img styleName={message.parent ? "comment-image" : "message-image"} src={user.picture_file.url} alt={user.first_name}/>
          </button>
          }
        </div>
        {/* This is the toolbar only for current_user_message that is not a comment*/}
        {user.id === currentUserId && !message.parent
          ? <div
            styleName="tool-bar"
            className="tool-bar"
            data-style="current_user_message"
            onMouseEnter={this.mouseEnter}
            onMouseLeave={this.mouseLeave}
          >
            {this.state.isMouseOnComment && !message.is_starred
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.starMessage}
                src="img/ic_star_border_black_24px.svg">
                {/* <i styleName="material-icons">star_border</i>*/}
              </img>
              : ""}

            {message.is_starred
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.unstarMessage}
                src="img/ic_star_black_24px.svg">
                {/* <i styleName="material-icons">star</i>*/}
              </img>
              : ""}

            {this.state.isMouseOnComment && !message.parent && !this.state.isCommentListOpen
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.toggleComments}
                src= "img/ic_reply_black_24px.svg">
                {/* <i styleName="material-icons">reply</i>*/}
              </img>
              : ""
            }
          </div>
          : ""}

        <div
          styleName="message-detail-container"
          className="message-detail-container"
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        >
          <div styleName="user-details-container"
               className="user-details-container"
          >
            <div styleName={message.parent ? "comment-username" : "message-username" }> {user && user.first_name}</div>
            {!isSelf && isAdmin && <div styleName="admin">Admin</div>}
            {!isSelf && isTA && <div styleName="ta">TA</div>}
          </div>

          <div
            styleName={message.parent ?
                        (!filePreview ? // To check if the comment is on a file or message
                          "comment-textarea"
                        :
                          "comment-textarea-filepreview"
                        )
                        : "message-textarea"}
            className="message-textarea"
          >
            <div dangerouslySetInnerHTML={this.renderMsg()}/>
            {!message.parent
              ? (this.state.isCommentListOpen && parentComment.id === message.id
                  ? <div styleName="comment-count" onClick={this.toggleComments}
                  >
                    Collapse comments</div>
                  : (message.comment_count !== 0
                    ?<div styleName="comment-count" onClick={this.toggleComments}>
                      {message.comment_count} Comments
                    </div>
                    :"")
              )
              : ""}
          </div>
          {this.state.isCommentListOpen
            ? (parentComment.id === message.id
              ? <CommentList message={message} />
              : "")
            : ""}

          <div styleName="message-timestamp">
            {this.state.isMouseOnComment && moment(message.created).calendar()}
          </div>

        </div>

        {/* This is the toolbar for other_user_message or current_user_message that is comment*/}
        {user.id !== currentUserId || message.parent
          ? <div
            styleName="tool-bar"
            className="tool-bar"
            data-style="other_user_message"
            onMouseEnter={this.mouseEnter}
            onMouseLeave={this.mouseLeave}
          >
            {this.state.isMouseOnComment && !message.is_starred
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.starMessage}
                src="img/ic_star_border_black_24px.svg">
                {/* <i styleName="material-icons">star_border</i>*/}
              </img>
              : ""}

            {message.is_starred
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.unstarMessage}
                src="img/ic_star_black_24px.svg">
                {/* <i styleName="material-icons">star</i>*/}
              </img>
              : ""}

            {this.state.isMouseOnComment && !message.parent && !this.state.isCommentListOpen
              ? <img
                styleName="tool-bar-buttons"
                onClick={this.toggleComments}
                src= "img/ic_reply_black_24px.svg">
                {/* <i styleName="material-icons">reply</i>*/}
              </img>
              : ""
            }
          </div>
          :""}

        {(this.isMessageFromBot() && !this.state.markedAsHelpful) &&
        <div styleName="forward-question-container">
          <span>Was this hepful?</span>
          <button styleName="forward-question-btn"
                  onClick={this.markAsHelpful}
          >Yes</button>
          <button styleName="forward-question-btn"
                  onClick={this.forwardQuestionToTheBot}
          >No</button>
        </div>}
        {this.state.displayThankYouForwardMessage &&
        <span styleName="msg-forward-feedback-msg">Thank you for the feedback!</span>}
      </div>


    );
  };

  toggleComments = () => {
    const {actions, message} = this.props;
    this.setState({isCommentListOpen: !this.state.isCommentListOpen});
    this.state.isCommentListOpen ? actions.setParentComment(null) : actions.setParentComment(message);
  };

  renderComment = () => {
    const {actions, message} = this.props;
    actions.toggleRenderComment(true);
    actions.setParentComment(message);
  };

  markBestAnswer = () => {
    const {message, actions} = this.props;
    actions.markAsBestAnswer(message);
  };

  starMessage = () => {
    const {message, actions} = this.props;
    console.log("STAR");
    actions.starMessage(message);
  };

  unstarMessage = () => {
    const {message, actions} = this.props;
    actions.unstarMessage(message);
  };


  render() {
    const {message, currentUserId, user, isAdmin, isTA, isSelf, parentComment, filePreview} = this.props;
    const defaultProfilePic = "img/defaultUser.jpeg";
    if(user) {
      return this.renderMessageWithUser(
        user, message, currentUserId, isAdmin, isSelf, isTA, parentComment, filePreview);
    } else {
      return(
        <div styleName="message" data-style="other_user_message">
          <div className="user-image-container">
            <button styleName="user-image-btn">
              <img
                styleName="message-image"
                src={defaultProfilePic}
                alt="Unknown User"
              />
            </button>
          </div>
          <div styleName="message-detail-container" title={moment(message.created).calendar()}>
            <div styleName="user-details-container">
              <div styleName="message-username">{"Unknown User"}</div>
            </div>
            <div styleName="message-textarea">
              <div className="message-text" dangerouslySetInnerHTML={this.renderMsg()}/>
            </div>

          </div>
        </div>
      );
    }
  }
}
