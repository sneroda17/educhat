import ComplexRecord from "../helpers/complex-record";
import File from "./file";

const Message = ComplexRecord({
  id: null,
  user: null,
  text: "",
  created: null,
  comment_count: 0,
  file: null,
  parent: null,
  is_question: Boolean,
  is_resolved: Boolean,
  is_starred: Boolean,
  is_best_answer: Boolean,
  comments: [],
  type: ""
}, {
  file: File
});

export default Message;
