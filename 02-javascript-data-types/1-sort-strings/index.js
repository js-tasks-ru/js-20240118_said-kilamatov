/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
  const copyOfArr = arr.slice("");

  if (param === "asc") {
    copyOfArr.sort((a, b) =>
      a.localeCompare(b, ["ru-RU", "en-EN"], { caseFirst: "upper" })
    );
  } else if (param === "desc") {
    copyOfArr.sort((a, b) =>
      b.localeCompare(a, ["ru-RU", "en-EN"], { caseFirst: "upper" })
    );
  }

  return copyOfArr;
}
