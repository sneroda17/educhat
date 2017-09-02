// @flow

import {put, call, takeEvery, take, select} from "redux-saga/effects";

import {
  toggleClassCreationPending,
  changeIfShowingClasses,
  changeFirstTimeLoadingClasses,
  updateTotalClassesNumber,
  changeIfClassesTabIsReady
} from "../actions/ui/left-panel";
import {setCreating, changeCurrentSessionExpired} from "../actions/current-user";
import {requestLoadChat} from "../actions/active-chat";
import {addClass, loadClasses} from "../actions/classes";
import {setError, deleteError} from "../actions/errors";
import {resetClassName, resetClassCode} from "../actions/classes";
import {
  getIfLeftPanelShowingClasses,
  getCurrentClassesTotalNumber
} from "./selectors";
import worker from "./worker";
import EduchatApi from "educhat_api_alpha";


import {toggleLoadingChatsState} from "../actions/chats";
import {addUsers} from "../actions/users";

function* resetClassInfoWorker() {
  yield put(resetClassName());
  yield put(resetClassCode());
}

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
const fileApi = new EduchatApi.FileApi();


const createClassWorker = worker("createClass",
function*({className, classCode, ifSearchable, pictureObject}) {
  yield put(deleteError("createChat"));
  yield put(toggleClassCreationPending());

  // set these parameters regardless if there is a picture object or not
  const createClassDataSerializer = new EduchatApi.APIViewChatSerializer();
  createClassDataSerializer.name = className;
  createClassDataSerializer.is_class = true;
  createClassDataSerializer.parent = null;
  createClassDataSerializer.searchable = ifSearchable;
  createClassDataSerializer.is_bot = false;
  createClassDataSerializer.is_read_only = true;
  createClassDataSerializer.course_code = classCode;

  // if there is a picture object, upload the file then set picture parameter
  if (pictureObject !== null) {
    const chatProfilePictureOpts = {
      "upload": pictureObject
    };

    const uploadChatPicture = function() {
      return new Promise((resolve, reject) => {
        fileApi.fileCreate(className, chatProfilePictureOpts, makeCallback(resolve, reject));
      });
    };

    const [chatPictureResponse] = yield call(uploadChatPicture);
    const newProfilePicture = chatPictureResponse.body.results;
    createClassDataSerializer.picture_file = newProfilePicture.id;
  }

  const opts = {
    "aPIViewChatSerializer": createClassDataSerializer
  };

  // use the helper function
  const createNewChat = function() {
    return new Promise((resolve, reject) => {
      chatApi.chatCreate(opts, makeCallback(resolve, reject));
    });
  };

  try {
    const [response] = yield call(createNewChat);
    const newClass = response.body.results;

    // const newClass = yield call(ecapi.chat.create, className, true, null,
    //   {searchable: ifSearchable, is_read_only: "True", course_code: classCode});
    yield put(addClass(newClass));
    const currentClassesTotalNumber = yield select(getCurrentClassesTotalNumber);
    yield put(updateTotalClassesNumber(currentClassesTotalNumber + 1));
    // Immediately switch to the new chat
    yield put(requestLoadChat(newClass.id, null, false));
    yield put(setCreating(false));
    yield put(changeIfShowingClasses(true));
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
    yield put(toggleClassCreationPending());
  }
});


const loadClassesWorker = worker("loadAllClasses", function*() {
  try {
    const opts = {isClass: true};
    // use the helper function
    const getAllClasses = function() {
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
    do {
      const [response] = yield call(getAllClasses);
      const {count, next, results: {chats, users}} = JSON.parse(response.text);
      yield put(updateTotalClassesNumber(count));
      finished = !next;
      const ifLeftPanelShowingClasses = yield select(getIfLeftPanelShowingClasses);
      if (firstTime && ifLeftPanelShowingClasses) {
        if (chats.length !== 0) {
          yield put(requestLoadChat(chats[0].id, null, false));
        }
      }
      yield put(addUsers(users));
      yield put(loadClasses(chats));
      yield put(toggleLoadingChatsState(false));
      yield put(changeFirstTimeLoadingClasses());
      if (next && next.indexOf(nextPageKeyword) !== -1) {
        const nextNumber = next.substring(next.indexOf(nextPageKeyword) + nextPageKeyword.length);
        if (Number.isNaN(nextNumber)) {
          break;
        }
        opts.offset = nextNumber;
      } else {
        yield put(changeIfClassesTabIsReady(true));
        break;
      }
      if (firstTime) {
        firstTime = false;
        yield put(changeIfClassesTabIsReady(true));
      }
      yield take("LOAD_MORE_CLASSES");
      yield put(toggleLoadingChatsState(true));
    } while (!finished);
  } catch ([error, response]) {
    if (error.status === 401
      && (response.body.detail === "Invalid token."
      || response.body.detail === "Authentication credentials were not provided.")) {
      yield put(changeCurrentSessionExpired());
    }
    console.error("fail to get classes");
  }
});

export default function*() {
  yield takeEvery("REQUEST_LOAD_CLASSES", loadClassesWorker);
  yield takeEvery("CREATE_CLASS", createClassWorker);
  yield takeEvery("RESET_CLASS_INFORMATION", resetClassInfoWorker);
}
