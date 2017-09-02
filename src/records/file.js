import Immutable from "immutable";

const FileProto = Immutable.Record({
  id: null,
  extension: null,
  filesize: 0,
  url: "",
  created: null,
  name: ""
});

// There's a bug/limitation in Immutable.Record in that it won't allow a field with the name "size".
// This is worked around by converting the name to "filesize".
export default class File extends FileProto {
  constructor(args = {}) {
    args.filesize = args.size;
    delete args.size;
    super(args);
  }
}
