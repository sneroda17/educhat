// @flow

import Immutable from "immutable";
import Chat from "../../records/chat";
import User from "../../records/user";

const LeftPanelState = Immutable.Record({
  chatCreationDialogActive: false,
  chatCreationPending: false,
  classCreationPending: false,
  newChatName: "",
  newChatIsPrivate: true,
  chatFilter: "",
  newClassName: "",
  newClassCode: "",
  userDropDownMenuActive: false,
  // Should be one of the menu items, or false
  userDropDownMenuItemState: false,
  isLoadingMoreChats: false,
  isLoadingMoreClasses: false,
  firstTimeLoadingChats: true,
  firstTimeLoadingClasses: true,
  successfulUserInfoUpdate: false,
  isShowingClasses: true,
  totalChatsCount: 0,
  totalClassesCount: 0,
  totalChatsMine: 0,
  totalChatsNew: 0,
  totalPeople: 0,
  isSearching: false,
  searchChatResultList: new Immutable.OrderedMap(),
  searchNewChatResultList: new Immutable.OrderedMap(),
  searchPeopleResultList: new Immutable.OrderedMap(),
  searchingMode: "mine",
  isLeftPanelMakingSearchRequest: false,
  isClassesTabReady: false,
  isChatsTabReady: false,
  hasUnreadChatMessages: false
});

export default function(state = new LeftPanelState(), action: Object) {
  switch (action.type) {
    case "RESET_CLASS_NAME":
      return state.set("newClassName", "");
    case "RESET_CLASS_CODE":
      return state.set("newClassCode", "");
    case "TOGGLE_CHAT_CREATION_DIALOG":
      return state.set("chatCreationDialogActive",
        action.value !== undefined ? action.value : !state.chatCreationDialogActive);
    case "TOGGLE_USER_DROP_DOWN_MENU":
      return state.set("userDropDownMenuActive",
        action.value !== undefined ? action.value : !state.userDropDownMenuActive);
    case "USER_DROP_DOWN_MENU_STATE_CHANGE":
      return state.set("userDropDownMenuItemState", action.setting);
    case "TOGGLE_CHAT_CREATION_PENDING":
      return state.set("chatCreationPending", !state.chatCreationPending);
    case "TOGGLE_CLASS_CREATION_PENDING":
      return state.set("classCreationPending", !state.classCreationPending);
    case "CHANGE_NEW_CHAT_NAME":
      return state.set("newChatName", action.name);
    case "CHANGE_NEW_CLASS_NAME":
      return state.set("newClassName", action.name);
    case "CHANGE_NEW_CLASS_CODE":
      return state.set("newClassCode", action.classCode);
    case "CHANGE_CHAT_FILTER":
      return state.set("chatFilter", action.chatFilter);
    case "TOGGLE_NEW_CHAT_PRIVACY":
      return state.set("newChatIsPrivate", !state.newChatIsPrivate);
    case "TOGGLE_LOADING_CHATS_STATE":
      return state.set("isLoadingMoreChats", action.isLoading);
    case "CHANGE_FIRST_TIME_LOADING_CHATS":
      return state.set("firstTimeLoadingChats", false);
    case "CHANGE_FIRST_TIME_LOADING_CLASSES":
      return state.set("firstTimeLoadingClasses", false);
    case "USER_INFO_UPDATE":
      return state.set("successfulUserInfoUpdate", action);
    case "CHANGE_IF_SHOWING_CLASSES":
      return state.set("isShowingClasses", action.boolState);
    case "UPDATE_TOTAL_CHATS_NUMBER":
      return state.set("totalChatsCount", action.chatsTotalNum);
    case "UPDATE_TOTAL_CLASSES_NUMBER":
      return state.set("totalClassesCount", action.classesTotalNum);
    case "CHANGE_SEARCH_MODE":
      return state.set("searchingMode", action.searchMode);
    case "START_SEARCH_FUNCTION":
      return state.set("isSearching", action.isSearching);
    case "RESET_SEARCH_CHAT_RESULT_AND_DISPLAY":
      return state.set("searchChatResultList", new Immutable.OrderedMap());
    case "RESET_SEARCH_NEW_CHAT_RESULT_AND_DISPLAY":
      return state.set("searchNewChatResultList", new Immutable.OrderedMap());
    case "RESET_SEARCH_PEOPLE_RESULT_AND_DISPLAY":
      return state.set("searchPeopleResultList", new Immutable.OrderedMap());
    case "SAVE_SEARCH_CHAT_RESULT_AND_DISPLAY":
      return state.set("searchChatResultList",
        state.searchChatResultList.mergeDeep(
          action.searchChatResultList.map(chat => [chat.id, new Chat(chat)]))
      );
    case "SAVE_SEARCH_NEW_CHAT_RESULT_AND_DISPLAY":
      return state.set("searchNewChatResultList",
        state.searchNewChatResultList.mergeDeep(
          action.searchNewChatResultList.map(newChat => [newChat.id, new Chat(newChat)]))
      );
    case "SAVE_SEARCH_PEOPLE_RESULT_AND_DISPLAY":
      return state.set("searchPeopleResultList",
        state.searchPeopleResultList.mergeDeep(
          action.searchPeopleResultList.map(people => [people.id, new User(people)]))
      );
    case "SET_IF_LEFT_PANEL_MAKING_SEARCH_REQUEST":
      return state.set("isLeftPanelMakingSearchRequest", action.boolState);
    case "CHANGE_IF_CHATS_TAB_IS_READY":
      return state.set("isChatsTabReady", action.boolState);
    case "CHANGE_IF_CLASSES_TAB_IS_READY":
      return state.set("isClassesTabReady", action.boolState);
    case "CHANGE_HAS_UNREAD_CHAT_MESSAGES":
      return state.set("hasUnreadChatMessages", action.boolState);
    default:
      return state;
  }
}
