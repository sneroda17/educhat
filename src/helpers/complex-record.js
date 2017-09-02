/* eslint-disable new-cap */

import NestableRecord from "immutable-nestable-record";

// This is really imperfect.
// Some browsers don't implement the spec correctly and this won't detect non-Babel
// ES5 constructors that need to be called with new.
// But it should work for most of our purposes and I like having it.
// We can always remove or improve this later.
// UPDATE: This was breaking our production builds, removed for now
// function isEs2015Class(fn) {
//   return /^class\s|^function (\w+)\([^()]*\)\s+{(\n|.)+?_classCallCheck\(this, \1\)/
//     .test(Function.prototype.toString.call(fn));
// }

// This function wraps NestableRecord such that
// if a function is given as a default value for a property, it is called
// to dynamically generate the default value
// (e.g., giving Immutable.List as a default constructs a new List every time)
// Feel free to suggest a better name for this file/function...

export default function ComplexRecord(defaults, types, ...rest) {
  for (const prop in defaults) if (defaults.hasOwnProperty(prop)) {
    const val = defaults[prop];
    if (typeof val === "function") {
      delete defaults[prop];
      Object.defineProperty(defaults, prop, {
        get: () => new val(),
        enumerable: true
      });
    }
  }

  // NestableRecord doesn't call its constructors with new.
  // Here I figured it was safe to assume that new could be used with all types
  for (const prop in types) if (types.hasOwnProperty(prop)) {
    const type = types[prop];
    if (Array.isArray(type)) {
      const [container, member] = type;
      type[0] = args => new container(args);
      type[1] = args => new member(args);
    } else {
      types[prop] = args => new type(args);
    }
  }

  return NestableRecord(defaults, types, ...rest);
}
