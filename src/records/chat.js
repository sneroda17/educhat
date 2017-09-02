import Immutable from "immutable";
import ComplexRecord from "../helpers/complex-record";
import Message from "./message";
import File from "./file";
import Color from "./color";

const Chat = ComplexRecord({
  id: null,
  name: "",
  description: "",
  most_recent_message: null,
  picture_file: File,
  subchats: Immutable.List,
  color: Color,
  parent: null,
  is_class: Boolean,
  is_bot: Boolean,
  add_new_users_from_parent: Boolean,
  unread_count: null,
  is_admin_chat: Boolean,
  is_anonymous: Boolean
}, {
  most_recent_message: Message,
  picture_file: File,
  subchats: Immutable.List,
  color: Color
});

export default Chat;
