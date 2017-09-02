import React, {PropTypes, PureComponent} from "react";
import styles from "../styles/File.css";
import cssModules from "react-css-modules";
import moment from "moment";

import Message from "../records/message";
import User from "../records/user";
import {onEnterKey} from "../helpers/events";

@cssModules(styles)
export default class File extends PureComponent {
  static propTypes = {
    // styleOfMessage: PropTypes.oneOf(["current_user_message", "other_user_message"]).isRequired,
    message: ({message: msg}) => { // eslint-disable-line react/require-default-props
      if (msg === undefined) return new Error("message prop in File component is required");
      if (!(msg instanceof Message))
        return new Error("message prop in File component must be a Message record");
      if (msg.file === null)
        return new Error("message record passed to File component must have a non-null file");
      return null;
    },
    user: PropTypes.instanceOf(User).isRequired,
    setFilePreview: PropTypes.func.isRequired
  };

  setFilePreview = () => this.props.setFilePreview(this.props.message);

  render() {
    const {message, user, currentUserId} = this.props;
    const ext = message.file.name.split(".").pop();
    return (
      // <div styleName="message" data-message-id={message.id} data-style={styleOfMessage}>
      <div
          styleName="message"
          data-message-id={message.id}
          data-style={message.parent ? "other_user_message" :
          user.id === currentUserId ? "current_user_message" : "other_user_message"}
      >
        <div className="user-image-container">
          {user &&
            <button styleName="user-image-btn" onClick={this.openProfile}>
              <img
                  styleName={!message.parent ? "message-image" : "message-image-comment"}
                  src={(user.picture_file && user.picture_file.url) || "https://s3.amazonaws.com/test-files.edu.chat/ba1cd5bc560c71c6a695f919d303a56b26c3df9c9?AWSAccessKeyId=AKIAINCMB2C3GVHL42BA&Signature=wKPk7YRnpuKxR0lNtsv6qJ03uFI%3D&Expires=1499965560"}
                  alt={user.first_name || "Unknown User"}
              />
            </button>
          }
        </div>
        {(ext === "jpg" || ext === "bmp" || ext === "png" || ext === "jpeg"
        || ext === "gif" || ext === "svg") ?
          <div styleName="message-detail-container">
            <div styleName="message-username">{user.first_name || "Unknown User"}</div>
            <div styleName={!message.parent ? "message-textarea" : "message-textarea-comment"}>
              <div styleName={!message.parent ? "file-details" : "file-details-comment"}>
                <div styleName={
                  !message.parent ? "file-message-text" : "file-message-text-comment"}
                >
                  {message.text}
                </div>
                <div styleName="image-file-container">
                  <img
                      styleName={!message.parent ? "file-picture" : "file-picture-comment"}
                      src={message.file.url}
                      onClick={this.setFilePreview}
                      onKeyDown={onEnterKey(this.setFilePreview)}
                      role="link"
                      tabIndex="0"
                      alt=""
                  />
                  {
                    <div styleName={!message.parent ? "name-size" : "name-size-comment"}>
                      <div>
                        <div styleName={
                          !message.parent ? "file-name" : "file-name-comment"}
                        >
                          {message.file.name}
                        </div>
                        <div styleName={
                          !message.parent ? "file-size" : "file-size-comment"}
                        >
                          {(message.file.filesize / 1024).toFixed(2)} kb
                        </div>
                      </div>
                    </div>
                  }
                </div>
                {!message.parent ?
                  (message.comment_count !== 0 ?
                    (message.comment_count === 1 ?

                  <div styleName="comment-count" onClick={this.setFilePreview}>{message.comment_count} Comment</div>
                  :
                  <div styleName="comment-count" onClick={this.setFilePreview}>{message.comment_count} Comments</div>
                )
                  :
                  ""
                )
                  :
                  ""
                }
              </div>
            </div>
            <div styleName="message-time">
              {moment(message.created).calendar()}
            </div>
          </div>
        :
          <div styleName="message-detail-container">
            <div styleName="message-username">{user.first_name || "Unknown User"}</div>
            <div styleName={!message.parent ? "message-textarea" : "message-textarea-comment"}>
              <div styleName={!message.parent ? "file-details" : "file-details-comment"}>
                <div styleName={
                  !message.parent ? "file-message-text" : "file-message-text-comment"}
                >
                  {message.text}
                </div>
                <div styleName="text-file-container">
                  <div
                      styleName="file-ext-container"
                      onClick={this.setFilePreview}
                      onKeyDown={onEnterKey(this.setFilePreview)}
                      role="link"
                      tabIndex="0"
                  >
                    {ext}
                  </div>
                  {
                    <div styleName="name-size-file">
                      <div styleName="file-name-file">{message.file.name}</div>
                      <div styleName="file-size-file">
                        {(message.file.filesize / 1024).toFixed(2)} kb
                      </div>
                    </div>
                  }
                </div>
                {!message.parent ?
                  (message.comment_count !== 0 ?
                    (message.comment_count === 1 ?

                  <div styleName="comment-count-file" onClick={this.setFilePreview}>{message.comment_count} Comment</div>
                  :
                  <div styleName="comment-count-file" onClick={this.setFilePreview}>{message.comment_count} Comments</div>
                )
                  :
                  ""
                )
                  :
                  ""
                }
              </div>
            </div>
            <div styleName="message-time">
              {moment(message.created).calendar()}
            </div>
          </div>
        }
      </div>
    );
  }
}
