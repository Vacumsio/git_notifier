const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();

const bot = new TelegramBot("7603762219:AAEmlitz1TS9RDPFm2yT3j0bzJiz3oISbls", {
  polling: true,
});
const chatId = "-4621825250";
const repoOwner = "vacumsio";
const repoName = "testbot";
let lastCommitHash = null;

async function getLatestCommits() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
  const response = await axios.get(url);
  const commits = response.data;
  const latestCommit = commits; // Самый новый коммит

  // Фильтруем новые коммиты
  const newCommits = commits.filter((commit) => commit.sha !== lastCommitHash);

  return { latestCommit, newCommits };
}

// Периодическая проверка новых коммитов
setInterval(async () => {
  const { latestCommit, newCommits } = await getLatestCommits();

  if (newCommits.length > 0) {
    // Проверяем, что новый коммит не совпадает с предыдущим
    if (latestCommit.sha !== lastCommitHash) {
      lastCommitHash = latestCommit.sha; // Обновляем lastCommitHash на самый новый коммит
      console.log(`Обновлен lastCommitHash: ${lastCommitHash}`);

      newCommits.forEach((commit) => {
        const message = `Новый коммит: ${commit.sha} - ${commit.commit.message}`;
        console.log(message);
        // bot.sendMessage(chatId, message);
      });
    }
  }
}, 10000); // Проверка каждую минуту

// Настройка WebHook для прямых уведомлений от GitHub
app.post("/webhook", (req, res) => {
  const payload = req.body;
  if (payload.ref === "refs/heads/main") {
    // или другая ветка, которую вы отслеживаете
    const commit = payload.commits;
    if (commit.id !== lastCommitHash) {
      const message = `Новый коммит: ${commit.id} - ${commit.message}`;
      console.log(message);
      // bot.sendMessage(chatId, message);
      lastCommitHash = commit.id;
    }
  }
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
