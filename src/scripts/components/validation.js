const showInputError = (form, input, message, settings) => {
  const error = form.querySelector(`#${input.id}-error`);
  input.classList.add(settings.inputErrorClass);
  input.setAttribute("aria-invalid", "true");
  error.textContent = message;
  error.classList.add(settings.errorClass);
};

const hideInputError = (form, input, settings) => {
  const error = form.querySelector(`#${input.id}-error`);
  input.classList.remove(settings.inputErrorClass);
  input.removeAttribute("aria-invalid");
  error.textContent = "";
  error.classList.remove(settings.errorClass);
};

const checkInputValidity = (form, input, settings) => {
  input.setCustomValidity("");
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage);
  }
  if (input.validity.valid) {
    hideInputError(form, input, settings);
  } else {
    showInputError(form, input, input.validationMessage, settings);
  }
};

const hasInvalidInput = (inputs) =>
  inputs.some((input) => !input.validity.valid);
const disableSubmitButton = (button, settings) => {
  button.disabled = true;
  button.classList.add(settings.inactiveButtonClass);
};
const enableSubmitButton = (button, settings) => {
  button.disabled = false;
  button.classList.remove(settings.inactiveButtonClass);
};
const toggleButtonState = (inputs, button, settings) => {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(button, settings);
  } else {
    enableSubmitButton(button, settings);
  }
};

const setEventListeners = (form, settings) => {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const button = form.querySelector(settings.submitButtonSelector);
  disableSubmitButton(button, settings);
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });
};

export const clearValidation = (form, settings) => {
  form.querySelectorAll(settings.inputSelector).forEach((input) => {
    input.setCustomValidity("");
    hideInputError(form, input, settings);
  });
  disableSubmitButton(
    form.querySelector(settings.submitButtonSelector),
    settings,
  );
};

export const enableValidation = (settings) => {
  document.querySelectorAll(settings.formSelector).forEach((form) => {
    setEventListeners(form, settings);
  });
};
