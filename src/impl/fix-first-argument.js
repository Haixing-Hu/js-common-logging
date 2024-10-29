////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import isString from './is-string';

function fixFirstArgument(prefix, args) {
  if (args.length === 0) {
    return [prefix];
  } else if (isString(args[0])) {
    args[0] = prefix + args[0];
    return args;
  } else {
    return [prefix, ...args];
  }
}

export default fixFirstArgument;
