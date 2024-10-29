////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Convert a string to uppercase.
 *
 * @param {any} value
 *     The value to be converted. If it is not a string, it will be returned directly.
 * @return {any|string}
 *     The converted string, or the original value if it is not a string.
 * @author Haixing Hu
 * @private
 */
function upperCaseString(value) {
  if ((typeof value !== 'string') && (!(value instanceof String))) {
    return value;
  }
  return value.toUpperCase();
}

export default upperCaseString;
