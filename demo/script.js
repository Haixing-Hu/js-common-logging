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
  const level = formData.get('level');
  console.info(`Submit a ${level} message: "${message}".`);
  if (message && level) {
    const method = level.toLowerCase();
    logger[method](message);
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
