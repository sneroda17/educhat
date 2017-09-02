import React from "react";
import styles from "../styles/BotFilesPanel.css";
import cssModules from "react-css-modules";

@cssModules(styles)
export default class BotFile extends React.PureComponent {
  limitNameSize = (filename) => {
    const limit = 13;
    if(filename.length > limit) {
      const nameStart = filename.substring(0, 4);
      const extension = filename.substring(filename.length - 3, filename.length);
      return nameStart + "..." + extension;
    }
    return filename;
  }
  showFilesInMB = (fileSizeInBytes) => (fileSizeInBytes / 1000);
  render() {
    return(
      <div styleName="bot-file" onClick={this.props.setFilePreview}
          onKeyDown={this.props.setFilePreview}
          tabIndex="0"
          role="button"
          title={this.props.fileName}
      >
        <span>{this.limitNameSize(this.props.fileName)}</span>
        <span>{this.showFilesInMB(this.props.fileSize)} KB</span>
      </div>);
  }
}
