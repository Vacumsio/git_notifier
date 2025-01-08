const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const app = express();

const bot = new TelegramBot("7603762219:AAEmlitz1TS9RDPFm2yT3j0bzJiz3oISbls", {
  polling: true,
});
const chatId = "-4621825250";
const repoOwner = "vacumsio";
const repoName = "playwright_ts";
let lastCommitHash = null;

async function getLatestCommits() {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
  const response = await axios.get(url);
  const commits = response.data;
  console.log(lastCommitHash); //null

  const newCommits = commits.filter((commit) => commit.sha !== lastCommitHash);
  console.log(newCommits);

  console.log(lastCommitHash); //null
  return newCommits;
}

// Периодическая проверка новых коммитов
setInterval(async () => {
  const newCommits = await getLatestCommits();
  if (newCommits.length > 0 && lastCommitHash !== newCommits) {
    lastCommitHash = newCommits; // Обновите lastCommitHash на самый новый коммит
    console.log(lastCommitHash);
    newCommits.forEach((commit) => {
      const message = `Новый коммит: ${commit.sha} - ${commit.commit.message}`;
      console.log(message);
      // bot.sendMessage(chatId, message);
    });
  }
}, 5000); // Проверка каждую минуту

// Настройка WebHook для прямых уведомлений от GitHub
app.post("/webhook", (req, res) => {
  const payload = req.body;
  if (payload.ref === "refs/heads/main") {
    // или другая ветка, которую вы отслеживаете
    const commit = payload.commits;
    const message = `Новый коммит: ${commit.id} - ${commit.message}`;
    bot.sendMessage(chatId, message);
    lastCommitHash = commit.id;
  }
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
