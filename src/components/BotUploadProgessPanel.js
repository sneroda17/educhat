import React from "react";
import styles from "../styles/BotUploadProgessPanel.css";
import cssModules from "react-css-modules";


@cssModules(styles)
export default class BotFilesPanel extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      progress: 0
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({progress: this.state.progress + 20});
    }, 5);
  }
  render() {
    const fileName = this.props.file;
    return(
      <div styleName="botProgressPanel">
        <div styleName="header">
          <span>File Upload</span>
        </div>
        <div>
          <div styleName="file">
            <span>{fileName}</span>
            <div styleName="progress-bar">
              <div style={{"backgroundColor": "#127C8A", "z-index": 10,
                "width": this.state.progress + "%"}}
              />
              <div styleName="progress-undone"/>
            </div>
          </div>
        </div>
      </div>);
  }
}
