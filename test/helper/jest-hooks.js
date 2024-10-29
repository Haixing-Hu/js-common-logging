////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36';

let userAgentSpy;

function beforeEachHook() {
  // Modify userAgent
  console.log('Mock userAgent before each');
  userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(USER_AGENT);
}

function afterEachHook() {
  // Restore userAgent
  console.log('Restore userAgent after each');
  userAgentSpy.mockRestore();
}

export {
  beforeEachHook,
  afterEachHook,
};
