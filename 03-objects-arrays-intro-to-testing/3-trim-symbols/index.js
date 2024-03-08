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

  const copyOfString = string.split("");
  const result = [];
  let count = 0;

  for (let i = 0; i < copyOfString.length; i++) {
    const letter = copyOfString[i];
    if (letter === copyOfString[i - 1]) {
      count++;
    } else {
      count = 1;
    }

    if (count <= size) {
      result.push(letter);
    }
  }

  return result.join("");
}
