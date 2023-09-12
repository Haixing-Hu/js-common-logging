/*******************************************************************************
 *
 *    Copyright (c) 2022 - 2023.
 *    Haixing Hu, Qubit Co. Ltd.
 *
 *    All rights reserved.
 *
 ******************************************************************************/
const Logger = commonLogging.Logger;
const logger = new Logger('MyLogger');

function updateLogStateForm() {
  const LoggerState = document.getElementById('LoggerState');
  if (LoggerState) {
    const currentLevel = LoggerState.querySelector('input[name="currentLevel"]');
    currentLevel.value = logger.getLevel();
  }
}

function onSubmitDemoForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const message = formData.get('message');
  const arg1 = formData.get('arg1');
  const arg2 = formData.get('arg2');
  const level = formData.get('level');
  console.info(`Submit a ${level} message: "${message}", ${arg1}, ${arg2}.`);
  if (message && level) {
    const method = level.toLowerCase();
    const args = [];
    if (arg1) {
      args.push(arg1);
    }
    if (arg2) {
      args.push(arg2);
    }
    logger[method](message, ...args);
  }
}
function onSubmitSetLevelForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const level = formData.get('level');
  console.info(`Set the logger's level to: ${level}.`);
  logger.setLevel(level);
  updateLogStateForm();
}

function onEnableAllButtonClicked(event) {
  event.preventDefault();
  console.info('Enable the logger.');
  logger.enable();
  updateLogStateForm();
}

function onDisableAllButtonClicked(event) {
  event.preventDefault();
  console.info('Disable the logger.');
  logger.disable();
  updateLogStateForm();
}

document.addEventListener('DOMContentLoaded', () => {
  logger.setLevel('TRACE');
  const demoForm = document.getElementById('LogForm');
  const setLevelForm = document.getElementById('SetLevel');
  const enableAllButton = document.getElementById('EnableAllButton');
  const disableAllButton = document.getElementById('DisableAllButton');
  if (demoForm) {
    demoForm.addEventListener('submit', onSubmitDemoForm);
  }
  if (setLevelForm) {
    setLevelForm.addEventListener('submit', onSubmitSetLevelForm);
  }
  if (enableAllButton) {
    enableAllButton.addEventListener('click', onEnableAllButtonClicked);
  }
  if (disableAllButton) {
    disableAllButton.addEventListener('click', onDisableAllButtonClicked);
  }
  updateLogStateForm();
});
