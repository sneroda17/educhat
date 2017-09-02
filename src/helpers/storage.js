export function setStorageItem(key, value, remember) {
  if (remember === undefined) {
    const wantsRemembered = localStorage.getItem("wantsRemembered");
    remember = wantsRemembered !== null ? wantsRemembered : true;
  }

  (remember ? localStorage : sessionStorage).setItem(key, value);
}

export function removeStorageItem(key) {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

export function getStorageItem(key) {
  const sessionItem = sessionStorage.getItem(key);
  return sessionItem !== null ? sessionItem : localStorage.getItem(key);
}
