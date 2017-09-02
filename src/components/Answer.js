import React, {PureComponent} from "react";
import cssModules from "react-css-modules";
import styles from "../styles/Question.css";
import moment from "moment";
import connect from "../helpers/connect-with-action-types";
import {markAsBestAnswer} from "../actions/active-chat";

@connect(state => ({

}), {
  markAsBestAnswer
})


@cssModules(styles, {allowMultiple: true})
export default class Answer extends PureComponent {

  markAsBestAnswer = (answer, bool, answerList, messageId) => {
    this.props.actions.markAsBestAnswer(answer, !bool, answerList, messageId);
  };

  render() {
    const {answer, users, isUserAdmin, messageId, answerList} = this.props;
    const user = users.get(answer.user);
    return(
      <div styleName="answer">
        <div styleName="answer-name-pic">
          <img styleName="user-pic" src={user.picture_file.url ? user.picture_file.url : ""}
              alt=""
          />
          <span styleName="answer-user-name">
            {`${user.first_name} ${user.last_name} • ${moment(answer.created).fromNow()}`}
          </span>
          {isUserAdmin() &&
          <button styleName="best-answer-btn"
                  onClick={() => this.markAsBestAnswer(answer, answer.is_best_answer, answerList, messageId)}>
            <i styleName={`material-icons ${answer.is_best_answer ?
              "best-answer-icon-green" : "best-answer-icon"}`}
            >done</i>
          </button>}
        </div>
        <p styleName="answer-text">{answer.text}</p>
        <hr styleName="answer-border"/>
      </div>
    );
  }
}
