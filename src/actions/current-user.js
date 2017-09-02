// @flow

export const changeEmail = (email: string) => ({type: "CHANGE_EMAIL", email});

export const changePassword = (password: string) => ({type: "CHANGE_PASSWORD", password});

export const toggleWantsRemembered = () => ({type: "TOGGLE_WANTS_REMEMBERED"});

export const login = () => ({type: "LOGIN"});

export const loginSuccess = (userId: number) => ({type: "LOGIN_SUCCESS", userId});

export const setCreating = (creating: (string|boolean)) => ({type: "SET_CREATING", creating});

export const logout = (force = false) => ({type: "LOGOUT", force});

export const logoutSuccess = () => ({type: "LOGOUT_SUCCESS"});

export const isLoggingIn = (isLoginProgress) => ({type: "SET_LOGGING_IN", isLoginProgress});

export const signUp = (accountType, email, password, firstName, lastName, university) =>
  ({type: "SIGN_UP", accountType, email, password, firstName, lastName, university});

// Used for change account info
export const changeAccountInfo =
  (firstName, lastName, email, university, accountType,
  school, department, yearOfGraduation, id) =>
    ({
      type: "CHANGE_ACCOUNT_INFO",
      firstName,
      lastName,
      email,
      university,
      accountType,
      school,
      department,
      yearOfGraduation,
      id
    });

export const updateUserAccountInfo =
(firstName, lastName, email, university, universityName, accountType,
  school, schoolName, department, departmentName, yearOfGraduation, id) =>
  ({
    type: "UPDATE_USER_ACCOUNT_INFO",
    firstName,
    lastName,
    email,
    university,
    universityName,
    accountType,
    school,
    schoolName,
    department,
    departmentName,
    yearOfGraduation,
    id
  });

export const requestPasswordChange = (email: string) => ({type: "FORGOT_PASSWORD_REQUEST", email});

export const resetPassword = (key: string, password: string) =>
  ({type: "RESET_PASSWORD", key, password});

export const startUploadingPicture = () => ({type: "START_UPLOADING_PICTURE"});

export const uploadProfilePicture = (picture, name) =>
  ({type: "UPLOAD_PROFILE_PICTURE", picture, name});

export const finishedUploadPicture = (picture) =>
  ({type: "FINISHED_UPLOAD_PICTURE", picture});

export const updateLeftPanelThumbnail = (id: number, picture) =>
  ({type: "UPDATE_LEFT_PANEL_THUMBNAIL", id, picture});

export const resetAccountSettingFlashMessageStatus = (hasMadeSuccessfulCall, hasMadeRequest) =>
  ({type: "RESET_ACCOUNT_SETTING_FLASH_MESSAGE_STATUS", hasMadeSuccessfulCall, hasMadeRequest});

export const hasMadeSuccessfulUserRequest = (hasMadeSuccessfulCall, hasMadeRequest) =>
  ({type: "HAS_MADE_SUCCESSFUL_USER_REQUEST", hasMadeSuccessfulCall, hasMadeRequest
  });

export const resetErrorMessage = () => ({type: "RESET_ERROR_MESSAGE"});

export const addNewTags = (id: number, tag: string) => ({type: "ADD_NEW_TAGS", id, tag});

export const addNewAreaOfStudy = (id: number, tag: string, areas: Array<String>) =>
  ({type: "ADD_NEW_AREA_OF_STUDY", id, tag, areas});

export const deleteTag = (id: number, tag: tag) => ({type: "DELETE_TAG", id, tag});

export const deleteAreaOfStudy = (id: number, tag: string, areas: Array<String>) =>
  ({type: "DELETE_AREA_OF_STUDY", id, tag, areas});

export const changeGraduationYear = (id: number, yearOfGraduation: number) =>
  ({type: "CHANGE_GRAD_YEAR", id, yearOfGraduation});

export const changeAreaOfStudy = (areaOfStudy: string) => ({type: "CHANGE_AREA_OF_STUDY"});

export const changeCurrentSessionExpired = () => ({type: "CHANGE_CURRENT_SESSION_EXPIRED"});

export const refreshSchoolSuggestionList = (id: number) =>
  ({type: "REFRESH_SCHOOL_SUGGESTION_LIST", id});

export const setSchoolSuggestionList = (list: Array<School>) =>
  ({type: "SET_SCHOOL_SUGGESTION_LIST", list});

export const closeSchoolSuggestionList = () => setSchoolSuggestionList(null);

export const refreshDepartmentSuggestionList = (id: number) =>
  ({type: "REFRESH_DEPARTMENT_SUGGESTION_LIST", id});

export const setDepartmentSuggestionList = (list: Array<Department>) =>
  ({type: "SET_DEPARTMENT_SUGGESTION_LIST", list});

export const closeDepartmentSuggestionList = () => setDepartmentSuggestionList(null);

export const getMyInfo = () => ({type: "GET_MY_INFO"});

