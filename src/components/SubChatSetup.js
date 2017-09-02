import React, {Component, PropTypes} from "react";
import styles from "../styles/RightPanel.css";
import cssModules from "react-css-modules";
import Immutable from "immutable";
import connect from "../helpers/connect-with-action-types";
import SubChatParentUserList from "../components/SubChatParentUserList";
import ImmutablePropTypes from "react-immutable-proptypes";
import User from "../records/user";
import {requestLoadChat, resetUserListWithOnlyThisUser} from "../actions/active-chat";
import {showInviteListErrorMessage} from "../actions/ui/right-panel";
import {invite} from "../actions/active-chat";
import {setCreating} from "../actions/current-user";

@connect(state => ({
  users: state.activeChat.users &&
  new Immutable.Map(state.activeChat.users.map(id => [id, state.users.get(id)])),
  admins: state.activeChat.admins,
  tas: state.activeChat.tas,
  activeChatID: state.activeChat.id,
  parentChatID: state.activeChat.parentId,
  currentUserId: state.currentUser.id
}), {
  requestLoadChat,
  showInviteListErrorMessage,
  invite,
  setCreating,
  resetUserListWithOnlyThisUser
})
@cssModules(styles)
export default class SubChatSetup extends Component {

  constructor(props) {
    super();
    this.changeInviteAllOption = this.changeInviteAllOption.bind(this);
    this.inviteUserToThisSubChat = this.inviteUserToThisSubChat.bind(this);
    this.state = {
      ifInviteAllUsers: false,
      checkboxesState: props.users.map(user => false),
      subchatUserList: new Immutable.Map()
    };
  }

  static propTypes = {
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number),
    admins: ImmutablePropTypes.setOf(PropTypes.number),
    tas: ImmutablePropTypes.setOf(PropTypes.number),
    activeChatID: PropTypes.number.isRequired,
    parentChatID: PropTypes.number
  };

  static defaultProps = {
    users: null,
    admins: null,
    tas: null,
    parentChatID: null
  };

  state = {
    searchPeopleName: "",
    isSearching: false,
    searchPeopleResultList: []
  };

  componentWillReceiveProps(props) {
    if (props.users) {
      let userList = new Immutable.Map(this.props.users);
      userList = userList.delete(this.props.currentUserId);
      this.setState({
        subchatUserList: userList,
        ifInviteAllUsers: false,
        checkboxesState: userList.map(user => false)
      });
    }
  }

  changeInviteAllOption() {
    const nextBoolean = !this.state.ifInviteAllUsers;
    this.setState({ifInviteAllUsers: nextBoolean});
    const nextCheckboxesState = this.state.checkboxesState.map((check, index) => {
      return nextBoolean;
    });
    this.setState({checkboxesState: nextCheckboxesState});
  }

  inviteUserToThisSubChat() {
    const {activeChatID, parentChatID, actions} = this.props;
    actions.requestLoadChat(activeChatID, parentChatID, false);
    const inviteList = [];
    this.state.checkboxesState.map((ifChecked, index) => {
      if (ifChecked) {
        inviteList.push(index);
      }
      return null;
    }, this);
    if (inviteList.length === 0) {
      actions.showInviteListErrorMessage("No one is invited!");
    } else {
      actions.invite(inviteList);
    }
  }

  onChangeCheckState = (id) => {
    const newState = !this.state.checkboxesState.get(id);
    if (newState === false && this.state.ifInviteAllUsers === true) {
      this.setState({ifInviteAllUsers: false});
    }
    const newList = this.state.checkboxesState.set(id, newState);
    this.setState({checkboxesState: newList});
  }

  onSubchatSearchPeople = (e) => {
    const inputPeopleName = e.target.value;
    const searchResult = [];
    if (inputPeopleName !== "") {
      this.setState({
        searchPeopleName: inputPeopleName,
        isSearching: true
      });
      this.state.subchatUserList.toList().map((user) => {
        if (user.first_name.indexOf(inputPeopleName) !== -1
            || user.last_name.indexOf(inputPeopleName) !== -1) {
          searchResult.push(user);
          return (
            this.setState({
              searchPeopleResultList: searchResult
            })
          );
        }
        return null;
      });
    } else {
      this.setState({
        isSearching: false,
        searchPeopleResultList: [],
        searchPeopleName: ""
      });
    }
  }

  skipSubChatInvite = () => {
    const {actions, currentUserId} = this.props;
    actions.setCreating(false);
    actions.resetUserListWithOnlyThisUser([currentUserId]);
  }

  renderUserList = () => {
    const {users, admins, tas, actions} = this.props;

    if (!users || !admins || !tas) {
      return <img styleName="invite-box-loading" src="img/ring.gif" alt="loading users"/>;
    } else {
      return (
        <div>
          {
            this.state.subchatUserList.toList().map((user, index) => {
              const checkboxState = this.state.checkboxesState.get(user.id);
              return (
                <SubChatParentUserList
                    key={user.id}
                    user={user}
                    isAdmin={admins.has(user.id)}
                    isTA={tas.has(user.id)}
                    openUserPopup={actions.openUserProfile}
                    checkboxState={checkboxState}
                    changeCheckState={this.onChangeCheckState}
                />
              );
            })
          }
        </div>
      );
    }
  }

  renderSearchPeopleResultList = () => {
    const {admins, tas, actions} = this.props;

    if (!this.state.searchPeopleResultList
    || (this.state.searchPeopleResultList && this.state.searchPeopleResultList.length === 0)) {
      return (
        <div>
          No search Result!
        </div>
      );
    } else {
      return (
        <div>
          {
            this.state.searchPeopleResultList.map((user, index) => {
              const checkboxState = this.state.checkboxesState.get(user.id);
              return (
                <SubChatParentUserList
                    key={user.id}
                    user={user}
                    isAdmin={admins.has(user.id)}
                    isTA={tas.has(user.id)}
                    openUserPopup={actions.openUserProfile}
                    checkboxState={checkboxState}
                    changeCheckState={this.onChangeCheckState}
                />
              );
            })
          }
        </div>
      );
    }
  }

  render() {
    return (
      <div styleName="subchat_setup">
        <div styleName="subchat-invite-skip-div">
          <button
              styleName="subchat-setup-done-button"
              onClick={this.inviteUserToThisSubChat}
          >
            Invite
          </button>
          <div
            styleName="subchat-skip-button"
            onClick={this.skipSubChatInvite}
          >
            skip
          </div>
        </div>
        <div styleName="invite-all-selection">
          <p styleName="invite-all-selection-hint">Select everyone</p>
          <input type="checkbox"
              styleName="invite-all-checkbox"
              onChange={this.changeInviteAllOption}
              checked={this.state.ifInviteAllUsers}
          />
        </div>
        <div styleName="input-search-people-container">
          <img styleName="search-input-icon" src="img/left_panel/search.svg" alt="search"/>
          <input
              type="text"
              placeholder="Search People"
              styleName="input-search-people"
              onChange={this.onSubchatSearchPeople}
          />
        </div>
        <div styleName="parent-user-container">
          {!this.state.isSearching && this.renderUserList()}
          {this.state.isSearching && this.renderSearchPeopleResultList()}
        </div>
      </div>
    );
  }
}
