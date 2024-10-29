////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Determines whether a value is a string.
 *
 * A value is a string if it is a string or a `String` object.
 *
 * @param {any} value
 *     The value to be checked.
 * @return {boolean}
 *     `true` if the value is a string; `false` otherwise.
 * @author Haixing Hu
 * @private
 */
function isString(value) {
  return (typeof value === 'string') || (value instanceof String);
}

export default isString;
