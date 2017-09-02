export const getCurrentUser = state => state.currentUser;

export const getActiveChat = state => state.activeChat;

export const getChat = id => state => state.chats.get(id);

export const getProfileUserData = state => state.ui.mainPanel.userProfilePopupData;

// export const getMessageCount = state =>
//   state.activeChat.messages ? state.activeChat.messages.size : 0;

export const getIsFirstTimeLoadingMessages = state =>
  state.activeChat.isFirstTimeLoadingMessages;

export const getUnreadMessages = state => state.ui.leftPanel.unreadMessages;

export const getCurrentMessageOffset = state => state.ui.mainPanel.currentChatMessageOffset;

export const getQuestionModeActive = state => state.ui.mainPanel.questionModeActive;

export const getIfLeftPanelShowingClasses = state => state.ui.leftPanel.isShowingClasses;

export const getCurrentClassesTotalNumber = state => state.ui.leftPanel.totalClassesCount;

export const getCurrentChatsTotalNumber = state => state.ui.leftPanel.totalChatsCount;

export const getClassOrChatSearchResult = id =>
  state => state.ui.leftPanel.searchChatResultList.get(id);

export const getIfInSearchingMode = state => state.ui.leftPanel.isSearching;

export const getCommentsListFromActiveChat = state => state.activeChat.commentsList;

export const getCurrentMessageCommentOffset = messageId =>
  state => state.activeChat.comments.get(messageId)
    ? state.activeChat.comments.get(messageId).get("confirmed").size : 0;

export const getCurrentMessageComments = messageId =>
  state => state.activeChat.comments.get(messageId).get("confirmed");
