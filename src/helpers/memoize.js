const __memomap__ = Symbol("memo");

function createMap() {
  return {
    strong: new Map(),
    weak: new WeakMap(),
    [__memomap__]: true
  };
}

function mapSet(map, key, val) {
  (typeof key !== "object" ? map.strong : map.weak).set(key, val);
}

function mapHas(map, key) {
  return (typeof key !== "object" ? map.strong : map.weak).has(key);
}

function mapGet(map, key) {
  return (typeof key !== "object" ? map.strong : map.weak).get(key);
}

const EMPTY_BUFFER = {
  container: null,
  val: null
};

let getBuffer = EMPTY_BUFFER;

// Takes a container and an array of args and returns true if those args are in the container
// Buffers its result so a subsequent get doesn't have to traverse the container
function has(containerOrMap, args, _index = 0, _container = containerOrMap) {
  // If this is a top-level container, get the map and clear the buffer
  let map = containerOrMap;
  if (!containerOrMap[__memomap__]) {
    getBuffer = EMPTY_BUFFER;
    map = containerOrMap.map;
  }

  if (!map || !mapHas(map, args[_index])) return false;
  const val = mapGet(map, args[_index]);
  // If we're not at the last argument yet, we'll get another map and have to recurse
  if (val[__memomap__]) return has(val, args, _index + 1, _container);
  else {
    // Store the buffer values and return true
    getBuffer = {
      container: _container,
      val
    };
    return true;
  }
}

// Gets the value for the specified args from the container
function get(container, args) {
  if (getBuffer.container !== container && !has(container, args)) return null;
  const {val} = getBuffer;
  getBuffer = EMPTY_BUFFER;
  return val;
}

function set(containerOrMap, args, val, _index = 0, _depth = containerOrMap.depth) {
  const arg = args[_index];
  // If this is a top-level container, get the map
  let map = containerOrMap;
  if (!containerOrMap[__memomap__]) {
    // Create the top level if necessary
    if (!containerOrMap.map) {
      containerOrMap.map = createMap();
    }
    map = containerOrMap.map;
  }

  // If we're not on the last arg, move down a map level
  if (_index !== _depth - 1) {
    if (!mapHas(map, arg)) {
      mapSet(map, arg, createMap());
    }
    set(mapGet(map, arg), args, val, _index + 1, _depth);
  } else {
    mapSet(map, arg, val);
  }
}

// Memoizes a function. Uses WeakMaps for object arguments. Doesn't support optional arguments.
export default function memoize(fn) {
  const container = {map: null, depth: fn.length};
  return (...args) => {
    if (has(container, args)) return get(container, args);
    const result = fn(...args);
    set(container, args, result);
    return result;
  };
}
