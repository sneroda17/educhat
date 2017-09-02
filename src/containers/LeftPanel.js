// @flow

import React, {PureComponent, PropTypes} from "react";
import ImmutablePropTypes from "react-immutable-proptypes";
import connect from "../helpers/connect-with-action-types";
import ChatList from "../components/ChatList";
import ChatCreationDialog from "../components/ChatCreationDialog";
import UserDropDownMenu from "../components/UserDropDownMenu";
import CreateChatorClass from "../components/CreateChatorClass";
import LeftPanelChatClassSwitchToggle from "../components/LeftPanelChatClassSwitchToggle";
import LeftPanelSearchSwitchToggle from "../components/LeftPanelSearchSwitchToggle";
import SearchChatMine from "../components/SearchChatMine";
import SearchChatNew from "../components/SearchChatNew";
import SearchPeople from "../components/SearchPeople";
import AccountSettingPanel from "../components/AccountSettingPanel";
import UserDropDownArrow from "../components/UserDropDownArrow";
import ClassChatCreationButton from "../components/ClassChatCreationButton";
import {
  requestLoadChats,
  loadMoreChats,
  createBotSubchat,
  createOneToOneChat
} from "../actions/chats";
import {requestLoadClasses, loadMoreClasses} from "../actions/classes";
import {requestLoadChat, requestLoadSubchats} from "../actions/active-chat";
import {setCreating, getMyInfo} from "../actions/current-user";
import {toggleBotPanel, openUserProfile} from "../actions/ui/main-panel";
import {
  setUserDropDownMenuState,
  changeIfShowingClasses,
  changeSearchMode,
  loadThisChatOrClassInTheLeftPanel,
  resetClassInformation,
  searchChatByName,
  searchNewChatByName,
  searchPeopleByName,
  startSearchFunction,
  toggleChatCreationDialog,
  joinNewChatOrClass,
  toggleUserDropDownMenu,
  loadMoreChatsMine,
  loadMoreChatsNew,
  loadMorePeople
} from "../actions/ui/left-panel";
import {toggleRightPanel,
  clearInviteList,
  hideInviteListErrorMessage,
  closeRightPanel
} from "../actions/ui/right-panel";
import styles from "../styles/LeftPanel.css";
import cssModules from "react-css-modules";
import Chat from "../records/chat";
import User from "../records/user";
import Raven from "raven-js";
import {onEnterKey} from "../helpers/events";
import ref from "../helpers/ref";

Raven.config("https://b627a5406363467d933e5a96a58f7866@sentry.io/138274").install();

function scrollToCertainHeightOfContainer(h) {
  const messageScrollWrapper = document.getElementsByClassName("chat-container");
  if (messageScrollWrapper && messageScrollWrapper[0]) messageScrollWrapper[0].scrollTop = h;
}

@connect(state => ({
  chats: state.chats,
  users: state.users,
  chatCreationDialogActive: state.ui.leftPanel.chatCreationDialogActive,
  isCreating: state.currentUser.isCreating,
  activeChatId: state.activeChat.id,
  ifAllSubchatsLoaded: state.activeChat.ifAllSubchatsLoaded,
  changeShowSeeMoreButton: state.activeChat.changeShowSeeMoreButton,
  parentId: state.activeChat.parentId,
  currentUserImage: state.users.get(state.currentUser.id).picture_file.url,
  botPanelActive: state.ui.mainPanel.botPanelActive,
  userDropDownMenuActive: state.ui.leftPanel.userDropDownMenuActive,
  isLoadingMoreChats: state.ui.leftPanel.isLoadingMoreChats,
  userDropDownMenuItemState: state.ui.leftPanel.userDropDownMenuItemState,
  rightPanelActive: state.ui.rightPanel.rightPanelActive,
  inviteUserError: state.ui.rightPanel.inviteUserError,
  currentUserId: state.currentUser.id,
  previousChatHasUnsentFile: state.activeChat.hasUnsentFile,
  firstTimeLoadingChats: state.ui.leftPanel.firstTimeLoadingChats,
  firstTimeLoadingClasses: state.ui.leftPanel.firstTimeLoadingClasses,
  unreadMessages: state.ui.leftPanel.unreadMessages,
  isBotSubChat: state.activeChat.isBotSubChat,
  isShowingClasses: state.ui.leftPanel.isShowingClasses,
  isLeftPanelInSearchingMode: state.ui.leftPanel.isLeftPanelInSearchingMode,
  totalChatsCount: state.ui.leftPanel.totalChatsCount,
  totalClassesCount: state.ui.leftPanel.totalClassesCount,
  isSearching: state.ui.leftPanel.isSearching,
  searchingMode: state.ui.leftPanel.searchingMode,
  searchChatResultList: state.ui.leftPanel.searchChatResultList,
  searchNewChatResultList: state.ui.leftPanel.searchNewChatResultList,
  searchPeopleResultList: state.ui.leftPanel.searchPeopleResultList,
  isLeftPanelMakingSearchRequest: state.ui.leftPanel.isLeftPanelMakingSearchRequest,
  hasUnreadChatMessages: state.ui.leftPanel.hasUnreadChatMessages
}), {
  requestLoadChats,
  loadMoreClasses,
  requestLoadClasses,
  requestLoadChat,
  requestLoadSubchats,
  loadMoreChats,
  toggleChatCreationDialog,
  setCreating,
  toggleBotPanel,
  toggleUserDropDownMenu,
  setUserDropDownMenuState,
  resetClassInformation,
  toggleRightPanel,
  clearInviteList,
  hideInviteListErrorMessage,
  closeRightPanel,
  openUserProfile,
  createBotSubchat,
  searchChatByName,
  searchNewChatByName,
  searchPeopleByName,
  startSearchFunction,
  changeIfShowingClasses,
  changeSearchMode,
  loadThisChatOrClassInTheLeftPanel,
  joinNewChatOrClass,
  createOneToOneChat,
  loadMoreChatsMine,
  loadMoreChatsNew,
  loadMorePeople,
  getMyInfo
})
@cssModules(styles)
export default class LeftPanel extends PureComponent {

  constructor() {
    super();
    this.openChat = this.openChat.bind(this);
  }

  static propTypes = {
    chats: ImmutablePropTypes.mapOf(PropTypes.instanceOf(Chat), PropTypes.number),
    users: ImmutablePropTypes.mapOf(PropTypes.instanceOf(User), PropTypes.number),
    chatCreationDialogActive: PropTypes.bool.isRequired,
    isCreating: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    activeChatId: PropTypes.number,
    ifAllSubchatsLoaded: PropTypes.bool.isRequired,
    changeShowSeeMoreButton: PropTypes.bool.isRequired,
    parentId: PropTypes.number,
    currentUserImage: PropTypes.string,
    botPanelActive: PropTypes.bool.isRequired,
    userDropDownMenuActive: PropTypes.bool.isRequired,
    isLoadingMoreChats: PropTypes.bool.isRequired,
    userDropDownMenuItemState: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    rightPanelActive: PropTypes.bool.isRequired,
    isShowingClasses: PropTypes.bool.isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchingMode: PropTypes.string.isRequired,
    isLeftPanelMakingSearchRequest: PropTypes.bool.isRequired,
    hasUnreadChatMessages: PropTypes.bool.isRequired
    // currentUserId: PropTypes.number
  };

  static defaultProps = {
    chats: null,
    users: null,
    parentId: null,
    activeChatId: 13,
    currentUserImage: null,
    message: "not at bottom"
  };

  state = {
    searchInput: "",
    currentClassesListScrollHeight: 0,
    currentChatsListScrollHeight: 0
  };

  searchBox;

  componentWillMount() {
    const {actions} = this.props;
    actions.requestLoadClasses();
    actions.requestLoadChats();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isShowingClasses !== this.props.isShowingClasses) {
      if (this.props.isShowingClasses) {
        scrollToCertainHeightOfContainer(this.state.currentClassesListScrollHeight);
      } else {
        scrollToCertainHeightOfContainer(this.state.currentChatsListScrollHeight);
      }
    }

    if (prevProps.searchingMode !== this.props.searchingMode) {
      this.getSearchResult(this.state.searchInput);
    }

    if (prevProps.isSearching !== this.props.isSearching) {
      this.setState({searchInput: ""});
    }
  }

  findUserFirstNameById = (id) => this.props.users.get(id) && this.props.users.get(id).first_name;

  confirmToLossCurrentProgress = () =>
    confirm(// eslint-disable-line no-alert
      "Current chat input contains unsent file! Switching to new chat you will lose the progress.");


  openChat = (chatId, parentId) => {
    const {previousChatHasUnsentFile, actions} = this.props;
    if(chatId !== this.props.activeChatId) {
      /*
      If previous chat has unsent file and the user try to switch to another chat,
      he will be confirmed that the current progress will be lost.
      */
      if (!previousChatHasUnsentFile || this.confirmToLossCurrentProgress()) {
        actions.requestLoadChat(chatId, parentId, false);
      }
    }
  }

  loadMoreChats = () => {
    const {actions} = this.props;
    actions.loadMoreChats();
  }

  toggleClassCreation = () => {
    const {actions, isCreating} = this.props;

    actions.toggleChatCreationDialog(false);
    if (isCreating !== "class") {
      actions.resetClassInformation();
      actions.setCreating("class");
    } else {
      actions.setCreating(false);
    }
  }

  toggleChatCreation = () => {
    const {actions, isCreating} = this.props;

    actions.toggleChatCreationDialog(false);
    if (isCreating !== "chat") {
      actions.setCreating("chat");
    } else{
      actions.setCreating(false);
    }
  }

  toggleSubchatCreation = () => {
    const {actions, isCreating, botPanelActive, rightPanelActive} = this.props;

    if (botPanelActive) {
      actions.toggleBotPanel();
    }

    if (isCreating !== "subchat") {
      if (!rightPanelActive) {
        actions.toggleRightPanel();
      }
      actions.setCreating("subchat");
    } else {
      if (rightPanelActive) {
        actions.toggleRightPanel();
      }
      actions.setCreating(false);
    }
  }

  scrollTheLeftPanelDown = (e) => {
    const {actions, isShowingClasses, isSearching, searchingMode} = this.props;
    e.stopPropagation();
    const {isLoadingMoreChats} = this.props;
    if (!isLoadingMoreChats) {
      const d = e.target;
      if (!isSearching) {
        if (isShowingClasses) {
          this.setState({currentClassesListScrollHeight: d.scrollTop});
        } else {
          this.setState({currentChatsListScrollHeight: d.scrollTop});
        }
      }
      const currentPosition = d.scrollTop + d.offsetHeight;
      const button = d.scrollHeight;

      if (currentPosition >= button * 0.8) {
        if (isSearching) {
          if (searchingMode === "mine") {
            actions.loadMoreChatsMine();
          } else if (searchingMode === "new") {
            actions.loadMoreChatsNew();
          } else {
            actions.loadMorePeople();
          }
        } else {
          if (isShowingClasses) actions.loadMoreClasses();
          else actions.loadMoreChats();
        }
      }
    }
  }

  showReportDialog = (e) => {
    Raven.captureException(e);
    Raven.showReportDialog();
  };

  searchChatByName = (chatName) => {
    const {actions} = this.props;
    if (chatName !== "") {
      actions.searchChatByName(chatName);
    }
  };

  searchNewChatByName = (newChatName) => {
    const {actions} = this.props;
    if (newChatName !== "") {
      actions.searchNewChatByName(newChatName);
    }
  };

  searchPeopleByName = (peopleName) => {
    const {actions} = this.props;
    if (peopleName !== "") {
      actions.searchPeopleByName(peopleName);
    }
  };

  startSearchFunction = () => {
    const {actions, isSearching} = this.props;
    if (!isSearching) {
      actions.startSearchFunction(true);
      this.searchBox.focus();
    }
  };

  getSearchInputString = (e) => {
    const inputString = e.target.value;
    this.setState({searchInput: inputString});
    this.getSearchResult(inputString);
  };

  getSearchResult = (input) => {
    if (this.props.isSearching && this.props.searchingMode === "mine") {
      this.searchChatByName(input);
    }
    if (this.props.isSearching && this.props.searchingMode === "new") {
      this.searchNewChatByName(input);
    }
    if (this.props.isSearching && this.props.searchingMode === "people") {
      this.searchPeopleByName(input);
    }
  };

  _changeIfShowingClasses = () => {
    const {actions, isShowingClasses} = this.props;
    actions.changeIfShowingClasses(!isShowingClasses);
  };

  exitSearchMode = () => {
    const {actions} = this.props;
    actions.startSearchFunction(false);
    actions.changeSearchMode("mine");
    this.setState({searchInput: ""});
  };

  clearSearchResult = () => {
    this.setState({searchInput: ""});
    this.searchBox.focus();
  };

  _createOneToOneChat = (userData) => {
    const {actions} = this.props;
    actions.createOneToOneChat(userData);
  };

  showChatsOrClassesList() {
    const {
      actions,
      chats,
      parentId,
      activeChatId,
      ifAllSubchatsLoaded,
      firstTimeLoadingChats,
      firstTimeLoadingClasses,
      rightPanelActive,
      unreadMessages,
      isBotSubChat,
      isShowingClasses,
      totalChatsCount,
      totalClassesCount,
      changeShowSeeMoreButton
    } = this.props;

    if ((isShowingClasses && firstTimeLoadingClasses)
      || (!isShowingClasses && firstTimeLoadingChats)) {
      return (
        <span>
          <div>
            <img src="img/ring.gif" alt="loading chats"/>
          </div>
        </span>
      );
    } else {
      return (
        <span>
          <div
              styleName="chat-container"
              className="chat-container"
              onScroll={this.scrollTheLeftPanelDown}
          >
            <ChatList
                chats={chats}
                isShowingClasses={isShowingClasses}
                totalChatsCount={totalChatsCount}
                totalClassesCount={totalClassesCount}
                unreadMessages={unreadMessages}
                findUserFirstNameById={this.findUserFirstNameById}
                openChat={this.openChat}
                requestLoadSubchats={actions.requestLoadSubchats}
                parentId={parentId}
                activeChatId={activeChatId}
                allSubchatsLoaded={ifAllSubchatsLoaded}
                toggleSubchatCreation={this.toggleSubchatCreation}
                rightPanelActive={rightPanelActive}
                closeRightPanel={actions.closeRightPanel}
                createNewBotSubchat={actions.createBotSubchat}
                isBotSubChat={isBotSubChat}
                showSeeMoreButton={changeShowSeeMoreButton}
            />
          </div>
        </span>
      );
    }
  }

  showSearchSuggestionList() {
    return <span/>;
  }

  _changeSearchMode = (newSearchMode) => {
    const {actions, searchingMode} = this.props;
    if (searchingMode !== newSearchMode) {
      actions.changeSearchMode(newSearchMode);
    }
  }

  switchToThisChatOrClass = (id, ifClass) => {
    const {actions} = this.props;
    actions.loadThisChatOrClassInTheLeftPanel(id, ifClass);
  }

  _joinNewChatOrClass = (chatId) => {
    const {actions} = this.props;
    actions.joinNewChatOrClass(chatId);
  }

  renderLeftPanel() {
    const {
      // actions,
      currentUserImage,
      userDropDownMenuActive,
      chatCreationDialogActive,
      isShowingClasses,
      totalChatsCount,
      totalClassesCount,
      isSearching,
      searchingMode,
      searchChatResultList,
      searchNewChatResultList,
      searchPeopleResultList,
      isLeftPanelMakingSearchRequest,
      hasUnreadChatMessages
    } = this.props;

    const {searchInput} = this.state;

    return (
      <div styleName="left-panel">
        <div styleName="left-panel-header">
          <UserDropDownArrow source={currentUserImage}/>
          {userDropDownMenuActive &&
            <UserDropDownMenu
                toggleProfileCreation={this.toggleProfileCreation}
                toggleSettingsCreation={this.toggleSettingsCreation}
                toggleReportAProblemCreation={this.toggleReportAProblemCreation}
                // toggleLogOutCreation={this.toggleLogOutCreation}
                showReportDialog={this.showReportDialog}
            />
          }
          <ClassChatCreationButton/>
          {chatCreationDialogActive &&
            <ChatCreationDialog
                toggleClassCreation={this.toggleClassCreation}
                toggleChatCreation={this.toggleChatCreation}
            />
          }
        </div>
        <div styleName="left-panel-search-box-container">
          <div styleName={isSearching ?
            "chat-search-input-container--active" : "chat-search-input-container"}
              onClick={this.startSearchFunction}
              onKeyDown={onEnterKey(this.startSearchFunction)}
              role="button"
              tabIndex="0"
          >
            {isSearching
              ?
                <img
                    styleName="exit-search-mode-back-arrow"
                    src="img/left_panel/left-arrow.svg"
                    alt="search"
                    role="button"
                    tabIndex="0"
                    onClick={this.exitSearchMode}
                    onKeyDown={onEnterKey(this.exitSearchMode)}
                />
              : <img styleName="search-input-icon" src="img/left_panel/search.svg" alt="search"/>
            }
            <input
                type="text"
                placeholder="Search for Classes, Chats & People"
                onChange={this.getSearchInputString}
                value={searchInput}
                ref={ref(this, "searchBox")}
            />
            {searchInput !== "" &&
              <img
                  styleName="search-input-clear-icon"
                  src="img/left_panel/cancel-icon.svg"
                  alt="clear"
                  role="button"
                  tabIndex="0"
                  onClick={this.clearSearchResult}
                  onKeyDown={onEnterKey(this.clearSearchResult)}
              />
            }
          </div>
          {
            isSearching
              ?
                <LeftPanelSearchSwitchToggle
                    searchingMode={searchingMode}
                    changeSearchMode={this._changeSearchMode}
                />
              :
                <LeftPanelChatClassSwitchToggle
                    totalChatsCount={totalChatsCount}
                    totalClassesCount={totalClassesCount}
                    isShowingClasses={isShowingClasses}
                    changeIfShowingClasses={this._changeIfShowingClasses}
                    hasUnreadChatMessages={hasUnreadChatMessages}
                />
          }
        </div>
        {isSearching ? this.showSearchSuggestionList() : this.showChatsOrClassesList()}
        {isSearching && searchingMode === "mine" &&
          <SearchChatMine
              searchKeyword={searchInput}
              isLeftPanelMakingSearchRequest={isLeftPanelMakingSearchRequest}
              searchChatsMineResult={searchChatResultList}
              findUserFirstNameById={this.findUserFirstNameById}
              switchToThisChatOrClass={this.switchToThisChatOrClass}
              scrollTheLeftPanelDown={this.scrollTheLeftPanelDown}
          />
        }
        {isSearching && searchingMode === "new" &&
          <SearchChatNew
              searchKeyword={searchInput}
              isLeftPanelMakingSearchRequest={isLeftPanelMakingSearchRequest}
              searchNewChatResultList={searchNewChatResultList}
              joinNewChatOrClass={this._joinNewChatOrClass}
              scrollTheLeftPanelDown={this.scrollTheLeftPanelDown}
          />
        }
        {isSearching && searchingMode === "people" &&
          <SearchPeople
              searchKeyword={searchInput}
              isLeftPanelMakingSearchRequest={isLeftPanelMakingSearchRequest}
              searchPeopleResultList={searchPeopleResultList}
              createOneToOneChat={this._createOneToOneChat}
              scrollTheLeftPanelDown={this.scrollTheLeftPanelDown}
          />
        }
      </div>
    );
  }

  /**
   * Toggle user dropdown menu item creation
   * Considering combine these toggle functions into one with one pass-in parameter
   */
  toggleProfileCreation = () => {
    const {actions} = this.props;

    actions.toggleUserDropDownMenu(false);
    actions.getMyInfo();
  }

  openProfilePopup = (userId) => {
    const {actions} = this.props;
    actions.openUserProfile(userId);
  };

  toggleSettingsCreation = () => {
    const {actions, userDropDownMenuItemState} = this.props;
    actions.toggleUserDropDownMenu(false);
    if (userDropDownMenuItemState !== "settings") {
      actions.setUserDropDownMenuState("settings");
    } else {
      actions.setUserDropDownMenuState(false);
    }
  };

  toggleReportAProblemCreation = () => {
    const {actions, userDropDownMenuItemState} = this.props;

    actions.toggleUserDropDownMenu(false);
    if (userDropDownMenuItemState !== "report") {
      actions.setUserDropDownMenuState("report");
    } else {
      actions.setUserDropDownMenuState(false);
    }
  };

  /**
   * When user click the log out button, any component's state should be reset,
   *  such as any dropdown menu.
   */
  // toggleLogOutCreation = () => {
  //   const {actions, userDropDownMenuActive, chatCreationDialogActive} = this.props;
  //
  //   if (userDropDownMenuActive) {
  //     actions.toggleUserDropDownMenu(false);
  //   }
  //   if (chatCreationDialogActive !== false) {
  //     actions.toggleChatCreationDialog(false);
  //   }
  //   actions.closeRightPanel();
  //   actions.logout();
  // }

  // Rander left panel or chat/class creation panel or UserDropdownMenuItem
  // Fall through to check each condition
  renderLeftPanelMenu() {
    const {isCreating, userDropDownMenuItemState} = this.props;

    if (isCreating === "class") {
      return <CreateChatorClass chatOrClass="Class" toggle={this.toggleClassCreation}/>;
    } else if(isCreating === "chat") {
      return <CreateChatorClass chatOrClass="Chat" toggle={this.toggleChatCreation}/>;
    }

    switch (userDropDownMenuItemState) {
      case "profile":
        return this.renderLeftPanel();
      case "settings":
        return (
          <AccountSettingPanel toggle={this.toggleSettingsCreation}/>
        );
      case "report":
        return this.renderLeftPanel();
      default:
        break;
    }
    // fall through to the end means that the left panel should be rerendered instead
    return this.renderLeftPanel();
  }

  render() {
    return (
      <div styleName="left-panel-container">
        {this.renderLeftPanelMenu()}
      </div>
    );
  }
}
