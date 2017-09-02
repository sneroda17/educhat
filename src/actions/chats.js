// @flow

export const requestLoadChats = () => ({type: "REQUEST_LOAD_CHATS"});

export const loadChats = (chats: Array<Object>) => ({type: "LOAD_CHATS", chats});

export const loadSubchatsOfChat = (parentId: number, subchats: Array<Object>) =>
  ({type: "LOAD_SUBCHATS_OF_CHAT", parentId, subchats});

export const addChat = (chat: Object) => ({type: "ADD_CHAT", chat});

export const createChat = (name: string, ifSearchable: boolean, pictureObject: number) =>
  ({type: "CREATE_CHAT", name, ifSearchable, pictureObject});

export const createSubchat = (
  name: string,
  parentId: number,
  ifSearchable: boolean,
  isSubchatAnonymous: boolean,
  ifInviteNewFromParent: boolean
) =>
  ({
    type: "CREATE_SUBCHAT", name, parentId, ifSearchable,
    isSubchatAnonymous, ifInviteNewFromParent
  });

export const createBotSubchat = (parentId) =>
  ({type: "CREATE_BOT_SUBCHAT", parentId});

export const updateChat = (id: number, updates: Object) => ({type: "UPDATE_CHAT", id, updates});

export const leaveChat = (chatId, userId, parentId) =>
  ({type: "LEAVE_CHAT", chatId, userId, parentId});

export const deleteChat = (chatId) => ({type: "DELETE_CHAT", chatId});

export const startDeleteChat = (chatId, parentId) =>
  ({type: "START_DELETE_CHAT", chatId, parentId});

export const changeChatDetails = (id: number, name: string, desc: string) =>
  ({type: "CHANGE_CHAT_DETAILS", id, name, desc});

export const changeChatInviteAll = (id: number, ifInviteAll: Boolean) =>
  ({type: "CHANGE_CHAT_INVITE_ALL", id, ifInviteAll});

export const versionDetails = () => ({type: "VERSION_DETAILS"});

export const createOneToOneChat = (otherUser) => ({type: "CREATE_ONE_TO_ONE_CHAT", otherUser});

export const loadMoreChats = () => ({type: "LOAD_MORE_CHATS"});

export const toggleLoadingChatsState =
  (isLoading: boolean) => ({type: "TOGGLE_LOADING_CHATS_STATE", isLoading});

export const resetChatUnreadMessagesCount = (chatId) =>
  ({type: "RESET_CHAT_UNREAD_MESSAGES_COUNT", chatId});

export const increaseUnreadMessagesCount = (chatId) => ({type: "INCREASE_UNREAD_MESSAGES_COUNT",
  chatId});

export const updateMostRecentMessage = (chatId, newMessage) => ({type: "UPDATE_LAST_MESSAGE",
  chatId, newMessage});

export const requestMoveChatToTop = (chatId) => ({type: "REQUEST_MOVE_CHAT", chatId});

export const moveChatToTopOfTheList = (chat) => ({type: "MOVE_CHAT_TO_TOP_OF_THE_LIST", chat});
