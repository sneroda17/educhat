import {put, call, select, take, fork, takeLatest, takeEvery} from "redux-saga/effects";
import pause from "./pause-saga";
import {
  startLoadChat,
  loadMessagesPage,
  addPendingMessage,
  confirmPendingMessage,
  loadUsersPage,
  loadResourcesPage,
  addResource,
  loadAdmins,
  loadTas,
  loadComments,
  addPendingComment,
  confirmPendingComment,
  cancelPendingMessage,
  cancelPendingComment,
  changeIfAllFilesLoaded,
  changeIfAllSubchatsLoaded,
  allMessagesLoaded,
  startUploadingChatPicture,
  finishedUploadChatPicture,
  confirmIsBotSubChat,
  changeFirstTimeLoadingMessages,
  startLoadChatNotification,
  startLoadChatPrivacy,
  loadChatNotification,
  loadChatPrivacy,
  // markAsBestAnswer,
  // starMessage,
  // unstarMessage,
  confirmIsAdminChat,
  clearIsAdminChat,
  // loadCommentsToMessage,
  updateCommentsList,
  updateCommentsListAnswer,
  isLoadingComments,
  requestLoadComments,
  forwardQuestionToTheBot,
  updateBestAnswer,
  changeShowSeeMoreButton
} from "../actions/active-chat";
import {
  loadSubchatsOfChat,
  resetChatUnreadMessagesCount,
  requestMoveChatToTop
} from "../actions/chats";
import {loadSubchatsOfClass} from "../actions/classes";
import {addUsers} from "../actions/users";
import {setError} from "../actions/errors";
import {checkForUnreadMessages} from "../actions/ui/left-panel";
import {toggleInviteInterface,
  clearInviteList,
  hideInviteListErrorMessage,
  startInvitingUserToChat,
  endInvitingUserToChat,
  closeRightPanel
} from "../actions/ui/right-panel";
import {
  changeCurrentChatMessageOffset,
  changeNewMessageReceived,
  changeQuestionModeActive,
  finishedLoadingEverything,
  startFileUpload,
  endFileUpload,
  tellUserFileUploadIsDone
} from "../actions/ui/main-panel";
import {logout, setCreating, changeCurrentSessionExpired} from "../actions/current-user";
import ecapi, {AUTH_ERROR} from "../ecapi";
import {
  getCurrentUser,
  getActiveChat,
  getChat,
  getIsFirstTimeLoadingMessages,
  getCurrentMessageOffset,
  getQuestionModeActive,
  getCommentsListFromActiveChat,
  getCurrentMessageCommentOffset,
  getCurrentMessageComments
} from "./selectors";
import worker from "./worker";
import {setStorageItem, removeStorageItem} from "../helpers/storage";
import EduchatApi from "educhat_api_alpha";
import {forwardQuestionApi} from "../helpers/botApi";

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const fileApi = new EduchatApi.FileApi();
const chatApi = new EduchatApi.ChatApi();
const chatUserApi = new EduchatApi.Chat_userApi();
const messageApi = new EduchatApi.MessageApi();

function* loadUserHelper(id, parentId, ifOnlyParent) {
  const opts = {
    "chat": ifOnlyParent ? parentId : id
  };
  // use the helper function
  const getAllUsers = function() {
    return new Promise((resolve, reject) => {
      chatUserApi.chatUserList(opts, makeCallback(resolve, reject));
    });
  };
  const nextPageKeyword = "offset=";
  let done = false;
  const userList = {};
  do {
    const [response] = yield call(getAllUsers);
    const {next, results} = JSON.parse(response.text);
    done = !next;
    if (results) {
      for (const eachUser of results) {
        userList[eachUser.user.id] = eachUser.user;
      }
    }
    if (next && next.indexOf(nextPageKeyword) !== -1) {
      const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
      if (Number.isNaN(nextNumber)) {
        break;
      }
      opts.offset = nextNumber;
    } else {
      break;
    }
  } while (!done);
  yield put(addUsers(userList));
  yield put(loadUsersPage(id, Object.keys(userList).map(id => +id)));
  yield put(startLoadChatNotification());
  yield put(startLoadChatPrivacy());
}

function* loadMessagesHelper(id) {
  yield put(allMessagesLoaded(false));
  yield put(changeCurrentChatMessageOffset(0));
  try {
    const opts = {};
    // use the helper function
    const getAllMessages = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageList(id, opts, makeCallback(resolve, reject));
      });
    };
    const nextPageKeyword = "offset=";

    let finished = false;
    do {
      const tempOffset = yield select(getCurrentMessageOffset);
      opts.offset = tempOffset.toString();
      const [response] = yield call(getAllMessages);
      const {next, results} = JSON.parse(response.text);
      finished = !next;
      if (results) {
        const {messages} = results;
        yield put(loadMessagesPage(id, messages));
        yield put(changeFirstTimeLoadingMessages(false));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        yield put(changeCurrentChatMessageOffset(parseInt(nextNumber, 10)));
      } else {
        break;
      }
      const firstTimeLoadingMessages = yield select(getIsFirstTimeLoadingMessages);
      if (firstTimeLoadingMessages) {
        yield put(changeFirstTimeLoadingMessages(false));
      }
      yield take("REQUEST_PAGE_MESSAGES");
      yield put(changeNewMessageReceived(false));
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get messages");
  }
  yield put(allMessagesLoaded(true));
}

function* loadSubchatsHelper(parent, isParentChatAClass) {
  try {
    const opts = {
      "parent": parent
    };
    // use the helper function
    const getAllSubChats = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };

    const nextPageKeyword = "offset=";
    const endPageKeyword = "&parent=";

    let finished = false;
    do {
      const [response] = yield call(getAllSubChats);
      const {next, results, count} = JSON.parse(response.text);
      if (count > 10) {
        yield put(changeShowSeeMoreButton(true));
      } else
        yield put(changeShowSeeMoreButton(false));
      finished = !next;
      if (results) {
        const {chats} = results;
        if (isParentChatAClass) {
          yield put(loadSubchatsOfClass(parent, chats));
        } else
          yield put(loadSubchatsOfChat(parent, chats));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber =
          next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length,
            next.indexOf(endPageKeyword));
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("REQUEST_LOAD_SUBCHATS");
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get subchats");
  }
  yield put(changeIfAllSubchatsLoaded(true));
}

function* loadPrivilegedUsersHelper(id) {
  const {admins, tas} = yield call(ecapi.chat.getPrivilegedUsers, id);

  yield put(loadAdmins(id, admins));
  yield put(loadTas(id, tas));
}

function* loadResourcesHelper(id) {
  const paginator = yield call(ecapi.chat.getResources, id);

  let done;
  let value;
  do {
    ({value, done} = yield paginator.next());

    if (value) {
      const {messages: resources} = value;
      yield put(loadResourcesPage(id, resources));
    }
    if (done) {
      break;
    }
    yield take("REQUEST_PAGE_RESOURCES");
  } while (!done);
  yield put(changeIfAllFilesLoaded(true));
}

const loadChatWorker = worker("loadChat", function*({id, parentId, onlyParentChatUser}) {
  yield put(changeQuestionModeActive(false));
  yield put(closeRightPanel());
  yield put(clearIsAdminChat());
  const activeChat = yield select(getChat(id));
  if (!onlyParentChatUser) {
    yield put(setCreating(false));
  }
  yield put(changeFirstTimeLoadingMessages(true));
  yield put(resetChatUnreadMessagesCount(id));

  // yield put(checkForUnreadMessages());


  // Block on this action so we know lists are emptied before getting new pages
  yield put.resolve(startLoadChat(id, parentId, activeChat.get("is_class")));
  if (activeChat.get("is_bot")) {
    yield put(confirmIsBotSubChat());
    yield put(changeQuestionModeActive(true));
  }
  if(activeChat.get("is_admin_chat")) {
    yield put(confirmIsAdminChat());
  }
  yield put(clearInviteList());
  yield put(hideInviteListErrorMessage());

  if (onlyParentChatUser) {
    yield [
      call(loadUserHelper, id, parentId, onlyParentChatUser),
      call(loadPrivilegedUsersHelper, id)
    ];
    yield call(loadMessagesHelper, id);
  } else {
    yield [
      call(loadUserHelper, id, null, onlyParentChatUser),
      call(loadPrivilegedUsersHelper, id)
    ];
    if (parentId === null) { // you are clicking on parent class/chat
      yield [
        call(loadSubchatsHelper, id, activeChat.get("is_class")),
        fork(loadMessagesHelper, id),
        fork(loadResourcesHelper, id)
      ];
    } else { // there are subchats
      yield [
        fork(loadMessagesHelper, id),
        fork(loadResourcesHelper, id)
      ];
    }
  }

  yield call(setStorageItem, "activeChatId", id);
  yield put(finishedLoadingEverything());


  if (parentId === null) yield call(removeStorageItem, "parentId");
  else yield call(setStorageItem, "parentId", parentId);

  // --------------------------------
  const opts = {isClass: false};
  // use the helper function
  const getAllChats = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatList(opts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(getAllChats);
  const {count, results: {chats}} = JSON.parse(response.text);
  console.log("Chat count: ", count);
  yield put(checkForUnreadMessages(chats));
});

function* sendMessageHelper(tempId, text, isQuestion) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingMessage(tempId, {
    id: tempId,
    user: currentUser.id,
    text
  }));

  try {
    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    sendMessageDataSerialize.text = text;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    if(isQuestion) {
      sendMessageDataSerialize.is_question = isQuestion;
    }
    const sendMessageOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendMessage = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendMessageOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendMessage);
    const sentMessage = response.body.results;
    yield put(requestMoveChatToTop(activeChat.id));
    yield put(confirmPendingMessage(tempId, sentMessage));
  } catch (err) {
    // TODO: Handle errors on a per-message basis
    yield put(cancelPendingMessage(tempId));
    yield put(setError("sendMessage", err));
  }
}

function* sendMessageSaga() {
  let tempMsgIdNum = 0;
  while(true) {
    const {text} = yield take("SEND_MESSAGE");
    const isQuestion = yield select(getQuestionModeActive);
    const tempId = `msg${tempMsgIdNum++}`;
    yield fork(sendMessageHelper, tempId, text, isQuestion);
  }
}

export function* sendFileHelper(tempId, {file, title, extension, text, isQuestion}) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);
  yield put(addPendingMessage(tempId, {
    id: tempId,
    user: currentUser.id,
    text,
    file: {
      extension: extension,
      name: title
    }
  }));

  try {
    const fileOpts = {
      "upload": file
    };

    const uploadFile = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(title, fileOpts, makeCallback(resolve, reject));
      });
    };

    yield put(startFileUpload(title));
    const [fileUploadResponse] = yield call(uploadFile);
    const newProfilePicture = fileUploadResponse.body.results;


    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    if (text.trim().length !== 0) {
      sendMessageDataSerialize.text = text;
    }
    if(isQuestion) {
      sendMessageDataSerialize.is_question = true;
    }
    sendMessageDataSerialize.file = newProfilePicture.id;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendMessageOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendMessage = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendMessageOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendMessage);
    const sentMessage = response.body.results;

    yield put(confirmPendingMessage(tempId, sentMessage));
    yield put(addResource(sentMessage));
    yield put(endFileUpload());
    yield put(tellUserFileUploadIsDone("done"));
    yield call(pause, {millis: 2000});
    yield put(tellUserFileUploadIsDone(""));
  } catch (err) {
    if (err === AUTH_ERROR) {
      yield put(logout(true));
      return;
    }

    // TODO: Handle errors on a per-message basis
    yield put(cancelPendingMessage(tempId));
    yield put(setError("sendFile", err));
  }
}

function* sendFileSaga() {
  let tempFileIdNum = 0;
  while (true) {
    const action = yield take("SEND_FILE");
    const tempId = `file${tempFileIdNum++}`;
    yield fork(sendFileHelper, tempId, action);
  }
}

const loadCommentsWorker = worker("loadComments", function*({messageId, pageNumber}) {
  const activeChat = yield select(getActiveChat);
  const chatId = activeChat.id;
  const nextNumber = yield select(getCurrentMessageCommentOffset(messageId));
  console.log("nextNumber: " + nextNumber);
  try {
    const opts = {
      "parent": messageId
    };
    // use the helper function
    const getAllFileComments = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageList(chatId, opts, makeCallback(resolve, reject));
      });
    };

    const nextPageKeyword = "offset=";
    const endPageKeyword = "&parent=";
    opts.offset = nextNumber;

    yield put(isLoadingComments({fromMessage: messageId}));
    const [response] = yield call(getAllFileComments);
    const {count, next, results} = JSON.parse(response.text);
    const lastPage = count;
    yield call(console.log, "res ", response.text);
    yield call(console.log, "results ", results);
    yield call(console.log, "next ", next);
    yield call(console.log, "next ", pageNumber);
    if(results) {
      const {users, messages: comments} = results;
      let commentsList = yield select(getCommentsListFromActiveChat);
      // yield put(loadCommentsToMessage(messageId, comments));
      if(!commentsList[messageId]) {
        commentsList[messageId] = comments.reverse();
      } else {
        yield call(console.log, "Sagas comments ", comments);
        comments.reverse().map((comment) => commentsList[messageId].push(comment));
      }
      yield put(updateCommentsList(commentsList));
      commentsList = yield select(getCommentsListFromActiveChat);
      yield call(console.log, "Sagas commentsList ", commentsList);
      yield call(console.log, "Sagas comments ", comments);

      yield put(addUsers(users));
      yield put(loadComments(chatId, messageId, comments));
      yield put(isLoadingComments(null));
    }

    /* let finished = false;
    do {
      const [response] = yield call(getAllFileComments);
      const {next, results} = JSON.parse(response.text);
      finished = !next; // ALERT: will be making requests until there are no other pages in the api
      if (results) {
        const {users, messages: comments} = results;
        let commentsList = yield select(getCommentsListFromActiveChat);
        yield put(loadCommentsToMessage(messageId, comments));
        // TODO: for now, I am just looping through the comments list and appending them
        // to the list, gotta implement some sore of pagination in here
        if(commentsList[messageId]) {
          // commentsList[messageId].push(comments);
        } else {
          commentsList[messageId] = comments;
        }
        yield put(updateCommentsList(commentsList));
        commentsList = yield select(getCommentsListFromActiveChat);
        yield put(addUsers(users));
        yield put(loadComments(chatId, messageId, comments));
      }
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber =
          next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length,
            next.indexOf(endPageKeyword));
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
    } while (!finished); */
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get comments");
  }
});

function* sendCommentHelper(parentId, tempId, text) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingComment(parentId, tempId, {
    id: tempId,
    user: currentUser.id,
    text
  }));

  try {
    // const sentComment = yield call(ecapi.message.send, activeChat.id, currentUser.id, text,
    //                                {parent: parentId});
    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    sendMessageDataSerialize.text = text;
    sendMessageDataSerialize.parent = parentId;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendCommentOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };

    const sendComment = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendCommentOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendComment);

    const sentComment = response.body.results;
    const commentsList = yield select(getCommentsListFromActiveChat);
    commentsList[parentId].reverse().push(sentComment);
    commentsList[parentId].reverse();
    yield put(updateCommentsList(commentsList));

    yield put(confirmPendingComment(parentId, tempId, sentComment));
    // yield put(updateCommentsList());
  } catch ([error, response]) {
    // if (err === AUTH_ERROR) {
    //   yield put(logout(true));
    //   return;
    // }

    // TODO: Handle errors on a per-comment basis
    yield put(cancelPendingComment(parentId, tempId));
    yield put(setError("sendComment", response.text));
  }
}

function* sendCommentSaga() {
  let tempCmtIdNum = 0;
  while (true) {
    const {messageId, text} = yield take("SEND_COMMENT");
    const tempId = `cmt${tempCmtIdNum++}`;
    yield fork(sendCommentHelper, messageId, tempId, text);
  }
}

const inviteWorker = worker("invite", function*({users}) {
  try {
    yield put(startInvitingUserToChat());
    const activeChat = yield select(getActiveChat);
    const activeChatID = activeChat.id;
    const chatList = [];
    users.forEach(() => {
      chatList.push(activeChatID);
    });

    const createChatUserPostSerializer = new EduchatApi.ChatUserPostSerializer();
    createChatUserPostSerializer.user = users;
    createChatUserPostSerializer.chat = chatList;
    const addUserToThisChatOpts = {
      "chatUserPostSerializer": createChatUserPostSerializer
    };

    const addUserToThisChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserCreate(addUserToThisChatOpts, makeCallback(resolve, reject));
      });
    };

    yield call(addUserToThisChat);
    yield put(toggleInviteInterface());
    yield put(clearInviteList());
    yield call(loadUserHelper, activeChat.id);
  } catch (err) {
    console.error("error inviting user ", err);
  } finally {
    yield put(endInvitingUserToChat());
  }
});

const uploadChatPictureWorker = worker("uploadChatPicture", function*({picture, name}) {
  yield put(startUploadingChatPicture());
  const theActiveChat = yield select(getActiveChat);
  const chatProfilePictureOpts = {
    "upload": picture
  };

  const uploadChatPicture = function() {
    return new Promise((resolve, reject) => {
      fileApi.fileCreate(name, chatProfilePictureOpts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(uploadChatPicture);
  const newProfilePicture = response.body.results;

  const chatUpdateSerializerData = new EduchatApi.APIViewChatSerializer();
  chatUpdateSerializerData.picture_file = newProfilePicture.id;

  const chatUpdateSerializerOpts = {
    "aPIViewChatSerializer": chatUpdateSerializerData
  };

  const chatPartialUpdate = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatPartialUpdate(
        theActiveChat.id, chatUpdateSerializerOpts, makeCallback(resolve, reject));
    });
  };

  yield call(chatPartialUpdate);

  yield put(finishedUploadChatPicture(newProfilePicture));
});

const promoteUserTypeWorker = worker("promoteUserType", function*({newUserType, userId, chatId}) {
  try {
    const parentId = null;
    const onlyParentChatUser = false;
    const ChatUserPromotionSerializerData = new EduchatApi.ChatUserPromotionSerializer();
    switch(newUserType) {
      case "ADMIN":
        ChatUserPromotionSerializerData.is_admin = true;
        break;
      case "TA":
        ChatUserPromotionSerializerData.is_ta = true;
        break;
      default:
        console.error("This kind of user type promotion doesn't exist");
    }
    const chatPromotionOptions = {
      "chatUserPromotionSerializer": ChatUserPromotionSerializerData
    };
    const userPromotionApiRequest = () => new Promise((resolve, reject) => {
      chatUserApi.chatUserPartialUpdate(chatId, userId, chatPromotionOptions,
      makeCallback(resolve, reject));
    });
    yield call(userPromotionApiRequest);
    yield call(loadPrivilegedUsersHelper, chatId);
    yield call(loadUserHelper, chatId, parentId, onlyParentChatUser);
  } catch ([error, response]) {
    console.error("Failed to promote user: " + error);
  }
});

const deleteUserTypeWorker = worker("deleteUserType", function*({deleteUserType, userId, chatId}) {
  try {
    const parentId = null;
    const onlyParentChatUser = false;
    const ChatUserPromotionSerializerData = new EduchatApi.ChatUserPromotionSerializer();
    switch(deleteUserType) {
      case "DELETE_ADMIN":
        ChatUserPromotionSerializerData.is_admin = false;
        break;
      case "DELETE_TA":
        ChatUserPromotionSerializerData.is_ta = false;
        break;
      default:
        console.error("This kind of user type promotion doesn't exist");
    }
    const chatPromotionOptions = {
      "chatUserPromotionSerializer": ChatUserPromotionSerializerData
    };
    const userPromotionApiRequest = () => new Promise((resolve, reject) => {
      chatUserApi.chatUserPartialUpdate(chatId, userId, chatPromotionOptions,
        makeCallback(resolve, reject));
    });
    yield call(userPromotionApiRequest);
    yield call(loadPrivilegedUsersHelper, chatId);
    yield call(loadUserHelper, chatId, parentId, onlyParentChatUser);
  } catch ([error, response]) {
    console.error("Failed to delete user: " + error);
  }
});

const markAsBestAnswerWorker = worker("markAsBestAnswer", function*({bestAnswer, boolState, answerList, messageId}) {
  const activeChat = yield select(getActiveChat);
  const messageComments = yield select(getCurrentMessageComments(messageId));
  const chatId = activeChat.id;
  const id = bestAnswer.id;
  console.log("Before: ", messageComments);
  try {
    const updateMessageDataSerializer2 = new EduchatApi.MessageUpdateSerializer();
    updateMessageDataSerializer2.is_best_answer = false;

    const updateMessageOpts2 = {
      "messageUpdateSerializer": updateMessageDataSerializer2
    };

    const updateMessageDataSerializer = new EduchatApi.MessageUpdateSerializer();
    updateMessageDataSerializer.is_best_answer = boolState;

    const updateMessageOpts = {
      "messageUpdateSerializer": updateMessageDataSerializer
    };


    let counter = 0;
    while(counter < answerList.length) {
      const answerIds = answerList[counter].id;
      const resetBestAnswer = function() {
        return new Promise((resolve, reject) => {
          messageApi.messagePartialUpdate(answerIds, updateMessageOpts2,
            makeCallback(resolve, reject));
        });
      };
      yield call(resetBestAnswer);
      counter++;
    }

    const messagePartialUpdater = function() {
      return new Promise((resolve, reject) => {
        messageApi.messagePartialUpdate(id, updateMessageOpts, makeCallback(resolve, reject));
      });
    };

    yield call(messagePartialUpdater);

    messageComments.map((answer) => {
      if(answer.id === id) {
        answer.is_best_answer = boolState;
      } else {
        answer.is_best_answer = false;
      }
    });
    yield put(updateBestAnswer(messageComments, messageId));
  } catch (err) {
    // TODO: Handle errors on a per-message basis
    yield put(setError("updateMessage", err));
  }
});

const starMessageWorker = worker("starMessage", function*({starredMessage}) {
  const id = starredMessage.id;
  try {
    const updateMessageDataSerializer = new EduchatApi.MessageUpdateSerializer();
    updateMessageDataSerializer.is_starred = true;

    const updateMessageOpts = {
      "messageUpdateSerializer": updateMessageDataSerializer
    };

    const messagePartialUpdate = function() {
      return new Promise((resolve, reject) => {
        messageApi.messagePartialUpdate(id, updateMessageOpts, makeCallback(resolve, reject));
      });
    };

    yield call(messagePartialUpdate);
    const [response] = yield call(messagePartialUpdate);
    const starredMessage = response.body.results;
    console.log(starredMessage);
    const activeChat = yield select(getActiveChat);
    yield call(console.log, "the stuff ", activeChat.messages);
  } catch (err) {
    // TODO: Handle errors on a per-message basis
    yield put(setError("updateMessage", err));
  }
});

const unstarMessageWorker = worker("unstarMessage", function*({starredMessage}) {
  const id = starredMessage.id;
  try {
    const updateMessageDataSerializer = new EduchatApi.MessageUpdateSerializer();
    updateMessageDataSerializer.is_starred = false;

    const updateMessageOpts = {
      "messageUpdateSerializer": updateMessageDataSerializer
    };

    const messagePartialUpdate = function() {
      return new Promise((resolve, reject) => {
        messageApi.messagePartialUpdate(id, updateMessageOpts, makeCallback(resolve, reject));
      });
    };
    yield call(messagePartialUpdate);
    // const [response] = yield call(messagePartialUpdate);
    // const starredMessage = response.body.results;
    // console.log(starredMessage);
  } catch (err) {
    // TODO: Handle errors on a per-message basis
    yield put(setError("updateMessage", err));
  }
});

function* sendFileCommentHelper(tempId, {parentId, file, title, extension, text}) {
  const currentUser = yield select(getCurrentUser);
  const activeChat = yield select(getActiveChat);

  yield put(addPendingComment(parentId, tempId, {
    id: tempId,
    user: currentUser.id,
    text,
    file: {
      extension: extension,
      name: title
    }
  }));
  try {
    const fileOpts = {
      "upload": file
    };

    const uploadFile = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(title, fileOpts, makeCallback(resolve, reject));
      });
    };

    const [fileUploadResponse] = yield call(uploadFile);
    const newProfilePicture = fileUploadResponse.body.results;

    const sendMessageDataSerialize = new EduchatApi.MessageSendSerializer();
    if (text.trim().length !== 0) {
      sendMessageDataSerialize.text = text;
    }
    sendMessageDataSerialize.parent = parentId;
    sendMessageDataSerialize.file = newProfilePicture.id;
    sendMessageDataSerialize.user = currentUser.id;
    sendMessageDataSerialize.chat = activeChat.id;
    const sendCommentOpts = {
      "messageSendSerializer": sendMessageDataSerialize
    };
    const sendFileComment = function() {
      return new Promise((resolve, reject) => {
        messageApi.messageCreate(sendCommentOpts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(sendFileComment);
    const {sentComment} = response.body.results;

    yield put(confirmPendingComment(parentId, tempId, sentComment));
  } catch ([error, response]) {
    // if (err === AUTH_ERROR) {
    //   yield put(logout(true));
    //   return;
    // }

    // TODO: Handle errors on a per-comment basis
    yield put(cancelPendingComment(parentId, tempId));
    yield put(setError("sendFileComment", response.text));
  }
}

function* sendFileCommentSaga() {
  let tempCmtIdNum = 0;
  while (true) {
    const action = yield take("SEND_FILE_COMMENT");
    // const {messageId, text} = yield take("SEND_FILE_COMMENT");
    const tempId = `cmt${tempCmtIdNum++}`;
    yield fork(sendFileCommentHelper, tempId, action);
  }
}

function* toggleNotificationsWorker(theInfo) {
  const opts = {
    "chatUserPromotionSerializer": {
      "is_muted": theInfo.boolean
    }
  };
  const toggleNotifications = function() {
    return new Promise((resolve, reject) => {
      chatUserApi.chatUserPartialUpdate(theInfo.chatId,
        theInfo.userId, opts, makeCallback(resolve, reject));
    });
  };
  yield call(toggleNotifications);
  yield put(loadChatNotification(theInfo.boolean));
}

function* toggleAddNewUserFromParentWorker(theInfo) {
  const opts = {
    "aPIViewChatSerializer": {
      "add_new_users_from_parent": theInfo.boolean
    }
  };
  const toggleAddUserFromParent = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatPartialUpdate(theInfo.chatId
        , opts, makeCallback(resolve, reject));
    });
  };
  yield call(toggleAddUserFromParent);
  // yield put(loadChatPrivacy(theInfo.boolean));
}

function* togglePrivacyWorker(theInfo) {
  const opts = {
    "aPIViewChatSerializer": {
      "searchable": theInfo.boolean
    }
  };
  const togglePrivacy = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatPartialUpdate(theInfo.chatId
        , opts, makeCallback(resolve, reject));
    });
  };
  yield call(togglePrivacy);
  yield put(loadChatPrivacy(theInfo.boolean));
}

const startLoadChatNotificationWorker = worker("startLoadChatNotification", function*() {
  try {
    const user = yield select(getCurrentUser);
    const chat = yield select(getActiveChat);
    const opts = {"user": user.id, "chat": chat.id};
    // use the helper function
    const startLoadChatNotification = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserList(opts, makeCallback(resolve, reject));
      });
    };
    const [response] = yield call(startLoadChatNotification);
    yield put(loadChatNotification(response.body.results[0].is_muted));
  } catch ([error, response]) {
    yield put(setError("startLoadChatNotification", response.text));
  }
});

const startLoadChatPrivacyWorker = worker("startLoadChatPrivacy", function*() {
  try {
    const chat = yield select(getActiveChat);
    const opts = {"id": chat.id};
    // use the helper function
    const startLoadChatPrivacy = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };
    const [response] = yield call(startLoadChatPrivacy);
    yield put(loadChatPrivacy(response.body.results.chats[0].searchable));
  } catch ([error, response]) {
    yield put(setError("startLoadChatPrivacy", response.text));
  }
});

const removeUserWorker = worker("removeUser", function*({chatId, userId}) {
  const parentId = null;
  const onlyParentChatUser = false;
  try {
    const removeThisUser = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserDelete(chatId, userId, makeCallback(resolve, reject));
      });
    };
    yield call(removeThisUser);
    yield call(loadUserHelper, chatId, parentId, onlyParentChatUser);
  } catch([error, response]) {
    yield put(setError("removeUser", response.text));
  }
});

const forwardQuestionWorker = worker("forwardQuestion", function*({chatId}) {
  try {
    const activeChat = yield select(getActiveChat);
    yield call(forwardQuestionApi, activeChat.id,
      activeChat.messages.toJS()[activeChat.messages.toJS().length - 2]);
  } catch(err) {
    console.error(err);
  }
});

export default function*() {
  yield takeLatest("REQUEST_LOAD_CHAT", loadChatWorker);
  yield fork(sendMessageSaga);
  yield takeEvery("REQUEST_LOAD_COMMENTS", loadCommentsWorker);
  yield fork(sendCommentSaga);
  yield fork(sendFileSaga);
  yield fork(sendFileCommentSaga);
  yield takeEvery("INVITE", inviteWorker);
  yield takeLatest("UPLOAD_CHAT_PICTURE", uploadChatPictureWorker);
  yield takeLatest("TOGGLE_NOTIFICATIONS", toggleNotificationsWorker);
  yield takeLatest("TOGGLE_ADD_USER_FROM_PARENT", toggleAddNewUserFromParentWorker);
  yield takeLatest("TOGGLE_PRIVACY", togglePrivacyWorker);
  yield takeEvery("START_LOAD_CHAT_NOTIFICATION", startLoadChatNotificationWorker);
  yield takeEvery("START_LOAD_CHAT_PRIVACY", startLoadChatPrivacyWorker);
  yield takeEvery("PROMOTE_USER_TYPE", promoteUserTypeWorker);
  yield takeEvery("DELETE_USER_TYPE", deleteUserTypeWorker);
  yield takeEvery("REMOVE_USER", removeUserWorker);
  yield takeLatest("MARK_AS_BEST_ANSWER", markAsBestAnswerWorker);
  yield takeLatest("STAR_MESSAGE", starMessageWorker);
  yield takeEvery("UNSTAR_MESSAGE", unstarMessageWorker);
  yield takeEvery("FORWARD_QUESTION", forwardQuestionWorker);
}
