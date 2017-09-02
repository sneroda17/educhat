// @flow

export const requestLoadChat = (id: number, parentId: ?number, onlyParentChatUser: boolean) =>
  ({type: "REQUEST_LOAD_CHAT", id, parentId, onlyParentChatUser});

export const startLoadChat = (id: number, parentId: ?number, isClass: boolean) =>
  ({type: "START_LOAD_CHAT", id, parentId, isClass});

export const loadMessagesPage = (chatId: number, messages: Array<Object>) =>
  ({type: "LOAD_MESSAGES_PAGE", chatId, messages});

export const requestPageMessages = () => ({type: "REQUEST_PAGE_MESSAGES"});

export const sendMessage = (text: string) => ({type: "SEND_MESSAGE", text});

export const addPendingMessage = (id: string, message: Object) =>
  ({type: "ADD_PENDING_MESSAGE", id, message});

export const confirmPendingMessage = (id: string, message: Object) =>
  ({type: "CONFIRM_PENDING_MESSAGE", id, message});

export const cancelPendingMessage = (id: string) => ({type: "CANCEL_PENDING_MESSAGE", id});

export const receiveMessage = (message: Object) => ({type: "RECEIVE_MESSAGE", message});

export const requestLoadComments = (messageId: number, pageNumber) =>
  ({type: "REQUEST_LOAD_COMMENTS", messageId, pageNumber});

export const loadComments = (chatId: number, messageId: number, comments, pageNumber) =>
  ({type: "LOAD_COMMENTS", chatId, messageId, comments, pageNumber});

export const sendFile = (file: File, title: string, extension: string, text: string,
  isQuestion: boolean) =>
  ({type: "SEND_FILE", file, title, extension, text, isQuestion});

export const sendComment = (messageId: number, text: string) =>
  ({type: "SEND_COMMENT", messageId, text});

export const sendFileComment = (parentId, file, title, extension, text) =>
  ({type: "SEND_FILE_COMMENT", parentId, file, title, extension, text});

export const addPendingComment = (messageId: number, commentId: number, comment: Object) =>
  ({type: "ADD_PENDING_COMMENT", messageId, commentId, comment});

export const confirmPendingComment = (messageId: number, commentId: number, comment: Object) =>
  ({type: "CONFIRM_PENDING_COMMENT", messageId, commentId, comment});

export const cancelPendingComment = (messageId, commentId) =>
  ({type: "CANCEL_PENDING_COMMENT", messageId, commentId});

export const receiveComment = (comment: Object) => ({type: "RECEIVE_COMMENT", comment});

export const loadResourcesPage = (chatId: number, resources: Array<Object>) =>
  ({type: "LOAD_RESOURCES_PAGE", chatId, resources});

export const requestPageResources = () => ({type: "REQUEST_PAGE_RESOURCES"});

export const addResource = (message: Object) => ({type: "ADD_RESOURCE", message});

export const loadUsersPage = (chatId: number, users: Array<number>) =>
  ({type: "LOAD_USERS_PAGE", chatId, users});

export const requestPageUsers = () => ({type: "REQUEST_PAGE_USERS"});

export const requestLoadSubchats = () => ({type: "REQUEST_LOAD_SUBCHATS"});

export const loadAdmins = (chatId: number, admins: Iterable<number>) =>
  ({type: "LOAD_ADMINS", chatId, admins});

export const loadTas = (chatId: number, tas: Iterable<number>) => ({type: "LOAD_TAS", chatId, tas});

export const setFilePreview = (data: Object) => ({type: "SET_FILE_PREVIEW", data});

export const setParentComment = (parentComment: Object) =>
  ({type: "SET_PARENT_COMMENT", parentComment});

export const invite = (users) => ({type: "INVITE", users});

export const activateBot = () => ({type: "ACTIVATE_BOT"});

export const changeIfExistsUnsentFile = (hasUnsentFile: boolean) =>
  ({type: "CHANGE_IF_EXISTS_UNSENT_FILE", hasUnsentFile});

export const changeIfAllFilesLoaded = (allFilesLoaded: boolean) =>
  ({type: "CHANGE_IF_ALL_FILES_LOADED", allFilesLoaded});

export const changeIfAllSubchatsLoaded = (allSubchatsLoaded:boolean) =>
  ({type: "CHANGE_IF_ALL_SUBCHATS_LOADED", allSubchatsLoaded});

export const allMessagesLoaded = (allMessagesLoaded: boolean) =>
  ({type: "ALL_MESSAGES_HAVE_BEEN_LOADED"});

export const uploadChatPicture = (picture, name) =>
  ({type: "UPLOAD_CHAT_PICTURE", picture, name});

export const startUploadingChatPicture = () =>
  ({type: "START_UPLOADING_CHAT_PICTURE"});

export const finishedUploadChatPicture = (picture) =>
  ({type: "FINISHED_UPLOAD_CHAT_PICTURE", picture});

export const changeFirstTimeLoadingMessages = (isFirstTimeLoadingMessages: boolean) =>
  ({type: "CHANGE_FIRST_TIME_LOADING_MESSAGES"});

export const inviteNewFromParent = (inviteNewFromParent: boolean) =>
  ({type: "CHECK_INVITE_NEW", inviteNewFromParent});

export const confirmIsBotSubChat = () => ({type: "CONFIRM_IS_BOT_SUBCHAT"});

export const deleteUser = (userId) => ({type: "DELETE_USER", userId});

export const toggleNotifications = (userId, chatId, boolean) =>
  ({type: "TOGGLE_NOTIFICATIONS", userId, chatId, boolean});

export const toggleAddNewUserFromParent = (chatId, boolean) =>
    ({type: "TOGGLE_ADD_USER_FROM_PARENT", chatId, boolean});

export const togglePrivacy = (chatId, boolean) =>
  ({type: "TOGGLE_PRIVACY", chatId, boolean});

export const startLoadChatNotification = () => ({type: "START_LOAD_CHAT_NOTIFICATION"});

export const startLoadChatPrivacy = () => ({type: "START_LOAD_CHAT_PRIVACY"});

export const loadChatNotification = (isMuted) =>
  ({type: "LOAD_CHAT_NOTIFICATION", isMuted});

export const loadChatPrivacy = (isSearchable) =>
  ({type: "LOAD_CHAT_PRIVACY", isSearchable});

export const assignAdminError = (errorName: string) => ({type: "ASSIGN_ADMIN_ERROR", errorName});

export const promoteUserType = (newUserType, userId, chatId) => ({type: "PROMOTE_USER_TYPE",
  newUserType, userId, chatId});

export const deleteUserType = (deleteUserType, userId, chatId) => ({type: "DELETE_USER_TYPE",
  deleteUserType, userId, chatId});

export const starMessage = (starredMessage: Object) => ({type: "STAR_MESSAGE", starredMessage});

export const unstarMessage = (starredMessage: Object) => ({type: "UNSTAR_MESSAGE", starredMessage});

export const markAsBestAnswer = (bestAnswer: Object, boolState, answerList, messageId) =>
  ({type: "MARK_AS_BEST_ANSWER", bestAnswer, boolState, answerList, messageId});

export const confirmIsAdminChat = () => ({type: "CONFIRM_IS_ADMIN_CHAT"});

export const clearIsAdminChat = () => ({type: "CLEAR_IS_ADMIN_CHAT"});

export const loadCommentsToMessage = (id, comments) =>
   ({type: "LOAD_COMMENTS_TO_MESSAGE", id, comments});

export const removeUser = (chatId, userId) =>
  ({type: "REMOVE_USER", chatId, userId});

export const updateCommentsListAnswer = (newCommentsList, messageId: number) =>
  ({type: "UPDATE_COMMENTS_LIST_ANSWER", newCommentsList, messageId});

export const updateCommentsList = (newCommentsList) =>
  ({type: "UPDATE_COMMENTS_LIST", newCommentsList});

export const isLoadingComments = (isLoading) => ({type: "IS_LOADING_COMMENTS", isLoading});

export const forwardQuestionToTheBot = (activeChatId) => ({type: "FORWARD_QUESTION", activeChatId});

export const updateBestAnswer = (newAnswersList, messageId: number) =>
  ({type: "UPDATE_BEST_ANSWER", newAnswersList, messageId});

export const updateIsResolved = (messageId) =>
  ({type: "UPDATE_IS_RESOLVED", messageId});

export const resetUserListWithOnlyThisUser = (thisUser) =>
  ({type: "RESET_USER_LIST_WITH_ONLY_THIS_USER", thisUser});

export const changeShowSeeMoreButton = (showSeeMoreButton:boolean) =>
  ({type: "CHANGE_SHOW_SEE_MORE_BUTTON", showSeeMoreButton});
