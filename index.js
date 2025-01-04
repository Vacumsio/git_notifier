const TelegramBot = require("node-telegram-bot-api");
const git = require("simple-git");
require("dotenv").config();

const bot = new TelegramBot(process.env.API_KEY_BOT, { polling: true });
const repoUrl = "https://github.com/Vacumsio/playwright_ts"; // URL вашего репозитория
const repo = git();

// Инициализируйте репозиторий
repo.addRemote("origin", repoUrl);

// Функция для получения последних коммитов
async function getLatestCommits() {
  try {
    const commits = await repo.log();
    return commits.all;
  } catch (error) {
    console.error("Ошибка при получении коммитов:", error);
    return [];
  }
}

// Отправка уведомлений о новых коммитах
async function sendCommitNotifications(commits) {
  const chatId = "-4621825250"; // ID чата, куда будут отправляться уведомления
  for (const commit of commits) {
    const message = `Новый коммит: ${commit.hash} - ${commit.message}`;
    bot.sendMessage(chatId, message);
  }
}

// Периодическая проверка новых коммитов
setInterval(async () => {
  const commits = await getLatestCommits();
  sendCommitNotifications(commits);
}, 1000); // Проверка каждую минуту

// Обработчик команды для ручной проверки коммитов
bot.onText(/\/commits/, async (msg) => {
  const chatId = msg.chat.id;
  const commits = await getLatestCommits();
  for (const commit of commits) {
    const message = `Коммит: ${commit.hash} - ${commit.message}`;
    bot.sendMessage(chatId, message);
  }
});
