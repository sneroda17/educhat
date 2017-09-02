// @flow

import Immutable from "immutable";
import Chat from "../records/chat";

export default function(state = new Immutable.OrderedMap(), action: Object) {
  switch (action.type) {
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
    default:
      return state;
  }
}
