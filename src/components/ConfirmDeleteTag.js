import React, {Component, PropTypes} from "react";
import styles from "../styles/ConfirmDeleteTag.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {deleteTag} from "../actions/current-user";


@connect(state => ({
  yourId: state.currentUser.id
}), {
  deleteTag
})
@cssModules(styles)


export default class ConfirmDeleteTag extends Component {

  static propTypes = {
    closeConfirmDeleteTagWindow: PropTypes.func.isRequired,
    tag: PropTypes.object
  };

  static defaultProps = {
    tag: null
  };

  onYes = () => {
    const {actions, yourId, tag} = this.props;
    actions.deleteTag(yourId, tag.tag);
    this.props.closeConfirmDeleteTagWindow();
  };

  render() {
    const {tag} = this.props;
    return (
      <div>
        <div styleName="confirm-delete-tag-window">
          <p styleName="header">Delete tag {tag.tag.tag}?</p>
          <div>
            <button styleName="yes" onClick={this.onYes}>Yes</button>
            <button styleName="no" onClick={this.props.closeConfirmDeleteTagWindow}>No</button>
          </div>
        </div>
        <div styleName="background"/>
      </div>
    );
  }
}
