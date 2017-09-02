import React, {PropTypes} from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";

const propTypes = {
  renderFileList: PropTypes.func.isRequired,
  clickFileUpload: PropTypes.func.isRequired
};

function RightFileContainer({renderFileList, clickFileUpload, currentUserIsAdmin, isClass}) {
  return(
    <div styleName="right-file-container">
      <div styleName="add-container">
        <button
            styleName="add-icon"
            onClick={clickFileUpload}
            onKeyDown={clickFileUpload}
        >
          <span>
            <img src="img/right_panel/shape.svg" alt="Upload file"/>
          </span>
          <div styleName="add-text">Upload file</div>
        </button>
      </div>

      <div styleName="file-container">
        {renderFileList()}
      </div>
    </div>
  );
}

RightFileContainer.propTypes = propTypes;

export default cssModules(RightFileContainer, styles);

