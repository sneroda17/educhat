import {put, call, takeLatest, select} from "redux-saga/effects";

import {setUserProfilePopupData} from "../../actions/ui/main-panel";
import worker from "../worker";
import EduchatApi from "educhat_api_alpha";
import {
  getCurrentUser
} from "../selectors";

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const userApi = new EduchatApi.UserApi();

const openUserProfileWorker = worker("openUserProfile", function*({id}) {
  const currentUser = yield select(getCurrentUser);
  const opts = {"id": id};
  let getUserData;
  if (currentUser.id === id) {
    getUserData = function() {
      return new Promise((resolve, reject) => {
        userApi.userMeList(makeCallback(resolve, reject));
      });
    };
    const [response] = yield call(getUserData);
    yield put(setUserProfilePopupData([response.body.results]));
  } else {
    getUserData = function() {
      return new Promise((resolve, reject) => {
        userApi.userList(opts, makeCallback(resolve, reject));
      });
    };
    const [response] = yield call(getUserData);
    yield put(setUserProfilePopupData(response.body.results));
  }
});

export default function*() {
  yield takeLatest("OPEN_USER_PROFILE", openUserProfileWorker);
}
