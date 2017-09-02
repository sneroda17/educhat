import Immutable from "immutable";
import ComplexRecord from "../helpers/complex-record";
import Message from "./message";

const CommentsRecord = ComplexRecord({
  confirmed: Immutable.List,
  pending: Immutable.OrderedMap
}, {
  confirmed: [Immutable.List, Message],
  pending: [Immutable.OrderedMap, Message]
});
export default CommentsRecord;
