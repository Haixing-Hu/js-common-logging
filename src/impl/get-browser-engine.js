////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

/**
 * Gets the engine name of the current browser.
 *
 * @return {string}
 *     The engine name of the current browser.
 * @author Haixing Hu
 * @private
 */
function getBrowserEngine() {
  const userAgent = window.navigator.userAgent;
  if (/Gecko\/\d/i.test(userAgent) && !/like Gecko/i.test(userAgent)) {
    return 'Gecko'; // Firefox and other Gecko-based browsers
  } else if (/Chrome|Chromium|Edg/i.test(userAgent)) {
    return 'Blink'; // Chrome, Edge and other Blink-based browsers
  } else if (/(Apple)?WebKit/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
    return 'WebKit'; // Safari and other WebKit-based browsers
  } else if (/Trident/i.test(userAgent)) {
    return 'Trident'; // Internet Explorer and other Trident-based browsers
  } else if (/Presto/i.test(userAgent)) {
    return 'Presto'; // Opera and other Presto-based browsers
  } else {
    return 'Unknown';
  }
}

export default getBrowserEngine;
