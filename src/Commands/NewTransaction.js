import { bot } from '../app.js'
import TransactionController from '../Controller/TransactionController.js';

export default class newTransaction {

  static async chat(chatId) {

    const options = {
      reply_markup: {
        force_reply: true
      },
      parse_mode: "HTML"
    }

    const body = { type: null, transaction_date: null, payment_date: null, value: null, description: null, category_id: null, account_id: null, preview: false, usual: false, budget_control: false, total_installments: 1 }

    async function StartAndGetType(){
      const typeMsg = await bot.sendMessage(chatId, "🏷️ Qual é o <b>tipo</b> da transação? Informe Despesa (D) ou Receita (R)", options);
  
      bot.onReplyToMessage(chatId, typeMsg.message_id, async (msg) => {
        if(msg.text.toLowerCase() === "despesa" || msg.text.toLowerCase() === "d"){
          body.type = "D"
          await getTransactionDate();
        } else if(msg.text.toLowerCase() === "receita" || msg.text.toLowerCase() === "r"){
          body.type = "R"
          await getTransactionDate();
        } else {
          body.type = null
          bot.sendMessage(chatId, "Por favor, responda Despesa (D) ou Receita (R)",{reply_to_message_id: msg.reply_to_message.message_id})
        }
      })  
    }

    async function getTransactionDate(){
      const dateMsg = await bot.sendMessage(chatId, '📅 Qual é a <b>data da transação</b>? Informe DD/MM/AAAA, hoje (H) ou ontem (O)', options);
      const dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
  
      bot.onReplyToMessage(chatId, dateMsg.message_id, async (msg) => {
        if(msg.text.toLowerCase() === "hoje" || msg.text.toLowerCase() === "h"){
          const today = new Date(msg.date * 1000)
          const todayStr = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.transaction_date = todayStr;
          await getPaymentDate();
        } else if(msg.text.toLowerCase() === "ontem" || msg.text.toLowerCase() === "o"){
          const yesterday = new Date(msg.date * 1000 - 86400000)
          const yesterdayStr = yesterday.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.transaction_date = yesterdayStr;
          await getPaymentDate();
        } else if(dateRegex.test(msg.text)){
          const dateArr = msg.text.split('/')
          const dateStr = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
          body.transaction_date = dateStr;
          await getPaymentDate();
        } else {
          body.transaction_date = null
          bot.sendMessage(chatId, `Por favor, responda uma data válida`,{reply_to_message_id: msg.reply_to_message.message_id})
        }
      })  
    }

    async function getPaymentDate(){
      const dateMsg = await bot.sendMessage(chatId, '📅 Qual é a <b>data do pagamento</b>? Informe DD/MM/AAAA, hoje (H) ou ontem (O)', options);
      const dateRegex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
  
      bot.onReplyToMessage(chatId, dateMsg.message_id, async (msg) => {
        if(msg.text.toLowerCase() === "hoje" || msg.text.toLowerCase() === "h"){
          const today = new Date(msg.date * 1000)
          const todayStr = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.payment_date = todayStr;
          await getValue();
        } else if(msg.text.toLowerCase() === "ontem" || msg.text.toLowerCase() === "o"){
          const yesterday = new Date(msg.date * 1000 - 86400000)
          const yesterdayStr = yesterday.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.payment_date = yesterdayStr;
          await getValue();
        } else if(dateRegex.test(msg.text)){
          const dateArr = msg.text.split('/')
          const dateStr = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
          body.payment_date = dateStr;
          await getValue();
        } else {
          body.payment_date = null
          bot.sendMessage(chatId, `Por favor, responda uma data válida`,{reply_to_message_id: msg.reply_to_message.message_id})
        }
      })  
    }

    async function getValue(){
      const dateMsg = await bot.sendMessage(chatId, '💰 Qual o <b>valor</b> da transação?', options);
      const valueRegex = /^(\d+(?:[\.\,]\d{2})?)$/
  
      bot.onReplyToMessage(chatId, dateMsg.message_id, async (msg) => {
        if(valueRegex.test(msg.text)){
          const intValue = +msg.text.replace(/\./g, '').replace(',', '') 
          body.value = intValue;
          await getDescription()
        } else {
          body.value = null
          bot.sendMessage(chatId, `Por favor, responda um valor válido (inteiro ou com duas casas decimais)`,{reply_to_message_id: msg.reply_to_message.message_id})
        }
      })  
    }

    async function getDescription(){
      const dateMsg = await bot.sendMessage(chatId, '📝 Qual a <b>descrição</b> da transação?', options);  
      bot.onReplyToMessage(chatId, dateMsg.message_id, async(msg) => {
        if(msg.text !== ""){
          body.description = msg.text;
          await store();
        } else {
          body.description = null
          bot.sendMessage(chatId, `Por favor, informe uma descrição para a transação`,{reply_to_message_id: msg.reply_to_message.message_id})
        }
      })  
    }

    async function store(){
      await bot.sendMessage(chatId, "Estou registrando a transação...");
      const response = await TransactionController.storeTransaction(body)

      if (response.status === 200){
        await bot.sendMessage(chatId, "Transação registrada! :D");
      } else {
        let error = await response.json()
        error = error.error || error.message
        await bot.sendMessage(chatId, "Ocorreu um erro! :(");
        await bot.sendMessage(chatId, error);
      }
    }


    await StartAndGetType();

  }
}