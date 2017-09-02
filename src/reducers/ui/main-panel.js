// @flow

import ComplexRecord from "../../helpers/complex-record";
import User from "../../records/user";

const MainPanelState = ComplexRecord({
  // I don't know what this actually is, so I'm keeping it in the refactor
  mainHeaderType: "normal",
  // These two next properties could possibly
  // be factored out into their own state objects or otherwise moved
  botPanelActive: false,
  userProfilePopupData: null,
  currentChatMessageOffset: 0,
  newMessageReceived: false,
  questionModeActive: false,
  toggleRenderComment: false,
  isEverythingLoadedInMainPanel: false,
  isUploadingFile: false,
  uploadFileStatus: ""
}, {
  userProfilePopupData: User
});

export default function(state = new MainPanelState(), action: Object) {
  switch (action.type) {
    case "CHANGE_HEADER_TYPE":
      return state.set("mainHeaderType", action.headerType);
    case "TOGGLE_BOT_PANEL":
      return state.set("botPanelActive", !state.botPanelActive);
    case "SET_USER_PROFILE_POPUP_DATA":
      return state.set("userProfilePopupData", action.userData && new User(action.userData));
    case "FINISHED_UPLOAD_PICTURE":
      return state.setIn(["userProfilePopupData", "picture_file"], action.picture);
    case "UPDATE_TAGS_TO_USERDATA":
      return state.updateIn(["userProfilePopupData", "tags"], tags => tags.push(action.tag));
    case "UPDATE_AREA_OF_STUDY_TO_USERDATA":
      return state.updateIn(["userProfilePopupData", "areas_of_study"],
        areas => areas.push(action.tag));
    case "REFRESH_TAGS":
      return state.updateIn(["userProfilePopupData", "tags"],
      tags => tags.filter(tag => tag.id !== action.tag.id));
    case "REFRESH_AREAS_OF_STUDY":
      return state.updateIn(["userProfilePopupData", "areas_of_study"],
      areas => areas.filter(area => area !== action.tag));
    case "UPDATE_GRAD_YEAR_TO_USERDATA":
      return state.setIn(["userProfilePopupData", "year_of_graduation"], action.year);
    case "CHANGE_CURRENT_CHAT_MESSAGE_OFFSET":
      return state.set("currentChatMessageOffset", action.offset);
    case "CHANGE_NEW_MESSAGE_RECEIVED":
      return state.set("newMessageReceived", action.boolState);
    case "CHANGE_QUESTION_MODE_ACTIVE":
      return state.set("questionModeActive", action.boolState);
      // return state.set("questionModeActive", !state.questionModeActive);
    case "TOGGLE_RENDER_COMMENT":
      return state.set("toggleRenderComment", action.boolState);
    case "FINISHED_LOADING_EVERYTHING":
      return state.set("isEverythingLoadedInMainPanel", true);
    case "START_FILE_UPLOAD":
      return state.set("isUploadingFile", action.file);
    case "END_FILE_UPLOAD":
      return state.set("isUploadingFile", false);
    case "TELL_USER_FILE_UPLOAD_IS_DONE":
      return state.set("uploadFileStatus", action.done);
    default:
      return state;
  }
}
