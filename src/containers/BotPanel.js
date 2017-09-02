import React from "react";
import styles from "../styles/BotPanel.css";
import cssModules from "react-css-modules";
import ChatInput from "../components/ChatInput";
import Message from "../components/Message";
import BotRightPanel from "../components/BotRightPanel";
import BotCard from "../components/BotCard";
import BotCardAlt from "../components/BotCard.1";
import MessageRecord from "../records/message";

const DUMMY_MESSAGE = new MessageRecord({text: "Hey look"});
const BotPanel = () => {
  return (
    <div styleName="bot-panel">
      <div styleName="bot-header">
        <img
            styleName="bot-icon__circle"
            src="img/bot-panel-icon.png"
            alt=""
            height="40"
            width="45"
        />
        <span styleName="bot-text">Bot</span>
        <img src="img/information.svg" alt="chat information" styleName="bot-info"/>
      </div>

      <div styleName="bot-panel-content">
        <div styleName="bot-main-area">
          <div styleName="message-wrapper">
            <Message message={DUMMY_MESSAGE}/>
          </div>
          <div styleName="bot-card-list">
            <BotCard/>
            <br/>
            <BotCardAlt/>
          </div>
          <ChatInput/>
        </div>
        <BotRightPanel/>
      </div>
    </div>
  );
};

export default cssModules(BotPanel, styles);
