import ghpages from "gh-pages";

const repo = process.env.PAGES_REPOSITORY;
if (
  !repo ||
  !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(?:\.git)?$/.test(repo)
) {
  console.error(
    "Задайте PAGES_REPOSITORY: HTTPS-адрес отдельного публичного репозитория GitHub.",
  );
  process.exit(1);
}

ghpages.publish(
  "dist",
  { repo, branch: "gh-pages", dotfiles: true },
  (error) => {
    if (error) {
      console.error(error.message);
      process.exitCode = 1;
    } else {
      console.log("Сборка опубликована в gh-pages публичного репозитория.");
    }
  },
);
