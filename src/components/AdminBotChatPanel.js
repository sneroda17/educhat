import React, {PureComponent} from "react";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import styles from "../styles/AdminBotPanel.css";

@connect(state => ({
  messages: state.activeChat.messages
}), {

})
@cssModules(styles)
export default class AdminBotChatPanel extends PureComponent {
  render() {
    return (
      <div styleName="admin-bot-panel">
        <div styleName="header">
          <span styleName="header-title">Question Hub</span>
        </div>
        <div styleName="unresolved-header">
          <span>Unresolved<i styleName="material-icons">keyboard_arrow_down</i></span>
        </div>
        {this.props.messages.map((message) => (message.is_question && !message.is_resolved) &&
          <div styleName="questions-list-item">
            <span key={message.id}>{message.text}</span>
          </div>)
        }

        <div styleName="unresolved-header">
          <span>Resolved<i styleName="material-icons">keyboard_arrow_down</i></span>
        </div>
        {this.props.messages.map((message) => (message.is_question && message.is_resolved) &&
        <div styleName="questions-list-item">
          <span key={message.id}>{message.text}</span>
        </div>)}
      </div>
    );
  }
}
