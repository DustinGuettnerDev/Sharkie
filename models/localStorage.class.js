/**
 * Wraps browser localStorage with JSON serialization for simple key-value storage.
 */
class LocalStorage {
    /**
     * Reads a JSON value from localStorage.
     * @param {string} key Storage key.
     * @returns {*} Parsed value or null if the key is missing.
     */
    getSingleItem(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    /**
     * Stores a value in localStorage as JSON.
     * @param {string} key Storage key.
     * @param {*} value Value to store.
     */
    setSingleItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}
