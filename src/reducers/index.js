// @flow

import {combineReducers} from "redux";

import activeChat from "./active-chat";
import chats from "./chats";
import currentUser from "./current-user";
import errors from "./errors";
import users from "./users";
import ui from "./ui";

export default combineReducers({activeChat, chats, currentUser, errors, users, ui});
