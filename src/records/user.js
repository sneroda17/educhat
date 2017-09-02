import Immutable from "immutable";
import ComplexRecord from "../helpers/complex-record";
import File from "./file";

const User = ComplexRecord({
  id: null,
  picture_file: null,
  first_name: null,
  last_name: null,
  email: null,
  is_online: null,
  type: null,
  tags: Immutable.List,
  areas_of_study: Immutable.List,
  year_of_graduation: 0
}, {
  picture_file: File,
  tags: Immutable.List,
  areas_of_study: Immutable.List
});

export default User;
