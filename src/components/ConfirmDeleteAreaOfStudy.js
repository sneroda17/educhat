import React, {Component, PropTypes} from "react";
import styles from "../styles/ConfirmDeleteAreaOfStudy.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {deleteAreaOfStudy} from "../actions/current-user";


@connect(state => ({
  yourId: state.currentUser.id
}), {
  deleteAreaOfStudy
})
@cssModules(styles)


export default class ConfirmDeleteAreaOfStudy extends Component {

  static propTypes = {
    closeConfirmDeleteAreaOfStudyWindow: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
    tag: PropTypes.string
  };

  static defaultProps = {
    tag: null
  };

  onYes = () => {
    const {actions, yourId, userData, tag} = this.props;
    actions.deleteAreaOfStudy(yourId, tag, userData.areas_of_study);
    this.props.closeConfirmDeleteAreaOfStudyWindow();
  };

  render() {
    const {tag} = this.props;
    return (
      <div>
        <div styleName="confirm-delete-tag-window">
          <p styleName="header">Delete {tag}?</p>
          <div>
            <button styleName="yes" onClick={this.onYes}>Yes</button>
            <button styleName="no" onClick={this.props.closeConfirmDeleteAreaOfStudyWindow}>
              No
            </button>
          </div>
        </div>
        <div styleName="background"/>
      </div>
    );
  }
}
