import {put, select, call, takeEvery} from "redux-saga/effects";

import {addUser} from "../actions/users";
import {addChat, increaseUnreadMessagesCount, updateMostRecentMessage,
  requestMoveChatToTop} from "../actions/chats";
import {receiveMessage} from "../actions/active-chat";
// import {updateUnreadMessages} from "../actions/ui/left-panel";
import {
  getActiveChat,
  getCurrentUser,
  getCurrentMessageOffset
} from "./selectors";
import {changeCurrentChatMessageOffset, changeNewMessageReceived} from "../actions/ui/main-panel";
import Socket from "../helpers/socket";
import {messageRecived} from "../actions/socket";

export function* messageReceived({message, user}) {
  const {id: currentUserId} = yield select(getCurrentUser);
  if (user.id !== currentUserId) {
    yield put(addUser(user));
  }
  if (message.parent === null) {
    const chatId = message.chat;
    const {id: activeChatId} = yield select(getActiveChat);
    yield put(updateMostRecentMessage(chatId, message));
    yield put(requestMoveChatToTop(chatId));
    if (chatId === activeChatId) {
      yield put(receiveMessage(message));
      yield put(changeNewMessageReceived(true));
      const currentMessageOffset = yield select(getCurrentMessageOffset);
      yield put(changeCurrentChatMessageOffset(parseInt(currentMessageOffset, 10) + 1));
    } else {
      yield put(receiveMessage(message));
      yield put(changeNewMessageReceived(true));
      const currentMessageOffset = yield select(getCurrentMessageOffset);
      yield put(changeCurrentChatMessageOffset(parseInt(currentMessageOffset, 10) + 1));
      yield put(increaseUnreadMessagesCount(chatId));
    }
  } else {
    // TODO: create socket for comments.
  }
}

export function* addChatWorker({chat}) {
  // if the user creates a new chat/is invited
  // connect to this chat
  // const socket = new Socket();
  // yield call(socket.joinChat, chat.id);
  const getMessage = ({message, user}) => messageRecived(message, user);
  const socket = new Socket(getMessage);
  yield call(socket.joinChat, chat.id);
}

export function* userInvitedToNewChat(chat) {
  yield put(addChat(chat));
}

// I have no idea what proper error handling for Socket.io is.
// It's an event, but I don't know what kind of objects to expect or if I need to do anything with
// them in order to recover.
// So for right now... I'm logging to the console.
// Please improve if you have wisdom I don't.
export function* error(err) {
  yield call([console, console.error], "Socket error", err);
}

export default function* () {
  yield takeEvery("MESSAGE_RECIVED", messageReceived);
  yield takeEvery("ADD_CHAT", addChatWorker);
}
