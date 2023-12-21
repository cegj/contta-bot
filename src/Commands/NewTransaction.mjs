import { bot } from '../app.mjs'
import TransactionController from '../Controller/TransactionController.mjs';
import CategoryController from '../Controller/CategoryController.mjs';
import AccountController from '../Controller/AccountController.mjs';
import { NewTransactionTxts as txts } from '../Texts/NewTransactionTxts.mjs';
import { chatOptions as options } from '../Config/chatOptions.mjs';

export default class NewTransaction {
  static async chat(chatId) {
    const body = {
      type: null,
      transaction_date: null,
      payment_date: null,
      value: null,
      description: null,
      category_id: null,
      account_id: null,
      preview: false,
      usual: false,
      budget_control: false,
      total_installments: null
    }
    
    const validAnswers = {
      type: {
        expenses: ["despesa", "d"],
        incomes: ["receita", "r"]
      },
      date: {
        today: ["hoje", "h"],
        yesterday: ["ontem", "o"],
        format: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
      },
      value: /^(\d+(?:[\.\,]\d{2})?)$/,
      category: /^\d+$/,
      account: /^\d+$/,
      installments: {
        not: ["n", "não", "nao"],
        format: /^\d+$/
      }
    }

    async function StartAndGetType(){
      const sentMsg = await bot.sendMessage(chatId, txts.type.main, options);
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.type.expenses.includes(msg.text.toLowerCase())){
          body.type = "D"
          await getTransactionDate();
        } else
        if(validAnswers.type.incomes.includes(msg.text.toLowerCase())){
          body.type = "R"
          await getTransactionDate();
        } else {
        body.type = null
        bot.sendMessage(chatId, txts.type.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getTransactionDate(){
      const sentMsg = await bot.sendMessage(chatId, txts.transactionDate.main, options);  
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.date.today.includes(msg.text.toLowerCase())){
          const today = new Date(msg.date * 1000)
          const todayStr = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.transaction_date = todayStr;
          await getPaymentDate();
        } else
          if(validAnswers.date.yesterday.includes(msg.text.toLowerCase())){
          const yesterday = new Date(msg.date * 1000 - 86400000)
          const yesterdayStr = yesterday.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.transaction_date = yesterdayStr;
          await getPaymentDate();
        } else
          if(validAnswers.date.format.test(msg.text)){
          const dateArr = msg.text.split('/')
          const dateStr = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
          body.transaction_date = dateStr;
          await getPaymentDate();
        } else {
          body.transaction_date = null
          bot.sendMessage(chatId, txts.transactionDate.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getPaymentDate(){
      const sentMsg = await bot.sendMessage(chatId, txts.paymentDate.main, options);  
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.date.today.includes(msg.text.toLowerCase())){
          const today = new Date(msg.date * 1000)
          const todayStr = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
          body.payment_date = todayStr;
          await getValue();
        } else
          if(validAnswers.date.yesterday.includes(msg.text.toLowerCase())){
            const yesterday = new Date(msg.date * 1000 - 86400000)
            const yesterdayStr = yesterday.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0]
            body.payment_date = yesterdayStr;
            await getValue();
        } else
          if(validAnswers.date.format.test(msg.text)){
            const dateArr = msg.text.split('/')
            const dateStr = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`
            body.payment_date = dateStr;
            await getValue();
        } else {
          body.payment_date = null
          bot.sendMessage(chatId, txts.transactionDate.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getValue(){
      const sentMsg = await bot.sendMessage(chatId, txts.value.main, options);  
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.value.test(msg.text)){
          if (!msg.text.includes(",")){ msg.text += ",00" }
          const intValue = +msg.text.replace(/\./g, '').replace(',', '') 
          body.value = intValue;
          await getDescription()
        } else {
          body.value = null
          bot.sendMessage(chatId, txts.value.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getDescription(){
      const sentMsg = await bot.sendMessage(chatId, txts.description.main, options);  
      bot.onReplyToMessage(chatId, sentMsg.message_id, async(msg) => {
        if(msg.text !== ""){
          body.description = msg.text;
          await getCategory();
        } else {
          body.description = null
          bot.sendMessage(chatId, txts.description.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getCategory(){
      bot.sendMessage(chatId, txts.category.retrieving,{...options, reply_markup: {force_reply: false}})
      let groups = await CategoryController.getGroupsAndCategories()
      let msgTxt = "";
      msgTxt += txts.category.main;
      groups.groups.forEach(group => {
        msgTxt += `<b>${group.name}</b>`;
        msgTxt += "\n"
        group.categories.forEach(category => {
          msgTxt += `${category.id}. ${category.name}`
          msgTxt += "\n"
        })
        msgTxt += "\n"
      })
      const categoryMsg = await bot.sendMessage(chatId, msgTxt, options); 
      bot.onReplyToMessage(chatId, categoryMsg.message_id, async(msg) => {
        if(validAnswers.category.test(msg.text)){
          if (msg.text == "0") { body.category_id = "" }
          else { body.category_id = msg.text; }
          await getAccount();
        } else {
          body.category_id = null
          bot.sendMessage(chatId, txts.category.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getAccount(){
      bot.sendMessage(chatId, txts.account.retrieving,{...options, reply_markup: {force_reply: false}})
      let accounts = await AccountController.getAccounts()
      let msgTxt = "";
      msgTxt += txts.account.main;
      accounts.accounts.forEach(account => {
        msgTxt += `${account.id}. ${account.name}`
        msgTxt += "\n"
      })
      const accountMsg = await bot.sendMessage(chatId, msgTxt, options); 
      bot.onReplyToMessage(chatId, accountMsg.message_id, async(msg) => {
        if(validAnswers.account.test(msg.text)){
          if (msg.text == "0") { body.account_id = "" }
          else { body.account_id = msg.text; }
          await getInstallments();
        } else {
          body.account_id = null
          bot.sendMessage(chatId, txts.account.retry,{...options, reply_markup: {force_reply: false}})
        }
      })
    }

    async function getInstallments(){
      const sentMsg = await bot.sendMessage(chatId, txts.installments.main, options); 
      bot.onReplyToMessage(chatId, sentMsg.message_id, async(msg) => {
        if(validAnswers.installments.format.test(msg.text)){
          body.total_installments = msg.text;
          await store();
        } else
          if(validAnswers.installments.not.includes(msg.text.toLowerCase())){    
            body.total_installments = 1;
            await store();
        } else {
          body.total_installments = null
          bot.sendMessage(chatId, txts.installments.retry,{...options, reply_markup: {force_reply: false}})
        }
      })
    }

    async function store(){
      await bot.sendMessage(chatId, "Estou registrando a transação...");
      const response = await TransactionController.storeTransaction(body)
      if (response.status === 200){
        await bot.sendMessage(chatId, txts.end.main);
      } else {
        let error = await response.json()
        error = error.error || error.message
        await bot.sendMessage(chatId, txts.end.error);
        await bot.sendMessage(chatId, error);
      }
    }
    await StartAndGetType();
  }
}