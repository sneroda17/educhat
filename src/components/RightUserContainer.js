import React, {PropTypes} from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";
import InviteBox from "./InviteBox";
import InvitePeopleButton from "./InvitePeopleButton";

const propTypes = {
  renderUserList: PropTypes.func.isRequired,
  inviteBoxActive: PropTypes.bool.isRequired
};

function RightUserContainer({renderUserList, currentUserIsAdmin, inviteBoxActive}) {
  if (currentUserIsAdmin) {
    if (inviteBoxActive) {
      return (
        <div styleName="right-user-container">
          <InviteBox/>
        </div>
      );
    } else {
      return (
        <div styleName="right-user-container">
          <InvitePeopleButton/>
          <div styleName="user-container">
            {renderUserList()}
          </div>
        </div>
      );
    }
  } else {
    return (
      <div styleName="right-user-container">
        <div styleName="user-container">
          {renderUserList()}
        </div>
      </div>
    );
  }
}

RightUserContainer.propTypes = propTypes;

export default cssModules(RightUserContainer, styles);
