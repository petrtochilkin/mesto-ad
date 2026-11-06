const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

export const updateCardLikes = (cardElement, likes, userId) => {
  const button = cardElement.querySelector(".card__like-button");
  const isLiked = likes.some((user) => user._id === userId);
  button.classList.toggle("card__like-button_is-active", isLiked);
  button.setAttribute("aria-pressed", String(isLiked));
  button.setAttribute("aria-label", isLiked ? "Убрать лайк" : "Поставить лайк");
  cardElement.querySelector(".card__like-count").textContent = likes.length;
};

export const deleteCard = (cardElement) => cardElement.remove();

export const createCardElement = (
  data,
  userId,
  { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick },
) => {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(
    ".card__control-button_type_delete",
  );
  const infoButton = cardElement.querySelector(
    ".card__control-button_type_info",
  );
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;
  updateCardLikes(cardElement, data.likes, userId);
  likeButton.addEventListener("click", () => {
    onLikeIcon(
      data._id,
      likeButton.getAttribute("aria-pressed") === "true",
      cardElement,
      likeButton,
    );
  });
  if (data.owner._id === userId) {
    deleteButton.addEventListener("click", () =>
      onDeleteCard(data._id, cardElement, deleteButton),
    );
  } else {
    deleteButton.remove();
  }
  cardImage.addEventListener("click", () => onPreviewPicture(data));
  infoButton.addEventListener("click", () => onInfoClick(data._id, infoButton));
  return cardElement;
};
