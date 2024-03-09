/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const properties = path.split(".");
  return (obj) => {
    let value = obj;
    for (const prop of properties) {
      if (value?.hasOwnProperty(prop)) {
        value = value[prop];
      } else {
        return;
      }
    }

    return value;
  };
}
