/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const uniq = new Set(arr);
  const copyOfArr = [...uniq];
  return copyOfArr;
}
