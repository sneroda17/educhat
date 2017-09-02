import React, {PropTypes} from "react";
import styles from "../styles/App.css";
import cssModules from "react-css-modules";
import LeftPanel from "./LeftPanel";
import MainPanel from "./MainPanel";
import BotPanel from "./BotPanel";
import SessionExpiredPopup from "../components/SessionExpiredPopup";
import Loading from "../components/Loading";

import connect from "../helpers/connect-with-action-types";
import {getBrowserNotificationStatus} from "../helpers/notifications";

@connect(state => ({
  botPanelActive: state.ui.mainPanel.botPanelActive,
  hasSessionExpired: state.currentUser.hasSessionExpired,
  // isEverythingLoadedInMainPanel: state.ui.mainPanel.isEverythingLoadedInMainPanel,
  isClassesTabReady: state.ui.leftPanel.isClassesTabReady,
  isChatsTabReady: state.ui.leftPanel.isClassesTabReady
}), {
})

@cssModules(styles)
export default class EduChatPanel extends React.Component {
  constructor() {
    super();
    // Ask for notification permission right when the app loads
    getBrowserNotificationStatus();
  }

  static propTypes = {
    botPanelActive: PropTypes.bool.isRequired,
    hasSessionExpired: PropTypes.bool.isRequired,
    isClassesTabReady: PropTypes.bool.isRequired,
    isChatsTabReady: PropTypes.bool.isRequired
  };

  render() {
    const {
      botPanelActive,
      hasSessionExpired,
      // isEverythingLoaded,
      isClassesTabReady,
      isChatsTabReady
    } = this.props;
    return (
      <div>
        {(!isClassesTabReady || !isChatsTabReady) && <Loading/>}
        <div styleName="panel-container">
          {hasSessionExpired && <SessionExpiredPopup/>}
          <LeftPanel/>
          {botPanelActive ? <BotPanel/> : <MainPanel/>}
        </div>
      </div>
    );
  }
}


