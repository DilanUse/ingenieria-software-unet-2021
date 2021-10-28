/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj);
  if (hit) {
    return hit.copy;
  }

  const copy = Array.isArray(obj) ? [] : {};
  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy,
  });

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key], cache);
  });

  return copy;
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPromise(val) {
  return val && typeof val.then === 'function';
}

export function assert(condition, msg) {
  if (!condition) throw new Error(`[vuex] ${msg}`);
}

export function partial(fn, arg) {
  return function () {
    return fn(arg);
  };
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
export function find(list, f) {
  return list.filter(f)[0];
}

/**
 * Get the item item that match with the key
 *
 * @param {Array} list - array to search
 * @param {string} key - key to find
 * @param {any} value - value to find
 * @return {any} item if find, otherwise undefined
 */
export function findByKey(list, key, value) {
  const item = list.find((i) => i[key] === value);

  if (item !== undefined) {
    return deepCopy(item);
  }

  return item;
}

/**
 * Get the index of item that match with the key
 *
 * @param {Array} list - array to search
 * @param {string} key - key to find
 * @param {any} value - value to find
 * @return {number} index if find, otherwise -1
 */
export function findIndex(list, key, value) {
  return list.findIndex((i) => i[key] === value);
}

/**
 * Get the index of item that match with the key-value and delete.
 * Optionally add a new item if is passed
 *
 * @param {Array} list - array to search
 * @param {string} key - key to find
 * @param {any} value - value to find
 * @param {any} add - value to add
 * @param {boolean} returnDeleted - determine if return or no the deleted item
 * @return {boolean|any} true if find index and splice, otherwise false,
 * optionally return the splice item if found, otherwise undefined
 */
export function findIndexAndSplice(
  list, key, value, add = null, returnDeleted = false,
) {
  const index = findIndex(list, key, value);
  let itemsDeleted;

  if (index !== -1) {
    if (add !== null) {
      itemsDeleted = list.splice(index, 1, add);
    } else {
      itemsDeleted = list.splice(index, 1);
    }

    return returnDeleted ? itemsDeleted[0] : true;
  }

  return returnDeleted ? undefined : false;
}

/**
 * Get the index of items that match with the key-values and replace with new value
 *
 * @param {Array} list - array to search
 * @param {string} key - key to find
 * @param {Array<any>} values - values to find
 * @return {boolean} true if find index and splice for all values, otherwise false
 */
export function findIndicesAndSplice(list, key, values) {
  let result = true;

  values.forEach((value) => {
    if (!findIndexAndSplice(list, key, value[key], value) && result) {
      result = false;
    }
  });

  return result;
}

/**
 * Get the index of item that match with the key-value and delete.
 * Optionally add a new item if is passed
 *
 * @param {Array} list - array to search
 * @param {string} key - key to find
 * @param {Array<any>} values - values to find
 * @return {Array<any>} values deleted
 */
export function findIndicesAndDelete(list, key, values) {
  const deleted = [];

  values.forEach((value) => {
    const itemDeleted = findIndexAndSplice(list, key, value, null, true);

    if (itemDeleted) {
      deleted.push(itemDeleted);
    }
  });

  return deleted;
}

/**
 * Return the extension of file from its mime type
 *
 * @param {string} mimeType - mimeType to map
 * @return {string} extension of file
 */
export function getExtFromFileType(mimeType) {
  switch (mimeType) {
    case 'audio/mp3':
    case 'audio/mpeg':
      return 'mp3';
    case 'audio/vnd.wave':
    case 'audio/wav':
    case 'audio/wave':
    case 'audio/x-wav':
      return 'wav';
    case 'image/bmp':
    case 'image/x-windows-bmp':
      return 'bmp';
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/pjpeg':
      return 'jpeg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    default:
      return '';
  }
}

/**
 * Return random string of 10 characters
 *
 * @return {string} random string
 */
export function getRandomString() {
  return Math.random().toString(36).substr(2, 9);
}
