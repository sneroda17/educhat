import memoize from "./memoize";

const ref = memoize((ctx, name) => val => ctx[name] = val);
export default ref;
