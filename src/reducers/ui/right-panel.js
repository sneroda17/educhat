// @flow

import Immutable from "immutable";
import ComplexRecord from "../../helpers/complex-record";
import User from "../../records/user";

const RightPanelState = ComplexRecord({
  rightPanelActive: false,
  activePanel: "user",
  inviteInterfaceActive: false,
  inviteSuggestionList: null,
  inviteList: Immutable.OrderedSet,
  inviteUserError: false,
  inviteUserErrorMessage: "Feel free to add anyone!",
  inviteUserProcessing: false,
  inviteBoxActive: false,
  assignAdminDialogActive: false
}, {
  inviteSuggestionList: [Immutable.List, User],
  inviteList: [Immutable.OrderedSet, User]
});

export default function(state = new RightPanelState(), action: Object) {
  switch (action.type) {
    case "OPEN_RIGHT_PANEL":
      return state.set("rightPanelActive", true);
    case "TOGGLE_RIGHT_PANEL":
      return state.set("rightPanelActive", !state.rightPanelActive);
    case "CLOSE_RIGHT_PANEL":
      return state.mergeDeep({"rightPanelActive": false, "inviteBoxActive": false});
    case "CHANGE_ACTIVE_PANEL":
      return state.set("activePanel", action.panel);
    case "TOGGLE_INVITE_INTERFACE":
      return state.set("inviteInterfaceActive", !state.inviteInterfaceActive);
    case "SET_INVITE_SUGGESTION_LIST":
      return state.merge({
        inviteSuggestionList: new Immutable.List(action.list.map(user => new User(user))),
        inviteInterfaceActive: true
      });
      // return state.set(
      //     "inviteSuggestionList",
      //     new Immutable.List(action.list.map(user => new User(user)))
      // );
    case "LOAD_INVITE_SUGGESTION_LIST_PAGE":
      return state.update("inviteSuggestionList", list => {
        if (list === null) return new Immutable.List(action.list.map(user => new User(user)));
        return list.concat(action.list.map(user => new User(user)));
      });
    case "CLOSE_INVITE_SUGGESTION_LIST":
      return state.merge({inviteSuggestionList: null, inviteInterfaceActive: false});
    case "ADD_USER_TO_INVITE_LIST":
      return state.update("inviteList", set => set.add(new User(action.user)));
    case "REMOVE_USER_FROM_INVITE_LIST":
      return state.update("inviteList", set => set.delete(action.user));
    case "CLEAR_INVITE_LIST":
      return state.update("inviteList", set => set.clear());
    case "UPDATE_INVITE_LIST_ERROR_MESSAGE":
      return state.set("inviteUserErrorMessage", action.errorType);
    case "DISPLAY_INVITE_LIST_ERROR_MESSAGE":
      return state.set("inviteUserError", true);
    case "HIDE_INVITE_LIST_ERROR_MESSAGE":
      return state.set("inviteUserError", false);
    case "START_INVITING_USER_TO_CHAT":
      return state.set("inviteUserProcessing", true);
    case "END_INVITING_USER_TO_CHAT":
      return state.set("inviteUserProcessing", false);
    case "OPEN_INVITE_BOX":
      return state.set("inviteBoxActive", true);
    case "CLOSE_INVITE_BOX":
      return state.set("inviteBoxActive", false);
    case "TOGGLE_INVITE_BOX":
      return state.set("inviteBoxActive", !state.inviteBoxActive);
    case "TOGGLE_ASSIGN_ADMIN_DIALOG":
      return state.set("assignAdminDialogActive", !state.assignAdminDialogActive);

    default:
      return state;
  }
}
