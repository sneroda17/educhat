import io from "socket.io-client";
import {getStorageItem} from "../helpers/storage";

let instace = null;

export default class Socket {
  constructor(messageReceivedCallback) {
    if(!instace) {
      instace = this;
    }
    this.socket = io("https://socket.edu.chat/", {
      query: `token=${getStorageItem("token")}`,
      reconnectionDelayMax: 30000});
    this.socket.on("message recived", (payload) => {
      messageReceivedCallback(payload);
    });
    return instace;
  }
  joinChat = (chatId) => this.socket.emit("join chat", chatId);
}

export function updateUnreadMessagesObj(chatId, unreadMessagesObj) {
  let newMsgsObj = undefined;
  if(!unreadMessagesObj[chatId.toString()]) {
    unreadMessagesObj[chatId.toString()] = {unreadMsgsCount: 1};
  } else {
    unreadMessagesObj[chatId.toString()].unreadMsgsCount++;
  }
  newMsgsObj = unreadMessagesObj;
  return newMsgsObj;
}

