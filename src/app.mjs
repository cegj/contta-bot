import TelegramBot from 'node-telegram-bot-api';
import { config } from './config.mjs';
import NewTransaction from './Commands/NewTransaction.mjs';
import CheckBudget from './Commands/CheckBudget.mjs';

const token = config.botToken;
export const bot = new TelegramBot(token, { polling: true });

async function sendWelcomeMsg(chatId) {
  await bot.sendMessage(chatId, 'Olá, eu sou o bot do Contta! 🤖')
  await bot.sendMessage(chatId, 'Lembre-se de sempre responder diretamente as minhas mensagens. As mensagens que devem ser respondidas começam sempre com este emoji: ↩️')
  await bot.sendMessage(chatId, 'Selecione um comando para iniciar')
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

bot.onText(/\/start/, async (msg) => {
  await sendWelcomeMsg(msg.chat.id);
});

bot.onText(/\/n/, async (msg) => {
  if (await validateUser(msg.chat.id, msg.from.username)){
    await NewTransaction.chat(msg.chat.id);
  }
});

bot.onText(/\/o/, async (msg) => {
  if (await validateUser(msg.chat.id, msg.from.username)){
    await CheckBudget.chat(msg.chat.id);
  }
});

bot.on("polling_error", console.log);