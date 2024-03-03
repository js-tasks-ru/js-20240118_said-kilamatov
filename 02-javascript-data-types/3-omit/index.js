/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (object, ...fields) => {
  const copyOfObj = { ...object };

  for (const key in copyOfObj) {
    if (fields.includes(key)) {
      delete copyOfObj[key];
    }
  }

  return copyOfObj;
};
