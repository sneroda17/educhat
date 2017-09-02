import {
  // put,
  call,
  // select,
  // take,
  // fork,
  // takeLatest,
  takeEvery
} from "redux-saga/effects";
import worker from "./worker";
import {sendFileHelper} from "./active-chat";

const uploadBotFile = worker("uploadBotFile",
  function*({file, title, extension, text, isQuestion}) {
    yield call(sendFileHelper, 3452, {file, title, extension, text, isQuestion});
  });

export default function*() {
  yield takeEvery("UPLOAD_BOT_FILE", uploadBotFile);
}
