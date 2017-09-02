import React from "react";
import styles from "../styles/BotFilesPanel.css";
import cssModules from "react-css-modules";
import BotFile from "./BotFile";


@cssModules(styles)
export default class BotFilesList extends React.PureComponent {

  render() {
    const {files} = this.props;
    if(files) {
      return(
        <div styleName="bot-file-list">
          {files.map((file, i) => {
            function _sendFilePreview() {
              this.props.setFilePreview(file);
            }
            return(
              <BotFile key={i}
                  fileName={file.file.name}
                  fileSize={file.file.filesize}
                  setFilePreview={_sendFilePreview}
              />
            );
          })}
        </div>
      );
    } else {
      return <div/>;
    }
  }
}
