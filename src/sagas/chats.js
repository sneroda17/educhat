// @flow

import {put, call, take, takeEvery, takeLatest, select} from "redux-saga/effects";
import {
  loadChats,
  addChat,
  updateChat,
  toggleLoadingChatsState,
  loadSubchatsOfChat,
  deleteChat,
  moveChatToTopOfTheList
} from "../actions/chats";
import {addUsers} from "../actions/users";
import {requestLoadChat, startLoadChat, allMessagesLoaded} from "../actions/active-chat";
import {setCreating, changeCurrentSessionExpired} from "../actions/current-user";
import {setError, deleteError} from "../actions/errors";
import {
  toggleChatCreationPending,
  changeFirstTimeLoadingChats,
  changeIfShowingClasses,
  updateTotalChatsNumber,
  updateTotalClassesNumber,
  startSearchFunction,
  changeSearchMode,
  changeIfChatsTabIsReady,
  changeHasUnreadChatMessages,
  checkForUnreadMessages
} from "../actions/ui/left-panel";
import {
  openRightPanel,
  changeActivePanel,
  closeRightPanel
} from "../actions/ui/right-panel";
import {closeUserProfile} from "../actions/ui/main-panel";
import {
  // getCurrentUser,
  getIfLeftPanelShowingClasses,
  getCurrentChatsTotalNumber,
  getCurrentClassesTotalNumber,
  getIfInSearchingMode,
  getChat
  // getChatNotifications
} from "./selectors";
import worker from "./worker";
import {setStorageItem, removeStorageItem} from "../helpers/storage";
import EduchatApi from "educhat_api_alpha";

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};
const chatApi = new EduchatApi.ChatApi();
const chatUserApi = new EduchatApi.Chat_userApi();
const fileApi = new EduchatApi.FileApi();

const loadChatsWorker = worker("loadAllChats", function*() {
  try {
    const opts = {isClass: false};
    // use the helper function
    const getAllChats = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };

    const defaultClient = EduchatApi.ApiClient.instance;
    const Token = defaultClient.authentications.Token;
    Token.apiKey = localStorage.getItem("token");
    Token.apiKeyPrefix = "Token";
    const nextPageKeyword = "offset=";

    let finished = false;
    let firstTime = true;
    // LEFT OFF RIGHT HERE
    do {
      const [response] = yield call(getAllChats);
      const {count, next, results: {chats, users}} = JSON.parse(response.text);
      yield put(updateTotalChatsNumber(count));
      finished = !next;
      const ifLeftPanelShowingClasses = yield select(getIfLeftPanelShowingClasses);
      if (firstTime && !ifLeftPanelShowingClasses) {
        if (chats.length !== 0) {
          yield put(requestLoadChat(chats[0].id, null, false));
        }
      }
      yield put(addUsers(users));
      yield put(loadChats(chats));
      yield put(toggleLoadingChatsState(false));
      yield put(changeFirstTimeLoadingChats());
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        yield put(changeIfChatsTabIsReady(true));
        break;
      }
      if (firstTime) {
        firstTime = false;
        yield put(changeIfChatsTabIsReady(true));
      }
      yield put(checkForUnreadMessages(chats));
      yield take("LOAD_MORE_CHATS");
      yield put(toggleLoadingChatsState(true));
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
    && (response.body.detail === "Invalid token."
        || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get chats");
  }
});

const createChatWorker = worker("createChat", function*({name, ifSearchable, pictureObject}) {
  yield put(deleteError("createChat"));
  yield put(toggleChatCreationPending());

  // set these parameters regardless if there is a picture object or not
  const createChatDataSerializer = new EduchatApi.APIViewChatSerializer();
  createChatDataSerializer.name = name;
  createChatDataSerializer.is_class = false;
  createChatDataSerializer.parent = null;
  createChatDataSerializer.searchable = ifSearchable;
  createChatDataSerializer.is_bot = false;

  // if there is a picture object, upload the file then set picture parameter
  if (pictureObject !== null) {
    const chatProfilePictureOpts = {
      "upload": pictureObject
    };

    const uploadChatPicture = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(name, chatProfilePictureOpts, makeCallback(resolve, reject));
      });
    };

    const [chatPictureResponse] = yield call(uploadChatPicture);
    const newProfilePicture = chatPictureResponse.body.results;
    createChatDataSerializer.picture_file = newProfilePicture.id;
  }

  const opts = {
    "aPIViewChatSerializer": createChatDataSerializer
  };
  // use the helper function
  const createNewChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };
  try {
    const [response] = yield call(createNewChat);
    const chat = response.body.results;
    yield put(addChat(chat));
    const currentChatsTotalNumber = yield select(getCurrentChatsTotalNumber);
    yield put(updateTotalChatsNumber(currentChatsTotalNumber + 1));
    // Immediately switch to the new chat
    yield put(requestLoadChat(chat.id, null, false));
    // Close the creation UI
    yield put(setCreating(false));
    yield put(changeIfShowingClasses(false));
    yield put(openRightPanel());
  } catch ([err, response]) {
    if (err.status === 500) {
      yield put(setError("createChat",
        {text:
"It looks like the server did something wrong. Please come back later when we fixed it. Thanks."}));
    } else if (err.status >= 400 && err.status < 500) {
      yield put(setError("createChat",
        {text:
          "Try that again."}));
    }
  } finally {
    yield put(toggleChatCreationPending());
  }
});

const createBotSubchatWorker = worker("createBotSubchat",
  function*({parentId, ifInviteNewFromParent}) {
    yield put(deleteError("createChat"));
    yield put(toggleChatCreationPending());
    const createSubChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    createSubChatDataSerializer.parent = parentId;
    createSubChatDataSerializer.searchable = false;
    createSubChatDataSerializer.is_bot = true;
    const opts = {
      "aPIViewChatSerializer": createSubChatDataSerializer
    };

    // use the helper function
    const createNewSubChat = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatCreate(opts, makeCallback(resolve, reject));
      });
    };

    try {
      const [response] = yield call(createNewSubChat);
      const newSubchat = response.body.results;
      yield put(loadSubchatsOfChat(parentId, [newSubchat]));
      // yield put(loadSubchats(parentId, [newSubchat]));
      yield put(addChat(newSubchat));
      // Immediately switch to the new chat
      yield put(requestLoadChat(newSubchat.id, parentId, true));
      // Close the creation UI
      yield put(closeRightPanel());
    } catch ([err, response]) {
      if (err.status === 500) {
        yield call(alert(// eslint-disable-line no-alert
"It looks like the server did something wrong. Please come back later when we fixed it. Thanks."));
      } else if (err.status >= 400 && err.status < 500) {
        yield call(alert("Try that again.")); // eslint-disable-line no-alert
      }
    } finally {
      yield put(toggleChatCreationPending());
    }
  });

const createSubchatWorker = worker("createSubchat",
function*({name, parentId, ifSearchable, isSubchatAnonymous, ifInviteNewFromParent}) {
  yield put(deleteError("createChat"));
  yield put(toggleChatCreationPending());
  // const chat = yield call(ecapi.chat.create, name, false, parentId,
  //                         {searchable: ifSearchable, is_anonymous: isSubchatAnonymous});
  const createSubChatDataSerializer = new EduchatApi.APIViewChatSerializer();
  createSubChatDataSerializer.name = name;
  createSubChatDataSerializer.parent = parentId;
  createSubChatDataSerializer.searchable = ifSearchable;
  createSubChatDataSerializer.is_anonymous = isSubchatAnonymous;
  createSubChatDataSerializer.is_bot = false;
  createSubChatDataSerializer.add_new_users_from_parent = ifInviteNewFromParent;
  const opts = {
    "aPIViewChatSerializer": createSubChatDataSerializer
  };

  // use the helper function
  const createNewSubChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };

  try {
    const [response] = yield call(createNewSubChat);
    const newSubchat = response.body.results;
    yield put(loadSubchatsOfChat(parentId, [newSubchat]));
    // yield put(loadSubchats(parentId, [newSubchat]));
    yield put(addChat(newSubchat));
    // Immediately switch to the new chat
    yield put.resolve(requestLoadChat(newSubchat.id, parentId, true));
    // Close the creation UI
    yield put(changeActivePanel("user"));
    yield put(setCreating("subchat_setup"));
    yield put(openRightPanel());
    // yield put(setCreating(false));
  } catch ([err, response]) {
    if (err.status === 500) {
      yield put(setError("createChat",
        {text:
"It looks like the server did something wrong. Please come back later when we fixed it. Thanks."}));
    } else if (err.status >= 400 && err.status < 500) {
      yield put(setError("createChat",
        {text:
          "Try that again."}));
    }
  } finally {
    yield put(toggleChatCreationPending());
  }
});

const changeChatDetailsWorker = worker("changeChatDetails", function*({id, name, desc}) {
  try {
    // yield call(ecapi.chat.changeDetails, id, {chat_name: name, chat_desc: desc});
    const patchChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    patchChatDataSerializer.name = name;
    patchChatDataSerializer.desc = desc;
    const opts = {
      "aPIViewChatSerializer": patchChatDataSerializer
    };

    // use the helper function
    const changeChatInfo = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatPartialUpdate(id, opts, makeCallback(resolve, reject));
      });
    };

    yield call(changeChatInfo);
    yield put(updateChat(id, {name: name, description: desc}));
  } catch (err) {
    yield put(setError("changeChatDetails", err.message));
  }
});

const changeChatInviteAllWorker = worker("changeChatInviteAll", function*({id, ifInviteAll}) {
  try {
    const patchChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    patchChatDataSerializer.add_new_users_from_parent = ifInviteAll;
    const opts = {
      "aPIViewChatSerializer": patchChatDataSerializer
    };

    // use the helper function
    const changeSubChatAddNewUsersFromParent = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatPartialUpdate(id, opts, makeCallback(resolve, reject));
      });
    };

    yield call(changeSubChatAddNewUsersFromParent);
    // yield call(ecapi.chat.changeAddNewUsersFromParentChat,
    // id, {ifSubchatInviteAll: ifInviteAll});
  } catch ([error, response]) {
    yield put(setError("changeChatInviteAll", response.text));
  }
});

const leaveChatWorker = worker("leaveChat", function*({userId, chatId, parentId}) {
  try {
    const leaveThisChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserDelete(userId, chatId, makeCallback(resolve, reject));
      });
    };
    yield call(leaveThisChat);
    // yield call(ecapi.chatUser.leave, chatId, userId);
    yield put(closeRightPanel());
    yield call(removeStorageItem, "activeChatId");
    yield put(allMessagesLoaded(true));
    // const paginator = yield call(ecapi.chat.getChats);
    // const {value: {chats}} = yield paginator.next();
    const isThatChatAClass = yield select(getChat(chatId));
    if (parentId) {
      yield call(setStorageItem, "activeChatId", parentId, false);
      yield put.resolve(startLoadChat(parentId, null, !!isThatChatAClass));
      yield put.resolve(requestLoadChat(parentId, null, false));
    } else {
      let opts = null;
      if (isThatChatAClass.get("is_class")) {
        opts = {isClass: true};
        const currentClassesTotalNumber = yield select(getCurrentClassesTotalNumber);
        yield put(updateTotalClassesNumber(currentClassesTotalNumber - 1));
      } else {
        opts = {isClass: false};
        const currentChatsTotalNumber = yield select(getCurrentChatsTotalNumber);
        yield put(updateTotalChatsNumber(currentChatsTotalNumber - 1));
      }
      const getAllChats = function() {
        return new Promise((resolve, reject) => {
          chatApi.chatList(opts, makeCallback(resolve, reject));
        });
      };
      const [response] = yield call(getAllChats);
      const {results: {chats}} = JSON.parse(response.text);
      if (chats.length !== 0) {
        yield call(setStorageItem, "activeChatId", chats[0].id, false);
        yield put.resolve(startLoadChat(chats[0].id, null, chats[0].is_class));
        yield put.resolve(requestLoadChat(chats[0].id, null, false));
      } else {
        yield put.resolve(startLoadChat(0, null, !!isThatChatAClass));
      }
      yield put(deleteChat(chatId));
    }
  } catch([error, response]) {
    yield put(setError("leaveChat", response.text));
  }
});

const deleteChatWorker = worker("deleteChat", function*({chatId, parentId}) {
  try {
    const deleteThisChat = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatDelete(chatId, makeCallback(resolve, reject));
      });
    };
    yield call(deleteThisChat);
    // yield call(ecapi.chatUser.leave, chatId, userId);
    yield put(closeRightPanel());
    yield call(removeStorageItem, "activeChatId");
    yield put(allMessagesLoaded(true));
    // const paginator = yield call(ecapi.chat.getChats);
    // const {value: {chats}} = yield paginator.next();
    const isThatChatAClass = yield select(getChat(chatId));
    if (parentId) {
      yield call(setStorageItem, "activeChatId", parentId, false);
      yield put.resolve(startLoadChat(parentId, null, !!isThatChatAClass));
      yield put.resolve(requestLoadChat(parentId, null, false));
    } else {
      let opts = null;
      if (isThatChatAClass.get("is_class")) {
        opts = {isClass: true};
        const currentClassesTotalNumber = yield select(getCurrentClassesTotalNumber);
        yield put(updateTotalClassesNumber(currentClassesTotalNumber - 1));
      } else {
        opts = {isClass: false};
        const currentChatsTotalNumber = yield select(getCurrentChatsTotalNumber);
        yield put(updateTotalChatsNumber(currentChatsTotalNumber - 1));
      }
      const getAllChats = function() {
        return new Promise((resolve, reject) => {
          chatApi.chatList(opts, makeCallback(resolve, reject));
        });
      };
      const [response] = yield call(getAllChats);
      const {results: {chats}} = JSON.parse(response.text);
      if (chats.length !== 0) {
        yield call(setStorageItem, "activeChatId", chats[0].id, false);
        yield put.resolve(startLoadChat(chats[0].id, null, chats[0].is_class));
        yield put.resolve(requestLoadChat(chats[0].id, null, false));
      } else {
        yield put.resolve(startLoadChat(0, null, !!isThatChatAClass));
      }
      yield put(deleteChat(chatId));
    }
  } catch([error, response]) {
    yield put(setError("deleteChat", response.text));
  }
});

const createOneToOneChatWorker = worker("createOneToOneChat", function*({otherUser}) {
  try {
    const createOneToOneChatDataSerializer = new EduchatApi.APIViewChatSerializer();
    // createOneToOneChatDataSerializer.name = "Chat with " + [otherUser.first_name];
    const opts = {
      "aPIViewChatSerializer": createOneToOneChatDataSerializer
    };

    // use the helper function
    const createOneToOneNewChat = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatCreate(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(createOneToOneNewChat);
    // const newChat = yield call(ecapi.chat.create, "Chat with " + [otherUser.first_name]);
    const newChat = response.body.results;
    // As this is only a one to one chat the chatList will only have one chat ID
    const chatList = [newChat.id];
    const users = [otherUser.id];

    // const newChatWithUser = yield call(ecapi.chatUser.add, chatList, users);
    const createChatUserPostSerializer = new EduchatApi.ChatUserPostSerializer();
    createChatUserPostSerializer.user = users;
    createChatUserPostSerializer.chat = chatList;
    const addUserToNewChatOpts = {
      "chatUserPostSerializer": createChatUserPostSerializer
    };

    const addUserToNewOneToOneChat = function() {
      return new Promise((resolve, reject) => {
        chatUserApi.chatUserCreate(addUserToNewChatOpts, makeCallback(resolve, reject));
      });
    };

    const [newOnetoOneChatResponse] = yield call(addUserToNewOneToOneChat);
    const newChatWithUser = newOnetoOneChatResponse.body.results;
    yield put.resolve(addChat(newChatWithUser[0].chat));
    yield put(closeUserProfile());
    const currentChatsTotalNumber = yield select(getCurrentChatsTotalNumber);
    yield put(updateTotalChatsNumber(currentChatsTotalNumber + 1));
    const ifInSearchingMode = yield select(getIfInSearchingMode);
    yield put(startSearchFunction(false));
    if (ifInSearchingMode) {
      yield put(changeSearchMode("mine"));
    }
    yield put(changeIfShowingClasses(false));
    yield put(startLoadChat(newChat.id, null));
    yield put(requestLoadChat(newChat.id, null, false));
  } catch([error, response]) {
    yield put(setError("createOneToOneChat", response.text));
  }
});

const moveChatToTopWorker = worker("moveChatToTopOfTheList", function*({chatId}) {
  try {
    const chat = yield select(getChat(chatId));
    yield put(moveChatToTopOfTheList(chat));
  } catch([error, response]) {
    yield put(setError("moveChatToTopOfTheList error ", response.text));
  }
});

const checkForUnreadMessagesWorker = worker("checkForUnreadMessages", function*({chats}) {
  let counter = 0;
  while((counter < chats.length)) {
    if(chats[counter].unread_count > 0) {
      yield put(changeHasUnreadChatMessages(true));
      return;
    }
    counter++;
  }
  yield put(changeHasUnreadChatMessages(false));
});

export default function*() {
  yield takeEvery("REQUEST_LOAD_CHATS", loadChatsWorker);
  yield takeEvery("CREATE_CHAT", createChatWorker);
  yield takeEvery("CREATE_SUBCHAT", createSubchatWorker);
  yield takeLatest("CREATE_BOT_SUBCHAT", createBotSubchatWorker);
  yield takeLatest("CHANGE_CHAT_DETAILS", changeChatDetailsWorker);
  yield takeLatest("CHANGE_CHAT_INVITE_ALL", changeChatInviteAllWorker);
  yield takeEvery("LEAVE_CHAT", leaveChatWorker);
  yield takeEvery("START_DELETE_CHAT", deleteChatWorker);
  yield takeLatest("CREATE_ONE_TO_ONE_CHAT", createOneToOneChatWorker);
  yield takeEvery("REQUEST_MOVE_CHAT", moveChatToTopWorker);
  yield takeEvery("CHECK_FOR_UNREAD_MESSAGES", checkForUnreadMessagesWorker);
}
