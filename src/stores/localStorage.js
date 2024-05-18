const localStorageKey = "choice-save";

/**
 *
 * @param {Object} data - copy of choices store
 */
export function objectToLocalStorage(data) {
  localStorage.setItem(localStorageKey, JSON.stringify(data));
}

/**
 *
 * @returns {Object} - choices store
 */
export function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem(localStorageKey));
}
