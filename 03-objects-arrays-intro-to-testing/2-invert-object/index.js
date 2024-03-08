/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj === "undefined") {
    return;
  }
  const map = new Map(Object.entries(obj));
  const newObj = {};

  for (const [key, value] of map) {
    newObj[value] = key;
  }

  return newObj;
}
