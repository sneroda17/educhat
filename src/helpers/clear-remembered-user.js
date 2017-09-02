import {removeStorageItem} from "./storage";

export default function() {
  [
    "token",
    "user",
    "activeChatId",
    "parentId"
  ].forEach(removeStorageItem);
}
