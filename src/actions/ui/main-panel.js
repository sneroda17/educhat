// @flow

export const changeHeaderType = (headerType: string) => ({type: "CHANGE_HEADER_TYPE", headerType});

export const toggleBotPanel = () => ({type: "TOGGLE_BOT_PANEL"});

export const setUserProfilePopupData = (userList) => {
  const userData = userList && userList[0];
  return {type: "SET_USER_PROFILE_POPUP_DATA", userData};
};

export const openUserProfile = (id) => ({type: "OPEN_USER_PROFILE", id});

export const closeUserProfile = () => setUserProfilePopupData(null);

export const updateTagsInMainPanelUserData = (tag) => ({type: "UPDATE_TAGS_TO_USERDATA", tag});

export const updateAreaOfStudyInMainPanelUserData = (tag) =>
  ({type: "UPDATE_AREA_OF_STUDY_TO_USERDATA", tag});

export const updateGraduationYearInMainPanelUserData = (year) =>
  ({type: "UPDATE_GRAD_YEAR_TO_USERDATA", year});

export const refreshTags = (tag) =>
  ({type: "REFRESH_TAGS", tag});

export const refreshAreasOfStudy = (tag) =>
  ({type: "REFRESH_AREAS_OF_STUDY", tag});

export const changeCurrentChatMessageOffset = (offset) =>
  ({type: "CHANGE_CURRENT_CHAT_MESSAGE_OFFSET", offset});

export const changeNewMessageReceived = (boolState) =>
  ({type: "CHANGE_NEW_MESSAGE_RECEIVED", boolState});

export const changeQuestionModeActive = (boolState) =>
  ({type: "CHANGE_QUESTION_MODE_ACTIVE", boolState});
// export const changeQuestionModeActive = () => ({type: "CHANGE_QUESTION_MODE ACTIVE"});

export const toggleRenderComment = (boolState) =>
  ({type: "TOGGLE_RENDER_COMMENT", boolState});

export const finishedLoadingEverything = () => ({type: "FINISHED_LOADING_EVERYTHING"});

export const startFileUpload = (file) => ({type: "START_FILE_UPLOAD", file});

export const endFileUpload = () => ({type: "END_FILE_UPLOAD"});

export const tellUserFileUploadIsDone = (done) =>({type: "TELL_USER_FILE_UPLOAD_IS_DONE", done});
