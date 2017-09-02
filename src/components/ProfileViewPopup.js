import React, {Component, PropTypes} from "react";
import styles from "../styles/ProfileViewPopup.css";
import connect from "../helpers/connect-with-action-types";
import cssModules from "react-css-modules";
import {closeUserProfile} from "../actions/ui/main-panel";
import {uploadProfilePicture,
  changeAreaOfStudy,
  changeAccountInfo,
  deleteTag
} from "../actions/current-user";
import {createOneToOneChat} from "../actions/chats";
import User from "../records/user";
import ref from "../helpers/ref";
// import bindState from "../helpers/bind-state";
import AddTagsToUserProfile from "../components/AddTagsToUserProfile";
import AddAreasOfStudyToUserProfile from "../components/AddAreasOfStudyToUserProfile";
import GraduationYearDropdownList from "../components/GraduationYearDropdownList";
import ConfirmDeleteTag from "../components/ConfirmDeleteTag";
import ConfirmDeleteAreaOfStudy from "../components/ConfirmDeleteAreaOfStudy";

function getUserType(userCode) {
  switch(userCode) {
    case "a":
      return "Edu.Chat Team";
    case "p":
      return "Professor";
    case "s":
      return "Student";
    case "b":
      return "Bot";
    default:
      return "Other";
  }
}

@connect(state => ({
  userData: state.ui.mainPanel.userProfilePopupData,
  yourId: state.currentUser.id,
  isUploadingPicture: state.currentUser.isUploadingPicture,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  university: PropTypes.any,
  accountType: PropTypes.any,
  school: PropTypes.any,
  department: PropTypes.any,
  yearOfGraduation: state.currentUser.yearOfGraduation,
  areaOfStudy: state.currentUser.areaOfStudy
}), {
  closeUserProfile,
  uploadProfilePicture,
  createOneToOneChat,
  changeAreaOfStudy,
  changeAccountInfo,
  deleteTag
})
@cssModules(styles)
/* eslint-disable react/no-set-state */
export default class ProfileViewPopup extends Component {
  static propTypes = {
    userData: PropTypes.instanceOf(User).isRequired,
    yourId: PropTypes.number.isRequired,
    isUploadingPicture: PropTypes.bool.isRequired,
    yearOfGraduation: PropTypes.any,
    areaOfStudy: PropTypes.any
  };

  static defaultProps = {
    yearOfGraduation: 0,
    areaOfStudy: []
  };

  state = {
    isEditingProfile: false,
    isAddingNewTag: false,
    addTagsPopupWindow: false,
    addAreaOfStudyPopupWindow: false,
    confirmDeleteTagWindow: false,
    confirmDeleteAreaOfStudyWindow: false,
    graduationYearDropdownList: false,
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    email: this.props.email,
    university: this.props.university,
    accountType: this.props.accountType,
    school: this.props.school,
    department: this.props.department,
    yearOfGraduation: this.props.yearOfGraduation,
    areaOfStudy: this.props.areaOfStudy,
    targetTag: "",
    targetAreaOfStudy: ""
  };

  closePopup = () => this.props.actions.closeUserProfile();

  isitYourOwnProfile = () => this.props.userData.id === this.props.yourId;

  uploadProfilePicture = () => {
    {
      const {actions} = this.props;
      const picture = this.fileUpload.files[0];
      actions.uploadProfilePicture(picture, "Lucas");
    }
  };

  _createOneToOneChat = () => {
    const {actions} = this.props;
    actions.createOneToOneChat(this.props.userData);
  };

  openAddTagsPopupWindow = () => {
    // console.log("Areas of Study size: ", this.props.userData.areas_of_study.size);
    this.setState({addTagsPopupWindow: true});
  };

  closeAddTagsPopupWindow = () => {
    this.setState({addTagsPopupWindow: false});
  };

  openAddAreaOfStudyWindow = () => {
    const {userData} = this.props;
    if (!userData.areas_of_study || userData.areas_of_study.size < 5) {
      this.setState({addAreaOfStudyPopupWindow: true});
    } else {
      alert("Maximum Number of Areas of Study is Reached!"); // eslint-disable-line no-alert
    }
  };

  _deleteTag = (tag) => {
    const {actions} = this.props;
    actions.deleteTag(this.state.yourId, tag);
  };

  onDeleteTag = (tag) => {
    this.setState({confirmDeleteTagWindow: true});
    this.setState({targetTag: tag});
  };

  onDeleteAreaOfStudy = (tag) => {
    this.setState({confirmDeleteAreaOfStudyWindow: true});
    this.setState({targetAreaOfStudy: tag});
  };

  closeAddAreaOfStudyWindow = () => {
    this.setState({addAreaOfStudyPopupWindow: false});
  };

  closeConfirmDeleteTagWindow = () => {
    this.setState({confirmDeleteTagWindow: false});
  };

  closeConfirmDeleteAreaOfStudyWindow = () => {
    this.setState({confirmDeleteAreaOfStudyWindow: false});
  };

  toggleGraduationYearDropdownList = () => {
    this.setState({graduationYearDropdownList: !this.state.graduationYearDropdownList});
  };

  closeGraduationYearDropdownList = () => {
    this.setState({graduationYearDropdownList: false});
  };

  render() {
    const {userData, isUploadingPicture} = this.props;
    // const {isEditingProfile} = this.state;

    return (
      <div>
        <div styleName="profile-view-popup">
          <button onClick={this.closePopup} styleName="close-popup-btn">
            <img src="img/file_preview/close-icon.svg" alt=""/>
          </button>
          <div styleName={this.isitYourOwnProfile() ?
            "image-upload"
            :
            ""
          }
          >
            <label htmlFor="profile-pic-input">
              {isUploadingPicture ?
                <img styleName="image-upload-ring" src="img/ring.gif" alt="uploading profile"/>
                :
                /* <UploadProfileImage data={userData.picture_file.url}/> */
                <div>
                  <img
                      styleName={
                        this.isitYourOwnProfile() ? "profile-img-hoverable" : "profile-img"
                        }
                      src={userData.picture_file.url}
                      alt=""
                  />
                  {this.isitYourOwnProfile() &&
                    <img styleName="upload-img" src="img/change-profile-pic-icon.svg" alt=""/>
                  }
                </div>
              }
            </label>
            {this.state.addTagsPopupWindow &&
              <AddTagsToUserProfile
                  closeAddTagsPopupWindow={this.closeAddTagsPopupWindow}
                  userData={this.props.userData}
              />
            }
            {this.state.addAreaOfStudyPopupWindow &&
              <AddAreasOfStudyToUserProfile
                  closeAddTagsPopupWindow={this.closeAddAreaOfStudyWindow}
                  userData={this.props.userData}
              />
            }
            {this.state.confirmDeleteTagWindow &&
              <ConfirmDeleteTag
                  closeConfirmDeleteTagWindow={this.closeConfirmDeleteTagWindow}
                  userData={this.props.userData}
                  tag={this.state.targetTag}
              />
            }
            {this.state.confirmDeleteAreaOfStudyWindow &&
              <ConfirmDeleteAreaOfStudy
                  closeConfirmDeleteAreaOfStudyWindow={this.closeConfirmDeleteAreaOfStudyWindow}
                  userData={this.props.userData}
                  tag={this.state.targetAreaOfStudy}
              />
            }
            {this.isitYourOwnProfile() &&
            <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                ref={ref(this, "fileUpload")}
                onChange={this.uploadProfilePicture}
            />
            }
          </div>
          <p styleName="profile-name">
            {userData.first_name} {userData.last_name}
          </p>
          <div styleName={
            this.isitYourOwnProfile() ? "graduation-year" : "not-your-graduation-year"}
          >
            {(!this.state.graduationYearDropdownList) &&
            (userData.year_of_graduation ?
              <p>Class of {userData.year_of_graduation}</p>
                :
              (this.isitYourOwnProfile() && <p>Class of </p>)
            )
            }
            {(!this.state.graduationYearDropdownList && this.isitYourOwnProfile()) &&
              (userData.year_of_graduation ?
                <div
                    styleName="graduation-year-dropdown-button"
                    role="button"
                    onClick={this.toggleGraduationYearDropdownList}
                    onKeyDown={this.toggleGraduationYearDropdownList}
                    tabIndex="0"
                /> :
                <div
                    styleName="empty-graduation-year-dropdown-button"
                    role="button"
                    onClick={this.toggleGraduationYearDropdownList}
                    onKeyDown={this.toggleGraduationYearDropdownList}
                    tabIndex="0"
                />
              )
            }
            {this.state.graduationYearDropdownList &&
              <div
                  styleName="graduation-year-dropdown-list-button"
                  role="button"
                  onClick={this.toggleGraduationYearDropdownList}
                  onKeyDown={this.toggleGraduationYearDropdownList}
                  tabIndex="0"
              />
            }

            {this.state.graduationYearDropdownList &&
              <GraduationYearDropdownList
                  userData={this.props.userData}
                  closeGraduationYearDropdownList={this.closeGraduationYearDropdownList}
                  graduationYearDropdownList={this.state.graduationYearDropdownList}
              />
            }

          </div>
          {!this.isitYourOwnProfile() &&
          <button
              styleName="profile-send-msg-button"
              onClick={this._createOneToOneChat}
          >
            Send Message
          </button>
          }
          {this.isitYourOwnProfile() ?
            <p styleName="profile-tags__header-my-profile">Area of Study</p>
            :
            <p styleName="profile-tags__header">Area of Study</p>
          }
          {this.isitYourOwnProfile() &&
            <div styleName="add-tag-button-area-of-study"
                onClick={this.openAddAreaOfStudyWindow}
                onKeyDown={this.openAddAreaOfStudyWindow}
                role="button"
                alt="add-tag-button"
                tabIndex="0"
            >
              <img src="img/adding-tags.svg" alt=""/>
            </div>
          }
          <ul styleName="area-of-study__list">
            {userData.areas_of_study && userData.areas_of_study.map((tag) => {
              const _onDeleteAreaOfStudy = () => {
                this.onDeleteAreaOfStudy(tag);
              };
              return (
                <li styleName="profile-tag__item" key={tag}>
                  <div styleName="profile-tag__content">
                    {tag}
                    {
                      this.isitYourOwnProfile() &&
                      <div styleName="delete-tag-button">
                        <img
                            src="img/removing-tags.svg"
                            alt=""
                            role="button"
                            onClick={_onDeleteAreaOfStudy}
                            onKeyDown={_onDeleteAreaOfStudy}
                            tabIndex="0"
                        />
                      </div>
                    }
                  </div>
                </li>
              );
            }
            )}
          </ul>
          <div styleName="profile-separator"/>
          {/* ------------------------------------------------------------------------------- */}
          <p styleName="profile-tags__header">Tags</p>
          {this.isitYourOwnProfile() &&
          <div
              styleName="add-tag-button-tags"
              onClick={this.openAddTagsPopupWindow}
              onKeyDown={this.openAddTagsPopupWindow}
              role="button"
              alt="add-tag-button"
              tabIndex="0"
          >
            <img src="img/adding-tags.svg" alt=""/>
          </div>
          }
          <ul styleName="profile-tags__list">
            <li styleName="profile-tag__item">
              <div styleName="profile-tag__content">{getUserType(userData.type)}</div>
            </li>
            {userData.tags.map((tag, index) => {
              const _onDeleteTag = () => {
                this.onDeleteTag({tag});
              };
              return (
                <li styleName="profile-tag__item" key={index}>
                  <div styleName="profile-tag__content">
                    {tag.tag}
                    {
                      this.isitYourOwnProfile() &&
                      <div styleName="delete-tag-button">
                        <img
                            src="img/removing-tags.svg"
                            alt=""
                            role="button"
                            onClick={_onDeleteTag}
                            onKeyDown={_onDeleteTag}
                            tabIndex="0"
                        />
                      </div>
                    }
                  </div>
                </li>
              );
            }
            )}
          </ul>
          <div styleName="profile-separator"/>
          <p styleName="profile-tag-info">Academic and professional interests and skills</p>
        </div>
        {/* eslint-disable */}
        <div styleName="background" onClick={this.closePopup}/>
        {/* eslint-enable */}
      </div>
    );
  }
}
