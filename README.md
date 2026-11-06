# Mesto — Пётр Точилкин

[Открыть сайт](https://petrtochilkin.github.io/mesto-ad/)

Финальная проектная работа: интеграция с API и вариант 1 — информация о карточке. Основа — [официальный шаблон Практикума](https://github.com/Yandex-Practicum/mesto-ad).

## Возможности

Редактирование профиля и аватара, добавление карточек, удаление своих карточек, постановка и снятие лайков со счётчиком. По кнопке «i» с сервера запрашивается актуальная информация о карточке: название, дата создания, владелец, число лайков и список пользователей. Формы валидируются и показывают состояние отправки. Модальные окна закрываются крестиком, по фону и Escape.

## Запуск

Нужен Node.js 22.12+ или 20.19+. Скопируйте `.env.example` в `.env.local`, заполните `VITE_MESTO_TOKEN` и `VITE_MESTO_COHORT` своими данными Практикума.

```sh
npm install
npm run dev
```

В PowerShell при блокировке npm.ps1 используйте `npm.cmd` вместо `npm`.

```sh
npm run build
npm run preview
```

Сборка создаётся в `dist`. `.env.local`, `node_modules` и `dist` исключены из Git.

## Публикация на GitHub Pages

В Settings → Pages выбран источник GitHub Actions. В Settings → Secrets and variables → Actions заданы секреты `VITE_MESTO_TOKEN` и `VITE_MESTO_COHORT`.

Для публикации текущей версии откройте Actions → Publish Mesto → Run workflow → main → Run workflow. Workflow устанавливает зависимости, выполняет сборку и публикует `dist` в GitHub Pages текущего репозитория. После изменения исходников запуск выполняется вручную.

Альтернативная команда `npm run deploy` публикует сборку через gh-pages: перед запуском задайте `PAGES_REPOSITORY` с HTTPS-адресом репозитория и настройте авторизацию Git. Для текущей публикации используется workflow.

## Структура

- `src/scripts/index.js` — инициализация, обработчики форм, вызовы API, заполнение окна информации о карточке из шаблонов.
- `src/scripts/components/api.js` — запросы к серверу и проверка ответов.
- `src/scripts/components/card.js` — создание и обновление разметки карточек.
- `src/scripts/components/modal.js` — открытие и закрытие модальных окон.
- `src/scripts/components/validation.js` — универсальная валидация форм.
- `src/blocks` — стили по БЭМ.
- `.github/workflows/deploy.yml` — публикация сайта.
