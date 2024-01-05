import { bot } from '../app.mjs'
import TransactionController from '../Controller/TransactionController.mjs';
import CategoryController from '../Controller/CategoryController.mjs';
import AccountController from '../Controller/AccountController.mjs';
import { setTransactionsAsMadeTxts as txts } from '../Texts/setTransactionsAsMadeTxts.mjs';
import { chatOptions as options } from '../Config/chatOptions.mjs';
import DateHelpers from '../Helpers/DateHelpers.mjs';
import BalanceController from '../Controller/BalanceController.mjs';

export default class setTransactionAsMade {
  static async chat(chatId) {

    const query = {
      from: null,
      to: null,
      typeofdate: null,
      category: null
    }

    const validAnswers = {
        date: {
          today: ["hoje", "h"],
          monthYearFormat: /^(0[1-9]|1[012])\/[12][0-9]{3}$/,
          monthFormat: /(^0?[1-9]$)|(^1[0-2]$)/
        },
        typeOfDate: {
          transactionDate: ["data da transação", "transação", "t"],
          paymentDate: ["data do pagamento", "pagamento", "p"]
        },
        tryAgain: {
          yes: ["sim", "s"],
          no: ["não", "nao", "n"]
        },
        category: /^\d+$/,
        transactionId: /^\d+$/,
    }

    let transactions;
    let groups;

    async function startAndGetMonth(){
      const sentMsg = await bot.sendMessage(chatId, txts.month.main, options);  
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.date.today.includes(msg.text.toLowerCase())){
          const today = new Date(msg.date * 1000)
          const todayArr = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0].split('-')
          const firstDay = DateHelpers.getFirstDay(todayArr[0], todayArr[1])
          const lastDay = DateHelpers.getLastDay(todayArr[0], todayArr[1])
          query.from = firstDay
          query.to = lastDay
          await getTypeOfDate();
        } else
          if(validAnswers.date.monthFormat.test(msg.text)){
            const today = new Date(msg.date * 1000)
            const year = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0].split('-')[0]
            const month = msg.text
            const firstDay = DateHelpers.getFirstDay(year, month)
            const lastDay = DateHelpers.getLastDay(year, month)
            query.from = firstDay
            query.to = lastDay
            await getTypeOfDate();
        } else
          if(validAnswers.date.monthYearFormat.test(msg.text)){
            const monthYearArr = msg.text.split('/')
            const firstDay = DateHelpers.getFirstDay(monthYearArr[1], monthYearArr[0])
            const lastDay = DateHelpers.getLastDay(monthYearArr[1], monthYearArr[0])
            query.from = firstDay
            query.to = lastDay
            await getTypeOfDate();
        } else {
            query.from = null
            query.to = null
            await bot.sendMessage(chatId, txts.month.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }
    
    async function getTypeOfDate(){
      const sentMsg = await bot.sendMessage(chatId, txts.typeOfDate.main, options);
      bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
        if(validAnswers.typeOfDate.transactionDate.includes(msg.text.toLowerCase())){
          query.typeofdate = "transaction_date"
          await getCategory();
        } else
        if(validAnswers.typeOfDate.paymentDate.includes(msg.text.toLowerCase())){
          query.typeofdate = "payment_date"
          await getCategory();
        } else {
          query.typeofdate = null
          await bot.sendMessage(chatId, txts.typeOfDate.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getCategory(loop = false){
      await bot.sendMessage(chatId, txts.category.retrieving,{...options, reply_markup: {force_reply: false}})
      if (!loop){ groups = await CategoryController.getGroupsAndCategories() }
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
          query.category = msg.text;
          await getTransactions();
        } else {
          query.category = null
          await bot.sendMessage(chatId, txts.category.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getTransactions(){
        await bot.sendMessage(chatId, txts.transactions.retrieving,{...options, reply_markup: {force_reply: false}})
        const json = await TransactionController.getTransactions(query)
        let i = 1
        transactions = json.transactions.filter((t) => {
          if (t.preview == 1) {
            t["selector"] = i
            i++;
            return t
          }})
        await askTransacion()
    }
  
    async function askTransacion(){
      if (transactions.length == 0) {
        const tryAgainMsg = await bot.sendMessage(chatId, txts.transactions.empty, options); 
        bot.onReplyToMessage(chatId, tryAgainMsg.message_id, async(msg) => {
          if(validAnswers.tryAgain.yes.includes(msg.text.toLowerCase())){
            await getCategory(true)
          } else
            if(validAnswers.tryAgain.no.includes(msg.text.toLowerCase())){
              await end()
          } else {
              await bot.sendMessage(chatId, txts.transactions.retryEmpty,{...options, reply_markup: {force_reply: false}})
            }  
        })
      }
      else {
        let msgTxt = "";
        msgTxt += txts.transactions.main;
        transactions.forEach(t => {
          const value = (t.value / 100).toFixed(2).toString().replace(".", ",")
          let type;
          switch(t.type){
            case 'D':
              type = "Despesa"
              break
            case 'R':
              type = "Receita"
              break
            case 'T':
              type = "Transferência"
              break
          }
          msgTxt += `---\n<b>${t.selector}</b>. ${t.description}\n${type} - Valor: R$ ${value}\nConta: ${t.account.name}\n`
        })
        const transactionMsg = await bot.sendMessage(chatId, msgTxt, options); 
        bot.onReplyToMessage(chatId, transactionMsg.message_id, async(msg) => {
          if(validAnswers.transactionId.test(msg.text)){
            const selectedTransaction = transactions.filter((t) => {return t.selector == +msg.text})[0]
            if (!selectedTransaction) {
              await bot.sendMessage(chatId, txts.transactions.invalid,{...options, reply_markup: {force_reply: false}})
              await askTransacion()
            } else {
              await edit(selectedTransaction)
            }
          } else {
            query.category = null
            await bot.sendMessage(chatId, txts.transactions.retry,{...options, reply_markup: {force_reply: false}})
          }
        })    
      }
    }

    async function edit(transaction){
      await bot.sendMessage(chatId, "Estou marcando a transação como consolidada...");
      const response = await TransactionController.editTransaction(
        {preview: false},
        transaction.type,
        transaction.id
        )
      if (response.status === 200){
        await bot.sendMessage(chatId, txts.end.success);
      } else {
        let error = await response.json()
        error = error.error || error.message
        await bot.sendMessage(chatId, txts.end.error);
        await bot.sendMessage(chatId, error);
      }
    }

    async function end(){
        await bot.sendMessage(chatId, txts.end.main,{...options, reply_markup: {force_reply: false}})
    }

    await startAndGetMonth();
  }
}