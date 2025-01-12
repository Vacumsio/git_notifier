const _ = require("lodash");
const axios = require("axios");
const repoOwner = "vacumsio"; // "" - owner of repository
const repoName = "playwright_ts"; // "" - name of repository
let lastCommitHash = [];

async function getLatestCommits() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
  const response = await axios.get(url);
  const commits = response.data;
  if (lastCommitHash == null) lastCommitHash = commits; // первая инициализация (включи, если хочешь чтобы при первом запуске бот прислал все коммите из выбранной ветки с самого начала)
  const newCommits = _.filter(commits, (sha) => {
    return !_.some(lastCommitHash, (otherItem) => {
      return _.isEqual(sha, otherItem);
    });
  });
  return newCommits;
}

function startCommitChecker(chatId, interval = 600000) {
  const checkCommitsInterval = setInterval(async () => {
    const newCommits = await getLatestCommits();
    if (newCommits.length > 0) {
      lastCommitHash = lastCommitHash.concat(newCommits);
      newCommits.forEach((commit) => {
        const message = `Новый коммит: ${commit.sha} - ${commit.commit.message}`;
        // console.log(message);
        bot.sendMessage(chatId, message);
      });
    }
  }, interval);

  // Задел на выставление таймаута TODO:подумать,
  // function clearInterval() {
  //   clearInterval(checkCommitsInterval);
  // }

  // return clearInterval;
}

module.exports = { startCommitChecker };
