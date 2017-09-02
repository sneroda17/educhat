import {put, call, takeLatest} from "redux-saga/effects";

import {
  setInviteSuggestionList,
  // loadInviteSuggestionListPage,
  displayInviteListErrorMessage,
  updateInviteListErrorMessage,
  closeInviteSuggestionList
} from "../../actions/ui/right-panel";
import {updateChat} from "../../actions/chats";
import {invite, deleteUser} from "../../actions/active-chat";
// import {setError} from "../../actions/errors";
import worker from "../worker";
import EduchatApi from "educhat_api_alpha";

const showInviteListErrorMessageWorker =
 worker("showInviteListErrorMessage", function*(errorMessage) {
   yield put(updateInviteListErrorMessage(errorMessage.errorType));
   yield put(displayInviteListErrorMessage());
 });

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const getInviteSuggestionListApi = new EduchatApi.UserApi();

const refreshInviteSuggestionListWorker =
  worker("refreshInviteSuggestionList", function*({input}) {
    if (!input || input.trim().length === 0) {
      yield put(closeInviteSuggestionList());
      return;
    }
    // variable declarations
    const emailList = input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const newName = input.trim();
    let authEmail = "";
    let hasFirstAndLast = false;
    let responseFinal = [];
    const opts = {};
    const opts2 = {};
    // if the input is a valid email
    if (emailList) {
      authEmail = input;
      opts.authEmail = authEmail;
    } else {
      // if the input is only one word
      if (newName.indexOf(" ") === -1) {
        opts.firstNameIstartswith = newName;
        opts2.lastNameIcontains = newName;
      } else {
        // if the input has a space (is two words)
        const [firstName, lastName] = newName.split(" ", 2);
        opts.firstNameIstartswith = firstName;
        opts.lastNameIcontains = lastName;
        hasFirstAndLast = true;
      }
    }

    // this GET API call will always be invoked
    // if there are two words (first and last), this is the only API call invoked
    const getInviteSuggestionList = function() {
      return new Promise((resolve, reject) => {
        getInviteSuggestionListApi.userList(opts, makeCallback(resolve, reject));
      });
    };
    // const [response] = yield call(getInviteSuggestionList);

    // if there is only one word,
    //  must search for first and last name so we do another API call for both parameters
    if (!emailList && !hasFirstAndLast) {
      const getInviteSuggestionList2 = function() {
        return new Promise((resolve, reject) => {
          getInviteSuggestionListApi.userList(opts2, makeCallback(resolve, reject));
        });
      };
      const [[response], [response2]] = yield [
        call(getInviteSuggestionList),
        call(getInviteSuggestionList2)
      ];
      // const [response2] = yield call(getInviteSuggestionList2);
      // combines responses for both API calls
      const idSet = new Set();
      if (response.body.results) {
        const arrayLength = response.body.results.length;
        for (let i = 0; i < arrayLength; i++) {
          idSet.add(response.body.results[i].id);
          responseFinal.push(response.body.results[i]);
        }
      }

      if (response2.body.results) {
        const arrayLength = response2.body.results.length;
        for (let i = 0; i < arrayLength; i++) {
          if (!idSet.has(response2.body.results[i].id)) {
            idSet.add(response2.body.results[i].id);
            responseFinal.push(response2.body.results[i]);
          }
        }
      }
    } else{
      const [response] = yield call(getInviteSuggestionList);
      responseFinal = response.body.results;
    }
    // if any of the parameters are not empty
    yield put.resolve(setInviteSuggestionList(responseFinal));
  });

export default function*() {
  yield takeLatest("REFRESH_INVITE_SUGGESTION_LIST", refreshInviteSuggestionListWorker);
  yield takeLatest("SHOW_INVITE_LIST_ERROR_MESSAGE", showInviteListErrorMessageWorker);
  // yield takeLatest("TOGGLE_ASSIGN_ADMIN_DIALOG", assignAdminWorker);
}
