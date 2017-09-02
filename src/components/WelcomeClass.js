import React, {PureComponent} from "react";
import cssModules from "react-css-modules";
// import moment from "moment";
// import User from "../records/user";
import styles from "../styles/WelcomeClass.css";
// import Chat from "../records/chat";

@cssModules(styles)
export default class WelcomeClass extends PureComponent {
  render() {
    const {chatName, chatPicture, chatDesc, message} = this.props;
    // {alert(chatName);}
    // {alert(chatPicture);}
    return(
      <div>
        {message === null || message.size <= 1
          ?
            <div styleName="Welcome-Box">
              <div >
                <img
                    styleName="Chat-Picture"
                    src={chatPicture}
                    alt=""
                />
              </div>
              <div styleName="Chat-Name">
                {chatName}
              </div>
              <div
                  styleName="Welcome-Message"
              >
                {chatDesc}
                Welcome to the newly created chat - use this chat feature to talk to your friends ..
                Type in the first message.
              </div>
            </div>
          :
          ""
        }
      </div>

    );
  }
}
