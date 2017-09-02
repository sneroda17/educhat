import React from "react";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {requestLoadComments, sendComment, markAsBestAnswer} from "../actions/active-chat";
import Answer from "./Answer";
import styles from "../styles/Question.css";


@connect(state => ({
  activeChat: state.activeChat,
  answerText: state.answerText,
  users: state.users,
  currentUser: state.currentUser
}), {
  requestLoadComments,
  sendComment
})
@cssModules(styles, {allowMultiple: true})
export default class Question extends React.Component {
  constructor() {
    super();
    this.state = {
      isAnswerListOpen: false,
      answerText: "",
      answersCount: 0,
      pageNumber: 0,
      scrollBarPreviousHeight: 0
    };
  }
  scrollToTopOfContainer() {
    const messageScrollWrapper = this.answersList;
    messageScrollWrapper.scrollTop = 0;
  }
  componentWillMount() {
    const {message} = this.props;
    this.setState({answersCount: message.comment_count});
  }
  toggleAnswers = () => {
    this.setState({isAnswerListOpen: !this.state.isAnswerListOpen});

    this.props.actions.requestLoadComments(this.props.message.id, 0);
  };
  updateAnswerText = (e) => {
    this.setState({answerText: e.target.value});
  };
  sendAnswer = (e) => {
    if(e.key === "Enter") {
      const {message} = this.props;
      this.props.actions.sendComment(message.id, this.state.answerText);
      this.setState({answerText: ""});
      this.setState({answersCount: this.state.answersCount + 1});
      this.scrollToTopOfContainer();
    }
  };
  isUserAdmin = () => {
    const currentUserId = this.props.currentUser.id;
    const chatAdminsList = this.props.activeChat.admins;
    return chatAdminsList.includes(currentUserId);
  };
  loadMoreAnswers = (e) => {
    const element = e.target;
    const currentPosition = element.scrollTop + element.offsetHeight;
    const button = element.scrollHeight;

    if (currentPosition >= button * 1) {
      this.setState({scrollBarPreviousHeight: element.scrollHeight});
      this.props.actions.requestLoadComments(this.props.message.id, 10);
      this.setState({
        initialStage: false
      });
    }
  };

  render() {
    const {message, user} = this.props;
    const answersList = this.props.activeChat.commentsList[message.id];
    return(
      <div styleName="question-container">
        <span styleName="user-name">{`${user.first_name} ${user.last_name}`}</span>
        <div styleName="user-pic-question-container">
          <img styleName="user-pic" src={user.picture_file.url} alt={user.first_name}/>
          <div styleName="question">
            <div styleName="question-header">
              <span styleName="question-text">{message.text}</span>
              <div styleName={message.isResolved ? "question-resolved" : "question-unresolved"}>
                {message.isResolved
                ? "Resolved" : "Unresolved"}</div>
            </div>
            <div
                styleName={this.state.isAnswerListOpen ? "answer-count-open" : "answer-count"}
                onClick={this.toggleAnswers}
                onKeyDown={this.toggleAnswers}
                tabIndex="0"
                role="button"
            >
              <span>{this.state.answersCount} answers</span>
              <i styleName="material-icons">keyboard_arrow_down</i>
            </div>
            {this.state.isAnswerListOpen &&
              <div>
                <div styleName="quesion-answer-board">
                  <input styleName="answer-input"
                      type="text"
                      placeholder="Type an answer..."
                      onKeyDown={this.sendAnswer}
                      onChange={this.updateAnswerText}
                      value={this.state.answerText}
                  />
                  <div styleName="answers-list"
                      onScroll={this.loadMoreAnswers}
                      ref={(answersList) => this.answersList = answersList}
                  >
                    {answersList && answersList.map((answer) => {
                      return(
                        <Answer key={answer.id}
                                answer={answer}
                                users={this.props.users}
                                currentUser={this.props.currentUser}
                                isUserAdmin={this.isUserAdmin}
                                markAsBestAnswer={this.props.actions.markAsBestAnswer}
                                messageId={message.id}
                                answerList={answersList}
                        />);
                    })}
                  </div>
                  {
                    this.props.activeChat.isLoadingComments &&
                    this.props.activeChat.isLoadingComments.fromMessage === message.id &&
                    <img styleName="loading-ring" src="img/advanced_loading.gif" alt=""/>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
