import React, {Component, PropTypes} from "react";
import styles from "../styles/AddTagsToUserProfile.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {addNewTags} from "../actions/current-user";

@connect(state => ({
  yourId: state.currentUser.id
}), {
  addNewTags
})
@cssModules(styles)

export default class AddTagsToUserProfile extends Component {
  static propTypes = {
    closeAddTagsPopupWindow: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired
  };

  state = {
    newTag: ""
  };

  inputNewTag = (e) => {
    const newTag = e.target.value;
    this.setState({newTag: newTag});
  };

  addNewTag = () => {
    const {actions, yourId} = this.props;
    actions.addNewTags(yourId, this.state.newTag);
    this.setState({newTag: ""});
  };

  render() {
    return (
      <div>
        <div styleName="add-tags-popup-window">
          <button
              styleName="close-tags-popup-window"
              onClick={this.props.closeAddTagsPopupWindow}
          >
            <img src="img/file_preview/close-icon.svg" alt=""/>
          </button>
          <br/>
          <input
              type="text"
              placeholder="Enter your tag"
              styleName="input-tags-box"
              onChange={this.inputNewTag}
              value={this.state.newTag}
              size="30"
          />
          <br/>
          <input
              type="button"
              value="Add" styleName="add-button"
              disabled={!this.state.newTag}
              onClick={this.addNewTag}
          />
          <table styleName="tags-list">
            <tbody>
              <tr>
                {this.props.userData.tags && this.props.userData.tags.map((tag, index) =>
                  <td styleName="tag-item" key={index}>{tag.tag}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
        <div styleName="background"/>
      </div>
    );
  }
}
