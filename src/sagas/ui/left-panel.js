import {put, call, takeLatest, select, take} from "redux-saga/effects";

import {
  saveSearchChatResultAndDisplay,
  resetSearchChatResultAndDisplay,
  setIfLeftPanelMakingSearchRequest,
  saveSearchNewChatResultAndDisplay,
  resetSearchNewChatResultAndDisplay,
  saveSearchPeopleResultAndDisplay,
  resetSearchPeopleResultAndDisplay,
  updateTotalChatsNumber,
  updateTotalClassesNumber,
  changeIfShowingClasses,
  startSearchFunction,
  changeSearchMode
} from "../../actions/ui/left-panel";
import {requestLoadChat, startLoadChat} from "../../actions/active-chat";
import {addUsers} from "../../actions/users";
import worker from "../worker";
import {
  getChat,
  getClass,
  getClassOrChatSearchResult,
  getCurrentChatsTotalNumber,
  getCurrentClassesTotalNumber,
  getCurrentUser
} from "../selectors";
import {
  addChat,
  deleteChat,
  toggleLoadingChatsState
} from "../../actions/chats";
import {
  addClass,
  deleteClass
} from "../../actions/classes";
import {
  openRightPanel
} from "../../actions/ui/right-panel";

import EduchatApi from "educhat_api_alpha";

const chatApi = new EduchatApi.ChatApi();
const userApi = new EduchatApi.UserApi();
const chatUserApi = new EduchatApi.Chat_userApi();

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const searchChatByNameWorker = worker("searchChatByName", function*({chatName}) {
  try {
    yield put(setIfLeftPanelMakingSearchRequest(true));
    yield put(resetSearchChatResultAndDisplay());
    const opts = {"nameIcontains": chatName};

    const getSearchMineChatResult = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatList(opts, makeCallback(resolve, reject));
      });
    };
    let finished = false;
    const nextPageKeyword = "offset=";
    do {
      const [response] = yield call(getSearchMineChatResult);
      const {next} = response.body;
      finished = !next;
      const {chats, users} = response.body.results;
      yield put.resolve(addUsers(users));
      yield put(saveSearchChatResultAndDisplay(chats));
      yield put(toggleLoadingChatsState(false));
      yield put(setIfLeftPanelMakingSearchRequest(false));
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("LOAD_MORE_CHATS_MINE");
      yield put(toggleLoadingChatsState(true));
    } while (!finished);
  } catch([error, response]) {
    // TODO
  } finally {
    yield put(setIfLeftPanelMakingSearchRequest(false));
  }
});

const searchNewChatByNameWorker = worker("searchNewChatByName", function*({newChatName}) {
  try {
    yield put(setIfLeftPanelMakingSearchRequest(true));
    yield put(resetSearchNewChatResultAndDisplay());
    const opts = {"nameIcontains": newChatName};

    const getSearchNewChatResult = function() {
      return new Promise((resolve, reject) => {
        chatApi.chatJoinlistList(opts, makeCallback(resolve, reject));
      });
    };

    let finished = false;
    const nextPageKeyword = "offset=";

    do {
      // const [response] = yield call(getSearchNewChatResult);
      // const searchResult = response.body.results;
      // yield put(saveSearchNewChatResultAndDisplay(searchResult));
      const [response] = yield call(getSearchNewChatResult);
      const {next} = response.body;
      finished = !next;
      const searchResult = response.body.results;
      yield put(saveSearchNewChatResultAndDisplay(searchResult));
      yield put(toggleLoadingChatsState(false));
      yield put(setIfLeftPanelMakingSearchRequest(false));
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        break;
      }
      yield take("LOAD_MORE_CHATS_NEW");
      yield put(toggleLoadingChatsState(true));
    } while (!finished);
  } catch([error, response]) {
    // TODO
  } finally {
    yield put(setIfLeftPanelMakingSearchRequest(false));
  }
});

const searchPeopleByNameWorker = worker("searchPeopleByName", function*({peopleName}) {
  try {
    yield put(setIfLeftPanelMakingSearchRequest(true));
    yield put(resetSearchPeopleResultAndDisplay());

    const optsFirstName = {"firstNameIcontains": peopleName};

    const getSearchPeopleResultByFirstName = function() {
      return new Promise((resolve, reject) => {
        userApi.userList(optsFirstName, makeCallback(resolve, reject));
      });
    };

    const optsLastName = {"lastNameIcontains": peopleName};

    const getSearchPeopleResultByLastName = function() {
      return new Promise((resolve, reject) => {
        userApi.userList(optsLastName, makeCallback(resolve, reject));
      });
    };

    let firstTime = true;
    const nextPageKeyword = "offset=";
    let firstNameFinished = false;
    let lastNameFinished = false;

    do {
      let nextFirstName;
      let searchResultByFirstName;
      let nextLastName;
      let searchResultByLastName;
      if (firstTime || !firstNameFinished) {
        const [responseFirstName] = yield call(getSearchPeopleResultByFirstName);
        nextFirstName = responseFirstName.body.next;
        searchResultByFirstName = responseFirstName.body.results;
        if (nextFirstName && nextFirstName.indexOf(nextPageKeyword) !== -1) {
          const nextNumber = nextFirstName.substring(
            nextFirstName.indexOf(nextPageKeyword) + nextPageKeyword.length);
          if (!Number.isNaN(nextNumber)) {
            optsFirstName.offset = nextNumber;
          }
        }
      }

      if (firstTime || !lastNameFinished) {
        const [responseLastName] = yield call(getSearchPeopleResultByLastName);
        nextLastName = responseLastName.body.next;
        searchResultByLastName = responseLastName.body.results;
        if (nextLastName && nextLastName.indexOf(nextPageKeyword) !== -1) {
          const nextNumber = nextLastName.substring(
            nextLastName.indexOf(nextPageKeyword) + nextPageKeyword.length);
          if (!Number.isNaN(nextNumber)) {
            optsLastName.offset = nextNumber;
          }
        }
      }

      let searchResult;
      if (searchResultByFirstName && searchResultByLastName) {
        searchResult = searchResultByFirstName.concat(searchResultByLastName);
      } else if (searchResultByFirstName) {
        searchResult = searchResultByFirstName;
      } else {
        searchResult = searchResultByLastName;
      }

      firstNameFinished = !nextFirstName;
      lastNameFinished = !nextLastName;
      if (firstTime) {
        firstTime = false;
      }
      yield put(saveSearchPeopleResultAndDisplay(searchResult));
      yield put(setIfLeftPanelMakingSearchRequest(false));
      yield put(toggleLoadingChatsState(false));
      yield take("LOAD_MORE_PEOPLE");
      yield put(toggleLoadingChatsState(true));
    } while (!firstNameFinished || !lastNameFinished);
  } catch([error, response]) {
    // TODO
  } finally {
    yield put(setIfLeftPanelMakingSearchRequest(false));
  }
});

const loadMyChatOrClassWorker = worker("loadMyChatOrClass", function*({id, ifClass}) {
  if (ifClass) {
    let thisClass = yield select(getClass(id));
    if (thisClass) {
      yield put(deleteClass(id));
    }
    thisClass = yield select(getClassOrChatSearchResult(id));
    yield put.resolve(addClass(thisClass));
    yield put(changeIfShowingClasses(true));
  } else {
    let thisChat = yield select(getChat(id));
    if (thisChat) {
      yield put(deleteChat(id));
    }
    thisChat = yield select(getClassOrChatSearchResult(id));
    yield put.resolve(addChat(thisChat));
    yield put(changeIfShowingClasses(false));
  }
  // Immediately switch to the new chat
  yield put(startSearchFunction(false));
  yield put(changeSearchMode("mine"));
  yield put(requestLoadChat(id, null, false));
  // Close the creation UI
  yield put(openRightPanel());
});

const addUserToNewChatOrClassWorker = worker("addMyselfToChatOrClass", function*({chatId}) {
  const chatList = [chatId];
  const me = yield select(getCurrentUser);
  const users = [me.id];

  const createChatUserPostSerializer = new EduchatApi.ChatUserPostSerializer();
  createChatUserPostSerializer.user = users;
  createChatUserPostSerializer.chat = chatList;
  const addUserToNewChatOpts = {
    "chatUserPostSerializer": createChatUserPostSerializer
  };

  const addUserToThisChatOrClass = function() {
    return new Promise((resolve, reject) => {
      chatUserApi.chatUserCreate(addUserToNewChatOpts, makeCallback(resolve, reject));
    });
  };

  const [addUserToChatOrClassResonse] = yield call(addUserToThisChatOrClass);
  const newChatWithUser = addUserToChatOrClassResonse.body.results;
  const newChat = newChatWithUser[0].chat;
  if (newChat.is_class) {
    yield put(changeIfShowingClasses(true));
    yield put.resolve(addClass(newChat));
    const currentClassesTotalNumber = yield select(getCurrentClassesTotalNumber);
    yield put(updateTotalClassesNumber(currentClassesTotalNumber + 1));
  } else {
    yield put(changeIfShowingClasses(false));
    yield put.resolve(addChat(newChat));
    const currentChatsTotalNumber = yield select(getCurrentChatsTotalNumber);
    yield put(updateTotalChatsNumber(currentChatsTotalNumber + 1));
  }
  yield put(startSearchFunction(false));
  yield put(changeSearchMode("mine"));
  yield put.resolve(startLoadChat(newChat.id, null));
  yield put(requestLoadChat(newChat.id, null, false));
  // Close the creation UI
  yield put(openRightPanel());
});

export default function*() {
  yield takeLatest("SEARCH_CHAT_BY_NAME", searchChatByNameWorker);
  yield takeLatest("SEARCH_NEW_CHAT_BY_NAME", searchNewChatByNameWorker);
  yield takeLatest("LOAD_THIS_CHAT_OR_CLASS_IN_THE_LEFT_PANEL", loadMyChatOrClassWorker);
  yield takeLatest("SEARCH_PEOPLE_BY_NAME", searchPeopleByNameWorker);
  yield takeLatest("JOIN_NEW_CHAT_OR_CLASS", addUserToNewChatOrClassWorker);
}
