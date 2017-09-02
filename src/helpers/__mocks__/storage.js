const storage = {
  session: new Map(),
  local: new Map(),
  override: new Map()
};

export const setStorageItem = jest.fn((key, value, remember = true) => {
  (remember ? storage.local : storage.session).set(key, value);
});

// Override storage always returns
export function _setOverrideStorageItem(key, value) {
  storage.override.set(key, value);
}

export const getStorageItem = jest.fn((key) => {
  if (storage.override.has(key)) return storage.override.get(key);
  else if (storage.session.has(key)) return storage.session.get(key);
  else if (storage.local.has(key)) return storage.local.get(key);
  else return null;
});

export const removeStorageItem = jest.fn((key) => {
  storage.session.delete(key);
  storage.local.delete(key);
});

export function _removeOverrideStorageItem(key) {
  storage.override.delete(key);
}
