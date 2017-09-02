// @flow

export const toggleChatCreationDialog = () => ({type: "TOGGLE_CHAT_CREATION_DIALOG"});

export const toggleChatCreationPending = () => ({type: "TOGGLE_CHAT_CREATION_PENDING"});

export const toggleClassCreationPending = () => ({type: "TOGGLE_CLASS_CREATION_PENDING"});

export const changeNewChatName = (name: string) => ({type: "CHANGE_NEW_CHAT_NAME", name});

export const changeNewClassName = (name: string) => ({type: "CHANGE_NEW_CLASS_NAME", name});

export const changeNewClassCode = (classCode: string) =>
  ({type: "CHANGE_NEW_CLASS_CODE", classCode});

export const changeChatFilter = (chatFilter: string) => ({type: "CHANGE_CHAT_FILTER", chatFilter});

export const toggleNewChatPrivacy = () => ({type: "TOGGLE_NEW_CHAT_PRIVACY"});

// actions concerning User Dropdown Menu
export const toggleUserDropDownMenu = (value) => ({type: "TOGGLE_USER_DROP_DOWN_MENU", value});

export const setUserDropDownMenuState = (setting: (string|boolean)) =>
  ({type: "USER_DROP_DOWN_MENU_STATE_CHANGE", setting});

export const resetClassInformation = () => ({type: "RESET_CLASS_INFORMATION"});

export const changeFirstTimeLoadingChats = () => ({type: "CHANGE_FIRST_TIME_LOADING_CHATS"});

export const changeFirstTimeLoadingClasses = () => ({type: "CHANGE_FIRST_TIME_LOADING_CLASSES"});

export const updateUnreadMessages = (newUnreadList) => ({
  type: "UPDATE_UNREAD_MESSAGES",
  newUnreadList
});

export const startSearchFunction = (isSearching: boolean) => ({
  type: "START_SEARCH_FUNCTION", isSearching
});

export const searchChatByName = (chatName:string) => ({
  type: "SEARCH_CHAT_BY_NAME",
  chatName
});

export const searchNewChatByName = (newChatName:string) => ({
  type: "SEARCH_NEW_CHAT_BY_NAME",
  newChatName
});

export const searchPeopleByName = (peopleName:string) => ({
  type: "SEARCH_PEOPLE_BY_NAME",
  peopleName
});

export const saveSearchChatResultAndDisplay = (searchChatResultList: array) => ({
  type: "SAVE_SEARCH_CHAT_RESULT_AND_DISPLAY",
  searchChatResultList
});

export const saveSearchNewChatResultAndDisplay = (searchNewChatResultList: array) => ({
  type: "SAVE_SEARCH_NEW_CHAT_RESULT_AND_DISPLAY",
  searchNewChatResultList
});

export const saveSearchPeopleResultAndDisplay = (searchPeopleResultList: array) => ({
  type: "SAVE_SEARCH_PEOPLE_RESULT_AND_DISPLAY",
  searchPeopleResultList
});

export const changeIfShowingClasses = (boolState) => ({
  type: "CHANGE_IF_SHOWING_CLASSES",
  boolState
});

export const updateTotalClassesNumber = (classesTotalNum) =>
  ({type: "UPDATE_TOTAL_CLASSES_NUMBER", classesTotalNum});

export const updateTotalChatsNumber = (chatsTotalNum) =>
  ({type: "UPDATE_TOTAL_CHATS_NUMBER", chatsTotalNum});

export const changeSearchMode = (searchMode) => ({type: "CHANGE_SEARCH_MODE", searchMode});

export const resetSearchChatResultAndDisplay = () => ({
  type: "RESET_SEARCH_CHAT_RESULT_AND_DISPLAY"
});

export const resetSearchNewChatResultAndDisplay = () => ({
  type: "RESET_SEARCH_NEW_CHAT_RESULT_AND_DISPLAY"
});

export const resetSearchPeopleResultAndDisplay = () => ({
  type: "RESET_SEARCH_PEOPLE_RESULT_AND_DISPLAY"
});

export const setIfLeftPanelMakingSearchRequest = (boolState) => ({
  type: "SET_IF_LEFT_PANEL_MAKING_SEARCH_REQUEST", boolState
});

export const loadThisChatOrClassInTheLeftPanel = (id, ifClass) => ({
  type: "LOAD_THIS_CHAT_OR_CLASS_IN_THE_LEFT_PANEL", id, ifClass
});

export const joinNewChatOrClass = (chatId) => ({
  type: "JOIN_NEW_CHAT_OR_CLASS", chatId
});

export const loadMoreChatsMine = () => ({type: "LOAD_MORE_CHATS_MINE"});

export const loadMoreChatsNew = () => ({type: "LOAD_MORE_CHATS_NEW"});

export const loadMorePeople = () => ({type: "LOAD_MORE_PEOPLE"});

export const changeIfChatsTabIsReady = (boolState) =>
  ({type: "CHANGE_IF_CHATS_TAB_IS_READY", boolState});

export const changeIfClassesTabIsReady = (boolState) =>
  ({type: "CHANGE_IF_CLASSES_TAB_IS_READY", boolState});

export const changeHasUnreadChatMessages = (boolState) =>
  ({type: "CHANGE_HAS_UNREAD_CHAT_MESSAGES", boolState});

export const checkForUnreadMessages = (chats: Array) =>
  ({type: "CHECK_FOR_UNREAD_MESSAGES", chats});
