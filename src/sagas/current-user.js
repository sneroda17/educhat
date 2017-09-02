// @flow

import {
  // Put takes an action object and dispatches it to the Redux store
  // (and therefore also to any sagas listening for it).
  // This is a non-blocking effect.
  // If you want to block the saga until the effect has been completely processed,
  // call put.resolve instead.
  put,

  // Call takes a function, or an array of form [receiver, function]
  // (the receiver is the value of `this` inside the function),
  // followed by any number of additional arguments to pass to the function.
  // It then performs the described function call and passes back in its return value.
  // If the function returns a Promise, it waits on the Promise.
  // If the function is a generator, it treats it as a saga (processes yield values as effects).
  // This effect is blocking. If you want to call a function non-blocking, use fork.
  call,

  // Select takes a selector function. This function is called similarly to the first argument to
  // @connect: it is called with the top-level Redux state. Whatever the selector returns is
  // returned to the saga. Select is a blocking effect.
  select,

  // Take is the core effect of sagas. It usually takes an action name. It can take other arguments,
  // but I've never needed them (see the actual docs for those). Take blocks the saga until an
  // action with that name is dispatched. Then it returns the action to the saga.
  take,

  // Fork is like call, but it spawns a non blocking attached Task. Attached means that:
  // a) the saga that forked will wait for the task to return before returning itself,
  // b) errors from the forked task will propagate to the parent.
  // To create a detached task, use spawn.
  // Fork returns a Task object that can be used to cancel the task, among other uses.
  fork,

  // TakeLatest takes the same argument as take, followed by a generator,
  // and forks a Task that watches for the given action.
  // When it sees that action, it forks an instance of the given generator, calling it with the
  // action.
  // If it sees another action of the same type while the last one is still being processed,
  // it cancels the existing task.
  // TakeEvery is like this, but without the cancelling (it can run multiple copies at once).
  // These two effects are useful for simple cases and provide functionality similar to thunks.
  takeLatest,

  // Cancel takes a Task object and cancels it. It is non-blocking.
  // cancel,

  // Race takes an object of effects in the form {key1: effect1, key2: effect2, ...}
  // It returns an object of the form {winningKey: winningEffect},
  // where winningEffect is the return value of the first effect that returned,
  // and winningKey is its key from the input object.
  // Obviously, for this to make sense, all the effects you pass in should be blocking.
  race
} from "redux-saga/effects";
import {browserHistory} from "react-router";
import {
  loginSuccess,
  changeEmail,
  changePassword,
  logoutSuccess,
  startUploadingPicture,
  finishedUploadPicture,
  updateUserAccountInfo,
  // changeAccountInfo,
  setSchoolSuggestionList,
  closeSchoolSuggestionList,
  setDepartmentSuggestionList,
  closeDepartmentSuggestionList,
  isLoggingIn,
  updateLeftPanelThumbnail
} from "../actions/current-user";
import {setError, deleteError} from "../actions/errors";
import {toggleLoginPopup} from "../actions/ui/static-pages";
import {
  signupSuccess,
  setnewAccountError,
  sendEmailError,
  changeIfRequestSendingEmail,
  setHasResetPassword
} from "../actions/ui/onboarding";

import {
  addUser,
  addNewTagsSuccessfully
  // changeYearOfGraduation
  // addNewAreaOfStudySuccessfully,
  // changeFirstName
} from "../actions/users";

import {getCurrentUser, getProfileUserData} from "./selectors";
import clearRememberedUser from "../helpers/clear-remembered-user";
import worker from "./worker";
import {setStorageItem} from "../helpers/storage";
import {
  updateTagsInMainPanelUserData,
  updateAreaOfStudyInMainPanelUserData,
  updateGraduationYearInMainPanelUserData,
  setUserProfilePopupData,
  refreshTags,
  refreshAreasOfStudy
} from "../actions/ui/main-panel";
import EduchatApi from "educhat_api_alpha";
import {getFireBaseToken} from "../helpers/notifications";

const makeCallback = function(resolve, reject) {
  return function(error, data, response) {
    if (error) {
      reject([error, response]);
    } else {
      resolve([response]);
    }
  };
};

const loginAndOutApi = new EduchatApi.ApiApi();
const userApi = new EduchatApi.UserApi();
const passwordApi = new EduchatApi.PasswordApi();
const tagApi = new EduchatApi.TagApi();
const fileApi = new EduchatApi.FileApi();
const getUniversityApi = new EduchatApi.InstitutionApi();

// This saga handles the entire authentication cycle, including opening/closing socket connections.
// Because it's such a great example of powerful sagas can be,
// and also because it's more complex because of that, I've heavily commented it as a learning aid.
// To compliment this aid, I've commented all the effect imports above so you don't have to find an
// API guide
function* authSaga() {
  while (true) {
    // Skip the login phase if we have a remembered user
    const currentUser = yield select(getCurrentUser);
    if (!currentUser.isLoggedIn) {
      // Wait for either a LOGIN action (requesting to login)
      // or for a LOGIN_SUCCESS, which could also be called by creating a new account
      const {loginRequested} = yield race({
        loginRequested: take("LOGIN"),
        loginSucceeded: take("LOGIN_SUCCESS")
      });
      // In either case, we should clear any stored login error
      yield put(deleteError("login"));

      // But only try to login if it still needs to be done
      if (loginRequested) {
        const {email, password, wantsRemembered} = yield select(getCurrentUser);

        // If the user did something wrong, store an error and restart the loop to wait for the user
        // to click login again
        if (!email || !password) {
          yield put(setError("login", {
            text: "Both email and password are required!"
          }));
          continue;
        }
        const firebasePushToken = yield call(getFireBaseToken);
        const loginData = new EduchatApi.LoginInput();
        loginData.username = email;
        loginData.password = password;
        loginData.platform = "api";
        loginData.push_token = firebasePushToken;
        const opts = {
          "loginInput": loginData // {LoginInput}
        };

        // use the helper function
        const getLogin = function() {
          return new Promise((resolve, reject) => {
            loginAndOutApi.apiLoginCreate(opts, makeCallback(resolve, reject));
          });
        };
        yield put(isLoggingIn(true));
        try {
          const [response] = yield call(getLogin);
          const {results: {user, token}} = JSON.parse(response.text);
          const defaultClient = EduchatApi.ApiClient.instance;
          // Configure API key authorization: Token
          const Token = defaultClient.authentications.Token;
          Token.apiKey = token;
          Token.apiKeyPrefix = "Token";
          yield put(addUser(user));

          const opts = {"id": user.university};
          const getUniversities = function() {
            return new Promise((resolve, reject) => {
              getUniversityApi.institutionUniversityList(opts, makeCallback(resolve, reject));
            });
          };
          const [universityResponse] = yield call(getUniversities);

          const universityName = universityResponse.body.results[0].name;

          user.universityName = universityName;

          const optsForSchool = {"id": user.school};
          const getSchools = function() {
            return new Promise((resolve, reject) => {
              getUniversityApi.institutionSchoolList(optsForSchool, makeCallback(resolve, reject));
            });
          };
          const [schoolResponse] = yield call(getSchools);

          const schoolName = schoolResponse.body.results[0].name;

          user.schoolName = schoolName;

          const optsForDepartment = {"id": user.department};
          const getDepartments = function() {
            return new Promise((resolve, reject) => {
              getUniversityApi.institutionDepartmentList(
                optsForDepartment, makeCallback(resolve, reject));
            });
          };
          const [departmentResponse] = yield call(getDepartments);

          if (user.department === null) {
            yield put(updateUserAccountInfo(user.first_name, user.last_name, user.email,
              user.university, universityName,
              user.type, user.school, schoolName, null,
              "", user.year_of_graduation, user.id, false, false));
            user.departmentName = "";
          } else {
            const departmentName = departmentResponse.body.results[0].name;
            yield put(updateUserAccountInfo(user.first_name, user.last_name, user.email,
              user.university, universityName,
              user.type, user.school, schoolName, user.department,
              departmentName, user.year_of_graduation, user.id, false, false));
            user.departmentName = departmentName;
          }

          yield call(setStorageItem, "user", JSON.stringify(user));
          yield call(setStorageItem, "token", token);
          yield call(setStorageItem, "wantsRemembered", wantsRemembered);
          yield call([browserHistory, browserHistory.push], "/");


          yield put(loginSuccess(user.id));
          yield put(toggleLoginPopup());
          yield put(changePassword(""));
        } catch ([err, response]) {
          if (err.status >= 500) {
            yield put(setError("login",
              {text:
"It looks like the server did something wrong. Please come back later when we fixed it. Thanks."}));
          } else if (err.status >= 400 && err.status < 500) {
            const wrongCredentialErrorMessage = JSON.parse(response.text).non_field_errors;
            const notAuthorizedActionErrorMessage = JSON.parse(response.text).alert;
            if (wrongCredentialErrorMessage) {
              yield put(setError("login", {text: wrongCredentialErrorMessage[0]}));
            } else if (notAuthorizedActionErrorMessage) {
              yield put(setError("login", {text: notAuthorizedActionErrorMessage}));
            }
          }
          continue;
        } finally {
          yield put(isLoggingIn(false));
        }
      }
    }

    // If we've gotten this far, then we're logged in one way or another.
    // Now we check whether this is the first time we've gotten here without logging out,
    // in which case we'll need to establish the socket connection
    /* if (!socket) {
      socket = yield call(connectSocket);

      // Saga effects work well with arrays.
      // We build an array of calls to the listen function (which creates a generator that
      // listens to the event with the given handler).
      // This yield returns an array of the return values (the resulting generators in this case).
      const listeners = yield [
        call(listen, socket, "message received", handlers.messageReceived),
        call(listen, socket, "user invited to new chat", handlers.userInvitedToNewChat),
        call(listen, socket, "error", handlers.error)
      ];
      // Then we can use Array#map to quickly fork all of them into Tasks
      // which get returned in a new array that we save to cancel them later
      tasks = yield listeners.map(fork);
    } */

    // Now we're fully logged in, so we wait for a LOGOUT action,
    // which may be forced if it's due to a 401
    // const {force: forceLogout} = yield take("LOGOUT");
    yield take("LOGOUT");
    yield put(deleteError("logout"));
    try {
      // Cancel all the forked tasks, close the socket, and null out the variables for the next time
      // yield cancel(...tasks);// don't use yield tasks.map(cancel)

      // Log out the user
      if (localStorage.getItem("token")) {
        const getLogout = function() {
          return new Promise((resolve, reject) => {
            loginAndOutApi.apiLogoutCreate(makeCallback(resolve, reject));
          });
        };
        yield call(getLogout);
      }
    } catch (err) {
      // We may be calling logout because the token is invalid.
      // This prevents that from keeping us from clearing it.
      // if (forceLogout || err === AUTH_ERROR) {
      //   yield call(clearRememberedUser);
      //   yield put(logoutSuccess());
      // } else yield put(setError("logout", err));
      yield call(clearRememberedUser);
      yield put(logoutSuccess());
    } finally {
      yield call(clearRememberedUser);
      // Refresh the page to clear all the user information
      location.reload();
    }
  }
}

const signUpWorker =
  worker("signUp", function*({accountType, email, password, firstName, lastName, university}) {
    try {
      const signUpData = new EduchatApi.APIViewUserSerializer();
      signUpData.first_name = firstName;
      signUpData.last_name = lastName;
      signUpData.email = email;
      signUpData.password = password;
      signUpData.university = university;
      signUpData.type = accountType;
      const opts = {
        "aPIViewUserSerializer": signUpData // {LoginInput}
      };

      // use the helper function
      const getSignUp = function() {
        return new Promise((resolve, reject) => {
          userApi.userSignupCreate(opts, makeCallback(resolve, reject));
        });
      };
      // yield call(ecapi.user.create, email, password, firstName, lastName,
      //   university, {type: accountType});
      yield call(getSignUp);
      yield put.resolve(changeEmail(email));
      yield put.resolve(signupSuccess());
      // yield call([browserHistory, browserHistory.push], "/");
    } catch ([error, response]) {
      const err = response.body.results;
      if (err.slice(0, 19) === "duplicate key value") {
        yield put(setnewAccountError("Email already Taken"));
      } else if (err.slice(0, 17) === "{'email': ['Enter" || err.slice(0, 11) === "{'username'") {
        yield put(setnewAccountError("Please put a valid Email"));
      }
    }
  });

// change account's info
const changeAccountInfoWorker =
  worker("changeAccountInfo", function*({firstName, lastName, email, university,
    accountType, school, department, yearOfGraduation, id}) {
    try {
      const userUpdateSerializerData = new EduchatApi.UserUpdateSerializer();
      if (firstName) userUpdateSerializerData.first_name = firstName;
      if (lastName) userUpdateSerializerData.last_name = lastName;
      // email is not allowed to be updated
      // university is not allowed to be updated
      if (accountType) userUpdateSerializerData.type = accountType;
      if (school) userUpdateSerializerData.school = school;
      if (department) userUpdateSerializerData.department = department;
      if (department === 0) {
        userUpdateSerializerData.department = null;
      }

      if (yearOfGraduation) userUpdateSerializerData.year_of_graduation = yearOfGraduation;


      const userUpdateSerializerOpts = {
        "userUpdateSerializer": userUpdateSerializerData
      };

      const userPartialUpdate = function() {
        return new Promise((resolve, reject) => {
          userApi.userPartialUpdate(id, userUpdateSerializerOpts, makeCallback(resolve, reject));
        });
      };

      const [response] = yield call(userPartialUpdate);
      // const user = yield call(ecapi.user.edit, id, firstName, lastName, email,
      //   university, accountType, school, department,
      //   yearOfGraduation);
      const user = response.body.results;
      const opts = {"id": user.university};
      const getUniversities = function() {
        return new Promise((resolve, reject) => {
          getUniversityApi.institutionUniversityList(opts, makeCallback(resolve, reject));
        });
      };
      const [universityResponse] = yield call(getUniversities);

      const universityName = universityResponse.body.results[0].name;

      user.universityName = universityName;

      const optsForSchool = {"id": user.school};
      const getSchools = function() {
        return new Promise((resolve, reject) => {
          getUniversityApi.institutionSchoolList(optsForSchool, makeCallback(resolve, reject));
        });
      };
      const [schoolResponse] = yield call(getSchools);

      const schoolName = schoolResponse.body.results[0].name;

      user.schoolName = schoolName;

      const optsForDepartment = {"id": department};
      const getDepartments = function() {
        return new Promise((resolve, reject) => {
          getUniversityApi.institutionDepartmentList(
            optsForDepartment, makeCallback(resolve, reject));
        });
      };
      const [departmentResponse] = yield call(getDepartments);

      if (department === 0) {
        yield put(updateUserAccountInfo(user.first_name, user.last_name, user.email,
          user.university, universityName,
          user.type, user.school, schoolName, null,
          "", user.year_of_graduation, user.id, false, false));
        user.departmentName = "";
      } else {
        const departmentName = departmentResponse.body.results[0].name;
        yield put(updateUserAccountInfo(user.first_name, user.last_name, user.email,
          user.university, universityName,
          user.type, user.school, schoolName, user.department,
          departmentName, user.year_of_graduation, user.id, false, false));
        user.departmentName = departmentName;
      }

      yield call(setStorageItem, "user", JSON.stringify(user));

      yield call([browserHistory, browserHistory.push], "/");
    } catch (error) {
      console.error(error);
      console.error("There is an editing error");
    }
  });

const forgotPasswordRequestWorker = worker("forgotPasswordRequest", function*({email}) {
  try {
    const forgotPasswordRequestData = new EduchatApi.RequestPassword();
    forgotPasswordRequestData.email = email;

    const requestPasswordOpts = {
      "requestPassword": forgotPasswordRequestData
    };

    // use the helper function
    const forgotPasswordRequest = function() {
      return new Promise((resolve, reject) => {
        passwordApi.passwordRequestCreate(requestPasswordOpts, makeCallback(resolve, reject));
      });
    };

    yield call(forgotPasswordRequest);

    // yield call(ecapi.user.forgotPasswordRequest, email);
    yield put(changeIfRequestSendingEmail(true));
  } catch ([error, response]) {
    yield put(sendEmailError("Please put a valid Email"));
  }
});

const resetPasswordWorker = worker("resetPassword", function*({key, password}) {
  const forgotPasswordResetData = new EduchatApi.PasswordReset();
  forgotPasswordResetData.key = key;
  forgotPasswordResetData.password = password;

  const resetPasswordOpts = {
    "passwordReset": forgotPasswordResetData
  };

  // use the helper function
  const forgotPasswordReset = function() {
    return new Promise((resolve, reject) => {
      passwordApi.passwordResetCreate(resetPasswordOpts, makeCallback(resolve, reject));
    });
  };

  yield call(forgotPasswordReset);
  yield put(setHasResetPassword(true));
  // yield call(ecapi.user.forgotPasswordReset, key, password);
});

const uploadProfilePictureWorker = worker("uploadProfilePicture", function*({picture, name}) {
  yield put(startUploadingPicture());
  const user = yield select(getProfileUserData);

  const userProfilePictureOpts = {
    "upload": picture
  };

  const uploadProfilePicture = function() {
    return new Promise((resolve, reject) => {
      fileApi.fileCreate(name, userProfilePictureOpts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(uploadProfilePicture);
  const newProfilePicture = response.body.results;

  // const newProfilePicture = yield call(ecapi.file.create, picture, name);
  // yield call(ecapi.user.edit, {id: user.id, picture_file: newProfilePicture.results.id});

  const userUpdateSerializerData = new EduchatApi.UserUpdateSerializer();
  userUpdateSerializerData.picture_file = newProfilePicture.id;

  const userUpdateSerializerOpts = {
    "userUpdateSerializer": userUpdateSerializerData
  };

  const userPartialUpdate = function() {
    return new Promise((resolve, reject) => {
      userApi.userPartialUpdate(user.id, userUpdateSerializerOpts, makeCallback(resolve, reject));
    });
  };

  yield call(userPartialUpdate);
  yield put(updateLeftPanelThumbnail(user.id, newProfilePicture));
  yield put(finishedUploadPicture(newProfilePicture));
});


const addNewTagToUserProfile = worker("addNewTags", function*({tag, id}) {
  const userTagSerializerData = new EduchatApi.UserTagSerializer();
  userTagSerializerData.user = id;
  userTagSerializerData.tag_str = tag;
  const userTagOpts = {
    "userTagSerializer": userTagSerializerData
  };

  // use the helper function
  const addTagToUser = function() {
    return new Promise((resolve, reject) => {
      tagApi.tagUserCreate(userTagOpts, makeCallback(resolve, reject));
    });
  };

  const [response] = yield call(addTagToUser);
  const result = response.body.results;
  // const result = yield call(ecapi.tag.addTag, id, tag);

  const tagListOpts = {"tag": result.tag_str};

  const getTagId = function() {
    return new Promise((resolve, reject) => {
      tagApi.tagList(tagListOpts, makeCallback(resolve, reject));
    });
  };


  const [idResponse] = yield call(getTagId);
  const results = idResponse.body.results[0];
  const newTag = {id: results.id, tag: results.tag};
  yield put(addNewTagsSuccessfully(id, newTag.id, newTag.tag));
  yield put(updateTagsInMainPanelUserData(newTag));
});

const addNewAreaOfStudyToUserProfile = worker("addNewAreaOfStudy", function*({id, tag, areas}) {
  // const result = yield call(ecapi.tag.addTag, id, tag);
  // const newTagId = result.tag;
  // yield put(addNewAreaOfStudySuccessfully(id, newTagId, tag));
  // const newTag = {id: newTagId, tag: tag};
  // yield put(updateAreaOfStudyInMainPanelUserData(newTag));
  // const user = yield select(getProfileUserData);
  try {
    const userUpdateSerializerData = new EduchatApi.UserUpdateSerializer();
    userUpdateSerializerData.areas_of_study = [...areas, tag];
    const userUpdateSerializerOpts = {
      "userUpdateSerializer": userUpdateSerializerData
    };

    const userPartialUpdate = function() {
      return new Promise((resolve, reject) => {
        userApi.userPartialUpdate(id, userUpdateSerializerOpts, makeCallback(resolve, reject));
      });
    };

    yield call(userPartialUpdate);
    yield put(updateAreaOfStudyInMainPanelUserData(tag));
  } catch (error) {
    console.error(error);
    console.error("There is an editing error");
  }
});

const deleteTagWorker = worker("deleteTag", function*({id, tag}) {
  try {
    const tagUserDelete = function() {
      return new Promise((resolve, reject) => {
        tagApi.tagUserDelete(tag.id, id, makeCallback(resolve, reject));
      });
    };

    yield call(tagUserDelete);
    yield put(refreshTags(tag));
  } catch(error) {
    console.error(error);
  }
});

const deleteAreaOfStudyWorker = worker("deleteAreaOfStudy", function *({id, tag, areas}) {
  try {
    const userUpdateSerializerData = new EduchatApi.UserUpdateSerializer();
    userUpdateSerializerData.areas_of_study = areas.filter(area => area !== tag);
    const userUpdateSerializerOpts = {
      "userUpdateSerializer": userUpdateSerializerData
    };

    const userPartialUpdate = function() {
      return new Promise((resolve, reject) => {
        userApi.userPartialUpdate(id, userUpdateSerializerOpts, makeCallback(resolve, reject));
      });
    };

    yield call(userPartialUpdate);
    yield put(refreshAreasOfStudy(tag));
  } catch (error) {
    console.error(error);
    console.error("There is an editing error");
  }
});

const refreshSchoolSuggestionListWorker =
  worker("refreshSchoolSuggestionList", function*({id}) {
    const opts = {"universityId": id};
    const getSchools = function() {
      return new Promise((resolve, reject) => {
        getUniversityApi.institutionSchoolList(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(getSchools);
    const list = response.body.results;
    if (list.length) {
      yield put(setSchoolSuggestionList(list));
    } else {
      yield put(closeSchoolSuggestionList());
    }
  });

const refreshDepartmentSuggestionListWorker =
  worker("refreshDepartmentSuggestionList", function*({id}) {
    const opts = {"schoolId": id};
    const getDepartments = function() {
      return new Promise((resolve, reject) => {
        getUniversityApi.institutionDepartmentList(opts, makeCallback(resolve, reject));
      });
    };

    const [response] = yield call(getDepartments);
    const list = response.body.results;
    if (list.length !== 0) {
      yield put(setDepartmentSuggestionList(list));
    } else {
      yield put(closeDepartmentSuggestionList());
    }
  });

const changeGraduationYearWorker =
  worker("changeGraduationYear", function*({id, yearOfGraduation}) {
    const userUpdateSerializerData = new EduchatApi.UserUpdateSerializer();
    if (yearOfGraduation) userUpdateSerializerData.year_of_graduation = yearOfGraduation;

    const userUpdateSerializerOpts = {
      "userUpdateSerializer": userUpdateSerializerData
    };

    const userPartialUpdate = function() {
      return new Promise((resolve, reject) => {
        userApi.userPartialUpdate(id, userUpdateSerializerOpts, makeCallback(resolve, reject));
      });
    };

    yield call(userPartialUpdate);
    yield put(updateGraduationYearInMainPanelUserData(yearOfGraduation));
  });

const getMyInfoWorker = worker("getMyInfo", function*() {
  const getUserData = function() {
    return new Promise((resolve, reject) => {
      userApi.userMeList(makeCallback(resolve, reject));
    });
  };
  const [response] = yield call(getUserData);
  yield put(setUserProfilePopupData([response.body.results]));
});

export default function*() {
  yield fork(authSaga);
  yield takeLatest("SIGN_UP", signUpWorker);
  yield takeLatest("CHANGE_ACCOUNT_INFO", changeAccountInfoWorker);
  yield takeLatest("FORGOT_PASSWORD_REQUEST", forgotPasswordRequestWorker);
  yield takeLatest("RESET_PASSWORD", resetPasswordWorker);
  yield takeLatest("UPLOAD_PROFILE_PICTURE", uploadProfilePictureWorker);
  yield takeLatest("ADD_NEW_TAGS", addNewTagToUserProfile);
  yield takeLatest("DELETE_TAG", deleteTagWorker);
  yield takeLatest("DELETE_AREA_OF_STUDY", deleteAreaOfStudyWorker);
  yield takeLatest("REFRESH_SCHOOL_SUGGESTION_LIST", refreshSchoolSuggestionListWorker);
  yield takeLatest("REFRESH_DEPARTMENT_SUGGESTION_LIST", refreshDepartmentSuggestionListWorker);
  yield takeLatest("ADD_NEW_AREA_OF_STUDY", addNewAreaOfStudyToUserProfile);
  yield takeLatest("CHANGE_GRAD_YEAR", changeGraduationYearWorker);
  yield takeLatest("GET_MY_INFO", getMyInfoWorker);
}
