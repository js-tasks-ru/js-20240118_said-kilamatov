/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (object, ...fields) => {
  let copyOfObj = {};

  for (const key in object) {
    if (!fields.includes(key)) {
      copyOfObj[key] = object[key];
    }
  }

  return copyOfObj;
};
