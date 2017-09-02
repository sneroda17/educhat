import React from "react";
import styles from "../styles/BotFilesPanel.css";
import cssModules from "react-css-modules";
import BotUploadProgressPanel from "./BotUploadProgessPanel";
import BotFilesList from "./BotFilesList";
import Dropzone from "react-dropzone";
import connect from "../helpers/connect-with-action-types";
import {sendFile, setFilePreview} from "../actions/active-chat";

@connect(state => ({
  activeChat: state.activeChat,
  isUploadingFile: state.ui.mainPanel.isUploadingFile,
  uploadFileStatus: state.ui.mainPanel.uploadFileStatus
}), {
  sendFile,
  setFilePreview
})
@cssModules(styles)
export default class BotFilesPanel extends React.Component {
  onDrop = (acceptedFiles, rejectedFiles) => {
    // TODO only supporting single file upload right now
    const file = acceptedFiles[0];
    const title = file.name;
    // this.props.actions.displayBotUploadProgressPanel();
    this.props.actions.sendFile(file, title, "pdf", "", true);
  }
  render() {
    return(
      <div styleName="botFilesPanel">
        <div styleName="header">
          <span styleName="header-title">Files</span>
        </div>
        <BotFilesList files={this.props.activeChat.resources}
            setFilePreview={this.props.actions.setFilePreview}
        />
        <Dropzone onDrop={this.onDrop} style={{border: "none"}}>
          {this.props.isUploadingFile ?
            <BotUploadProgressPanel file={this.props.isUploadingFile}/> :
            <div>
              <h3 styleName="drop-info">{this.props.uploadFileStatus === "done" ?
                "File Succesfully Uploaded!" : "Drop your files here"}</h3>
            </div>
          }
        </Dropzone>
      </div>);
  }
}
