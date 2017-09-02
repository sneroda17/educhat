import React, {Component, PropTypes} from "react";
import styles from "../styles/AddTagsToUserProfile.css";
import cssModules from "react-css-modules";
import connect from "../helpers/connect-with-action-types";
import {addNewAreaOfStudy} from "../actions/current-user";

@connect(state => ({
  yourId: state.currentUser.id
}), {
  addNewAreaOfStudy
})
@cssModules(styles)


export default class AddAreasOfStudyToUserProfile extends Component {

  static propTypes = {
    closeAddTagsPopupWindow: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired
  };

  state = {
    newTag: "",
    maxAreasOfStudy: false
  };

  inputNewTag = (e) => {
    const newTag = e.target.value;
    this.setState({newTag: newTag});
  };

  addNewTag = () => {
    const {actions, yourId} = this.props;
    actions.addNewAreaOfStudy(yourId, this.state.newTag, this.props.userData.areas_of_study);
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
              placeholder="Add area of study with maxlength of 20"
              styleName="input-tags-box"
              onChange={this.inputNewTag}
              value={this.state.newTag}
              maxLength="20"
              size="40"
          />
          <br/>
          {
            (this.props.userData.areas_of_study && (this.props.userData.areas_of_study.size < 5)) &&
            <input
                type="button"
                value="Add"
                styleName="add-button"
                disabled={!this.state.newTag}
                onClick={this.addNewTag}
            />
          }
          <table styleName="tags-list">
            <tbody>
              <tr>
                {this.props.userData.areas_of_study
                && this.props.userData.areas_of_study.map((tag) =>
                  <td styleName="tag-item" key={tag}>{tag}</td>)
                }
              </tr>
            </tbody>
          </table>
        </div>
        <div styleName="background"/>
      </div>
    );
  }
}
