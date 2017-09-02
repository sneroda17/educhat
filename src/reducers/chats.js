// @flow

import Immutable from "immutable";
import Chat from "../records/chat";

export default function(state = new Immutable.OrderedMap(), action: Object) {
  switch (action.type) {
    case "LOAD_CHATS":
      return state.mergeDeep(action.chats.map(chat => [chat.id, new Chat(chat)]));
    case "LOAD_SUBCHATS_OF_CHAT":
      return state.mergeDeep(action.subchats.map(subchat =>
        [subchat.id, new Chat(Object.assign(subchat, {parent: action.parentId}))]
      )).update(action.parentId, chat => {
        const list = new Immutable.List(action.subchats.map(subchat => subchat.id));
        if (!chat) return new Chat({subchats: list});
        else return chat.set(
          "subchats", chat.subchats.toOrderedSet().union(list.toOrderedSet()).toList());
      });
    case "ADD_CHAT": {
      const newChat = new Chat(action.chat);
      return state.reverse().update(newChat.id, chat => chat ? chat.mergeDeep(newChat) : newChat)
        .reverse();
    }
    case "UPDATE_CHAT":
      return state.update(action.id, chat => chat.mergeDeep(action.updates));
    case "RESET_CHAT_UNREAD_MESSAGES_COUNT":
      return state.update(action.chatId, chat => chat.set("unread_count", 0));
    case "INCREASE_UNREAD_MESSAGES_COUNT":
      return state.update(action.chatId, chat => chat.set("unread_count",
                                           chat.get("unread_count") + 1));
    case "UPDATE_LAST_MESSAGE":
      return state.update(action.chatId, chat =>
        chat.set("most_recent_message", action.newMessage));
    case "DELETE_CHAT":
      return state.delete(action.chatId);
    case "LOAD_CLASSES":
      return state.mergeDeep(action.classes.map(thisClass => [thisClass.id, new Chat(thisClass)]));
    case "LOAD_SUBCHATS_OF_CLASS":
      return state.mergeDeep(action.subchats.map(subchat =>
        [subchat.id, new Chat(Object.assign(subchat, {parent: action.parentId}))]
      )).update(action.parentId, chat => {
        const list = new Immutable.List(action.subchats.map(subchat => subchat.id));
        if (!chat) return new Chat({subchats: list});
        else return chat.set(
          "subchats", chat.subchats.toOrderedSet().union(list.toOrderedSet()).toList());
      });
    case "ADD_CLASS": {
      const newCreatedClass = new Chat(action.newClass);
      return state.reverse().update(newCreatedClass.id,
        chat => chat ? chat.mergeDeep(newCreatedClass) : newCreatedClass)
        .reverse();
    }
    case "DELETE_CLASS":
      return state.delete(action.classId);
    case "RESET_CLASS_UNREAD_MESSAGES_COUNT":
      return state.update(action.chatId, chat => chat.set("unread_count", 0));
    case "MOVE_CHAT_TO_TOP_OF_THE_LIST": {
      const newState = state.reverse().delete(action.chat.id);
      return newState.set(action.chat.id, action.chat).reverse();
    }
    default:
      return state;
  }
}
