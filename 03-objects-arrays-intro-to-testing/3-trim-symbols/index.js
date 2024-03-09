/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size === "undefined") {
    return string;
  }

  if (size === 0) {
    return "";
  }

  let letter = string.charAt(0);
  let count = 0;
  let result = "";

  for (let i = 0; i < string.length; i++) {
    if (letter === string.charAt(i)) {
      if (++count <= size) {
        result += string.charAt(i);
      }
    } else {
      count = 1;
      result += string.charAt(i);
    }

    letter = string.charAt(i);
  }

  return result;
}
