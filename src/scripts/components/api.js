const cohort = import.meta.env.VITE_MESTO_COHORT?.trim();
const token = import.meta.env.VITE_MESTO_TOKEN?.trim();

const config = {
  baseUrl: `https://mesto.nomoreparties.co/v1/${cohort}`,
  headers: { authorization: token, "Content-Type": "application/json" },
};

const getResponseData = (response) =>
  response.ok
    ? response.json()
    : Promise.reject(new Error(`Ошибка сервера: ${response.status}`));

const request = (path, options = {}) => {
  if (!cohort || !token) {
    return Promise.reject(
      new Error(
        "Укажите личный токен и группу в файле .env.local и перезапустите сайт.",
      ),
    );
  }
  return fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers: config.headers,
  }).then(getResponseData);
};

export const getUserInfo = () => request("/users/me");
export const getCardList = () => request("/cards");
export const setUserInfo = ({ name, about }) =>
  request("/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name, about }),
  });
export const setUserAvatar = (avatar) =>
  request("/users/me/avatar", {
    method: "PATCH",
    body: JSON.stringify({ avatar }),
  });
export const addCard = ({ name, link }) =>
  request("/cards", {
    method: "POST",
    body: JSON.stringify({ name, link }),
  });
export const removeCard = (cardId) =>
  request(`/cards/${cardId}`, { method: "DELETE" });
export const changeLikeCardStatus = (cardId, isLiked) =>
  request(`/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
  });
