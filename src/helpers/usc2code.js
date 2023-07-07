/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
export function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const { length } = string;
  while (counter < length) {
    // eslint-disable-next-line no-plusplus
    const value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      // eslint-disable-next-line no-plusplus
      const extra = string.charCodeAt(counter++);
      // eslint-disable-next-line
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        // eslint-disable-next-line
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        // eslint-disable-next-line no-plusplus
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
export const ucs2encode = codePoints => String.fromCodePoint(...codePoints);
