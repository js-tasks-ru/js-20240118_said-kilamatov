/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (object, ...fields) => {
  const copyOfObj = { ...object };

  for (const key in copyOfObj) {
    if (!fields.includes(key)) delete copyOfObj[key];
  }

  return copyOfObj;
};
