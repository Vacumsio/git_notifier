const { axiosInstance } = require("./axios");

function sendMessage(messageObj, messageText) {
  return axiosInstance.get("SendMessage", {
    chat_id: messageObj.chat.id,
    text: messageText,
  });
}

function handleMessage(messageObj) {
  const messageText = messageObj.text || "";
  if (messageText.charAt(0) === "/") {
    const command = messageText.substr(1);
    switch (command) {
      case "start":
        return sendMessage(
          messageObj,
          "Бу, испугался? Не бойся. Я друг, я тебя не обижу."
        );
      default:
        return sendMessage(
          messageObj,
          "Давай смотреть друг на друга до тех пор, пока наши глаза не устанут"
        );
    }
  } else {
    return sendMessage(messageObj, messageText);
  }
}

module.exports = { handleMessage };
