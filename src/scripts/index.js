import {
  createCardElement,
  deleteCard,
  updateCardLikes,
} from "./components/card.js";
import {
  openModalWindow,
  closeModalWindow,
  setCloseModalWindowEventListeners,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
  removeCard,
  changeLikeCardStatus,
} from "./components/api.js";
import { fillCardInfo } from "./components/card-info.js";

const placesWrap = document.querySelector(".places__list");
const statusElement = document.querySelector(".content__status");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(
  ".popup__input_type_description",
);
const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");
const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");
const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");
const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoUsersList = cardInfoModalWindow.querySelector(".popup__list");
const allPopups = document.querySelectorAll(".popup");
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};
let userId;

const showError = (error) => {
  console.error(error);
  statusElement.textContent =
    error.message || "Не удалось выполнить запрос. Попробуйте ещё раз.";
  statusElement.hidden = false;
};
const clearError = () => {
  statusElement.textContent = "";
  statusElement.hidden = true;
};
const renderProfile = (user) => {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileAvatar.style.backgroundImage = `url(${JSON.stringify(user.avatar)})`;
};
const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};
const handleLikeClick = (cardId, isLiked, cardElement, button) => {
  button.disabled = true;
  clearError();
  changeLikeCardStatus(cardId, isLiked)
    .then((card) => updateCardLikes(cardElement, card.likes, userId))
    .catch(showError)
    .finally(() => {
      button.disabled = false;
    });
};
const handleDeleteClick = (cardId, cardElement, button) => {
  button.disabled = true;
  clearError();
  removeCard(cardId)
    .then(() => deleteCard(cardElement))
    .catch(showError)
    .finally(() => {
      button.disabled = false;
    });
};
const handleInfoClick = (cardId, button) => {
  button.disabled = true;
  clearError();
  getCardList()
    .then((cards) => {
      const card = cards.find((item) => item._id === cardId);
      if (!card)
        throw new Error("Эта карточка уже удалена. Обновите страницу.");
      fillCardInfo(card, cardInfoList, cardInfoUsersList);
      openModalWindow(cardInfoModalWindow);
    })
    .catch(showError)
    .finally(() => {
      button.disabled = false;
    });
};
const createCard = (card) =>
  createCardElement(card, userId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeIcon: handleLikeClick,
    onDeleteCard: handleDeleteClick,
    onInfoClick: handleInfoClick,
  });

const submitForm = (form, modal, loadingText, request, onSuccess) => {
  if (form.dataset.submitting === "true" || !form.checkValidity()) return;
  const button = form.querySelector(".popup__button");
  const inputs = Array.from(form.querySelectorAll(".popup__input"));
  const defaultText = button.textContent;
  form.dataset.submitting = "true";
  button.textContent = loadingText;
  button.disabled = true;
  inputs.forEach((input) => {
    input.disabled = true;
  });
  clearError();
  request()
    .then((data) => {
      onSuccess(data);
      closeModalWindow(modal);
    })
    .catch(showError)
    .finally(() => {
      form.dataset.submitting = "false";
      button.textContent = defaultText;
      inputs.forEach((input) => {
        input.disabled = false;
      });
      button.disabled = !form.checkValidity();
      button.classList.toggle("popup__button_disabled", button.disabled);
    });
};
const handleProfileFormSubmit = (event) => {
  event.preventDefault();
  submitForm(
    profileForm,
    profileFormModalWindow,
    "Сохранение...",
    () =>
      setUserInfo({
        name: profileTitleInput.value,
        about: profileDescriptionInput.value,
      }),
    renderProfile,
  );
};
const handleAvatarFormSubmit = (event) => {
  event.preventDefault();
  submitForm(
    avatarForm,
    avatarFormModalWindow,
    "Сохранение...",
    () => setUserAvatar(avatarInput.value),
    (user) => {
      renderProfile(user);
      avatarForm.reset();
    },
  );
};
const handleCardFormSubmit = (event) => {
  event.preventDefault();
  submitForm(
    cardForm,
    cardFormModalWindow,
    "Создание...",
    () =>
      addCard({
        name: cardNameInput.value,
        link: cardLinkInput.value,
      }),
    (card) => {
      placesWrap.prepend(createCard(card));
      cardForm.reset();
    },
  );
};
const openForm = (form, modal, prepare) => {
  if (!userId || form.dataset.submitting === "true") return;
  prepare();
  clearValidation(form, validationSettings);
  openModalWindow(modal);
};
const openAvatarForm = () =>
  openForm(avatarForm, avatarFormModalWindow, () => avatarForm.reset());

profileForm.addEventListener("submit", handleProfileFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
openProfileFormButton.addEventListener("click", () => {
  openForm(profileForm, profileFormModalWindow, () => {
    profileTitleInput.value = profileTitle.textContent;
    profileDescriptionInput.value = profileDescription.textContent;
  });
});
openCardFormButton.addEventListener("click", () =>
  openForm(cardForm, cardFormModalWindow, () => cardForm.reset()),
);
profileAvatar.addEventListener("click", openAvatarForm);
profileAvatar.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openAvatarForm();
  }
});
allPopups.forEach(setCloseModalWindowEventListeners);
enableValidation(validationSettings);

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, user]) => {
    userId = user._id;
    renderProfile(user);
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => fragment.append(createCard(card)));
    placesWrap.append(fragment);
  })
  .catch(showError);
