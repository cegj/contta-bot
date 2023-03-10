import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.js';
import newTransaction from './Commands/NewTransaction.js';

const token = config.botToken;
export const bot = new TelegramBot(token, { polling: true });

async function sendWelcomeMsg(chatId) {
  await bot.sendMessage(chatId, 'Olá, eu sou o bot do Contta! 🤖')
  await bot.sendMessage(chatId, 'Lembre-se de sempre responder diretamente às minhas mensagens. Assim eu entendo melhor!')
}

const options = {
  reply_markup: {
    force_reply: true
  },
  parse_mode: "HTML"
}

async function validateUser(chatId, username) {
  if (!username){
    await bot.sendMessage(chatId, "Você não tem um nome de usuário no Telegram. Cadastre o seu username e tente novamente.");
    return false
  }
  if (config.authorizedUsers.includes(username)){
    return true
  } else {
    bot.sendMessage(chatId, "Sinto muito, mas eu não te reconheci! O seu usuário do Telegram não está na minha lista de usuários autorizados. 🚫")
    return false
  }
}

bot.onText(/\/n/, async (msg) => {
  await sendWelcomeMsg(msg.chat.id);
  if (await validateUser(msg.chat.id, msg.from.username)){
    await newTransaction.chat(msg.chat.id);
  }
});

bot.on("polling_error", console.log);