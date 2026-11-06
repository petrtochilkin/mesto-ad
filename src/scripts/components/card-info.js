const infoTemplate = document.querySelector(
  "#popup-info-definition-template",
).content;
const userTemplate = document.querySelector(
  "#popup-info-user-preview-template",
).content;

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
const createInfoString = (term, description) => {
  const item = infoTemplate.querySelector(".popup__info-item").cloneNode(true);
  item.querySelector(".popup__info-term").textContent = term;
  item.querySelector(".popup__info-description").textContent = description;
  return item;
};

export const fillCardInfo = (card, infoList, usersList) => {
  infoList.replaceChildren();
  usersList.replaceChildren();
  const information = [
    ["Описание:", card.name],
    ["Дата создания:", formatDate(new Date(card.createdAt))],
    ["Владелец:", card.owner.name],
    ["Количество лайков:", card.likes.length],
  ];
  information.forEach(([term, description]) => {
    infoList.append(createInfoString(term, description));
  });
  card.likes.forEach((user) => {
    const item = userTemplate
      .querySelector(".popup__list-item")
      .cloneNode(true);
    item.textContent = user.name;
    item.title = user.name;
    usersList.append(item);
  });
};
