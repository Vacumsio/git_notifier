require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { startCommitChecker } = require("./lib/core");
// const express = require("express");
// const app = express();

//Инициализация бота
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

//Ответ бота на комманду старт
bot.onText(/\/start/, (msg, [sourse, match]) => {
  const chatId = msg.chat.id;
  startCommitChecker(chatId || process.env.CHAT_GROUP_ID, 60000);
  bot.sendMessage(chatId, "Received your message");
});

// Настройка WebHook для прямых уведомлений от GitHub
// app.post("/webhook", (req, res) => {
//   const payload = req.body;
//   if (payload.ref === "здесь будет URL на нужную ветку") {
//     const commit = payload.commits;
//     const message = `Новый коммит: ${commit.id} - ${commit.message}`;
//     bot.sendMessage(chatId, message);
//     lastCommitHash = commit.id;
//   }
//   res.status(200).send("OK");
// });
// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
