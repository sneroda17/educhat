import React, {PropTypes, Component} from "react";
import styles from "../styles/ChatInputComment.css";
import cssModules from "react-css-modules";
import {onEnterKey} from "../helpers/events";
import ref from "../helpers/ref";
import bindState from "../helpers/bind-state";
import TextareaAutosize from "react-autosize-textarea";

// import {changeQuestionModeActive} from "../actions/ui/main-panel";

const SUPPORTED_IMAGE_TYPES = Object.freeze([
  "png",
  "jpg",
  "jpeg",
  "gif"
]);

@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class ChatInputComment extends Component {

  constructor() {
    super();
    this.cancelFileUpload = this.cancelFileUpload.bind(this);
    this.clickFileInput = this.clickFileInput.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.startChangeFileName = this.startChangeFileName.bind(this);
    this.endChangeFileName = this.endChangeFileName.bind(this);
    // this.getChatInputHint = this.getChatInputHint.bind(this);
  }

  static propTypes = {
    sendMessage: PropTypes.func.isRequired,
    sendFile: PropTypes.func,
    changeIfExistsUnsentFile: PropTypes.func,
    ifHasUnsentFile: PropTypes.bool,
    isBotSubChat: PropTypes.bool,
    questionModeActive: PropTypes.bool,
    activeChatId: PropTypes.number,
    toggleRenderComment: PropTypes.bool
  };

  static defaultProps = {
    ifHasUnsentFile: false,
    activeChatId: -1
  };

  state = {
    message: "",
    file: null,
    fileTitle: "",
    fileExtension: "",
    previewSrc: null,
    isEditingFileName: false
  };

  fileInput;

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeChatId !== this.props.activeChatId) {
      this.setState({message: "", file: null, fileTitle: "", fileExtension: "", previewSrc: null});
    }
  }

  uploadNewFile() {
    this.clickFileInput();
  }

  confirmToReplaceWithANewFile = () =>
    confirm(// eslint-disable-line no-alert
      "Upload a new file? This means that your current uploaded file will be replaced!");

  clickFileInput = () => {
    const {ifHasUnsentFile} = this.props;
    /**
     * Check if there is unsent file when user click on the file upload button.
     * If there is, we need to confirm if the user really want to replace the current file,
     * or give the user a chance to get this cancelled.
     * */
    if (!ifHasUnsentFile || this.confirmToReplaceWithANewFile()) {
      this.fileInput.click();
    }
  }

  sendMessageAndClear = (e) => {
    const {sendMessage, sendFile, changeIfExistsUnsentFile} = this.props;
    const {message, file, fileTitle, fileExtension} = this.state;
    if (file) {
      let fileWholeName = fileTitle;
      if (fileExtension) {
        fileWholeName = fileWholeName.concat(".", fileExtension);
      }
      sendFile(file, fileWholeName, fileExtension, message);
      changeIfExistsUnsentFile(false);
      e.preventDefault();
    } else {
      sendMessage(message);
      e.preventDefault();
    }
    this.setState({message: "", file: null, fileTitle: "", fileExtension: "", previewSrc: null});
  };

  cancelFileUpload = () => {
    const {changeIfExistsUnsentFile} = this.props;
    changeIfExistsUnsentFile(false);
    this.clearChatInput();
  };

  clearChatInput = () => {
    this.setState({file: null, fileTitle: "", fileExtension: "", previewSrc: null});
  };

  onFileChange = ev => {
    const {changeIfExistsUnsentFile} = this.props;
    changeIfExistsUnsentFile(true);
    const file = ev.target.files[0];
    if (file) {
      let fileExtension = null;
      let fileName = file.name;
      if (file.name.indexOf(".") === -1) {
        this.setState({file, fileTitle: fileName, fileExtension});
      } else {
        const splitIndex = file.name.lastIndexOf(".");
        // fileName.fileExtension
        fileName = file.name.substring(0, splitIndex);
        fileExtension = file.name.substring(splitIndex + 1).toLowerCase();
        this.setState({file, fileTitle: fileName, fileExtension});
      }

      if (SUPPORTED_IMAGE_TYPES.indexOf(fileExtension) !== -1) {
        const reader = new FileReader();
        reader.onload = ev => {
          const data = ev.target.result;
          this.setState({previewSrc: data});
        };
        reader.readAsDataURL(file);
      }
    }
  };

  startChangeFileName() {
    this.setState({isEditingFileName: true});
  }

  endChangeFileName() {
    this.setState({isEditingFileName: false});
  }

  getChatInputHint() {
    const {ifHasUnsentFile, isBotSubChat, questionModeActive} = this.props;
    if (isBotSubChat || questionModeActive) {
      return "Ask bot a question...";
    } else {
      return "Leave a comment";
    }
  }
  onButtonClick = () => {
    const {questionModeActive} = this.props;
    this.props.changeQuestionModeActive(!questionModeActive);
  };

  render() {
    const {ifHasUnsentFile, isBotSubChat, questionModeActive, toggleRenderComment} = this.props;
    const {file, fileTitle, fileExtension, previewSrc, isEditingFileName} = this.state;
    return (
      <div>
        {file &&
        <div styleName="file-upload">
          <div styleName="file-upload-header">
            <div styleName="header-title">Upload File</div>
            <img
              styleName="cancel-img"
              src="img/fill-205.svg"
              onClick={this.cancelFileUpload}
              onKeyDown={onEnterKey(this.cancelFileUpload)}
              alt="Cancel file upload"
              tabIndex="0"
              role="button"
            />
          </div>

          <div styleName="file-upload-container">
            <img
              className="preview-image"
              styleName="file-preview-image"
              src={previewSrc || "img/file_preview/file.svg"}
              alt=""
            />
            {isEditingFileName
              ?
              <div styleName="file-name-area">
                <input
                  className="file-title-input"
                  styleName="file-title-input"
                  {...bindState(this, "fileTitle")}
                  maxLength="35"
                />
                <div styleName="file-title-ext">{"." + fileExtension}</div>
                <button styleName="change-file-title-button" onClick={this.endChangeFileName}>
                  Save
                </button>
                <div styleName="limit-check">
                  { (fileTitle.length < 35) ?
                    <div styleName="character-limit">
                      Characters left: {35 - fileTitle.length}
                    </div>
                    :
                    <div>
                      <div styleName="max-limit" >* Max Character Limit Reached</div>
                    </div>
                  }
                </div>
              </div>
              :
              <div styleName="file-name-area">
                <p styleName="file-title-text">
                  {fileTitle + "." + fileExtension}
                </p>
                { fileTitle.length > 50 ?
                  <button styleName="limit-exceed-button" onClick={this.startChangeFileName}>
                    Rename
                  </button>
                  :
                  <button
                    styleName="change-file-title-button"
                    onClick={this.startChangeFileName}
                  >
                    Rename
                  </button>
                }
                <div styleName="limit-check">
                  { !(fileTitle.length <= 35) ?
                    <div>
                      <div styleName="max-limit-initial" >
                        * File Name Exceeds 35 Characters
                      </div>
                    </div>
                    :
                    ""
                  }
                </div>

              </div>
            }
          </div>
        </div>
        }

        <div styleName="chat-panel"
             className="chat-panel">
          <div styleName="chat-input-container"
               className="chat-input-container-cic">
            {/* <div styleName="chat-left-wrapper">
              <img src="img/chat_panel/emoji.svg" alt="Emojis" title="Emojis"/>
            </div>*/}

            <TextareaAutosize
              styleName="chat-input"
              className="chat-input-cic"
              // cols="20" rows="7"
              placeholder={this.getChatInputHint()}
              onKeyPress={onEnterKey(this.sendMessageAndClear)}
              {...bindState(this, "message")}
            />

            <div styleName="chat-right-wrapper">
              {
                !(isBotSubChat || questionModeActive) &&
                <div>
                  <img
                    styleName="paperclip-img"
                    src="img/chat_panel/paperclip.svg"
                    onClick={this.clickFileInput}
                    alt="upload file"
                    title="Upload File"
                    role="button"
                    tabIndex="0"
                    onKeyDown={onEnterKey(this.clickFileInput)}
                  />
                  <input
                    className="upload-button"
                    styleName="upload-button"
                    type="file"
                    onChange={this.onFileChange}
                    ref={ref(this, "fileInput")}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
