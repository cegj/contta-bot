import { bot } from '../app.mjs'
import CategoryController from '../Controller/CategoryController.mjs';
import { CheckBudgetTxts as txts } from '../Texts/CheckBudgetTxts.mjs';
import { chatOptions as options } from '../Config/chatOptions.mjs';
import DateHelpers from '../Helpers/DateHelpers.mjs';
import BalanceController from '../Controller/BalanceController.mjs';

export default class CheckBudget {
  static async chat(chatId) {

    const query = {
      from: null,
      to: null,
      typeofdate: 'payment_date',
    }

    const validAnswers = {
        date: {
          today: ["hoje", "h"],
          monthYearFormat: /^(0[1-9]|1[012])\/[12][0-9]{3}$/,
          monthFormat: /(^0?[1-9]$)|(^1[0-2]$)/
        },
        ifCategory: {
            yes: ["s", "sim"],
            no: ["n", "não","nao"],
        },
        category: /^\d+$/,
    }

    let budget = {}
    let groups = {}

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
          await getBudget();
        } else // COLOCAR PARA RECEBER SOMENTE O MÊS (CONSIDERAR O ANO CORRENTE)
          if(validAnswers.date.monthFormat.test(msg.text)){
            const today = new Date(msg.date * 1000)
            const year = today.toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' }).split(' ')[0].split('-')[0]
            const month = msg.text
            const firstDay = DateHelpers.getFirstDay(year, month)
            const lastDay = DateHelpers.getLastDay(year, month)
            query.from = firstDay
            query.to = lastDay
            await getBudget();
        } else
          if(validAnswers.date.monthYearFormat.test(msg.text)){
            const monthYearArr = msg.text.split('/')
            const firstDay = DateHelpers.getFirstDay(monthYearArr[1], monthYearArr[0])
            const lastDay = DateHelpers.getLastDay(monthYearArr[1], monthYearArr[0])
            query.from = firstDay
            query.to = lastDay
            await getBudget();
        } else {
            query.from = null
            query.to = null
            await bot.sendMessage(chatId, txts.month.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function getBudget(){
        await bot.sendMessage(chatId, txts.generalResult.retrieving,{...options, reply_markup: {force_reply: false}})
        budget = await BalanceController.getBalanceForBudget(query)
        await sendMonthBudget()
    }

    async function sendMonthBudget(){
        const values = {
            month: {
                expected: budget.balances.all_month.expected / 100,
                made: budget.balances.all_month.made / 100,
                result: (budget.balances.all_month.expected / 100 - budget.balances.all_month.made / 100).toFixed(2)     
            },
            accumulated: {
                expected: budget.balances.all_accumulated.expected / 100,
                made: budget.balances.all_accumulated.made / 100,
                result: (budget.balances.all_accumulated.expected / 100 - budget.balances.all_accumulated.made / 100).toFixed(2) 
            }
        }


        const msgTxt = `
        ${txts.generalResult.main}\n
        <b>Mensal:</b>
        - Tudo: R$ ${values.month.expected.toString().replace('.', ',')}
        - Só executados: R$ ${values.month.made.toString().replace('.', ',')}
        - Diferença: R$ ${values.month.result.toString().replace('.', ',')}
        
        <b>Acumulado:</b>
        - Tudo: R$ ${values.accumulated.expected.toString().replace('.', ',')}
        - Só executados: R$ ${values.accumulated.made.toString().replace('.', ',')}
        - Diferença: R$ ${values.accumulated.result.toString().replace('.', ',')}
        `
        await bot.sendMessage(chatId, msgTxt,{...options, reply_markup: {force_reply: false}})
        await askIfCategory();
    }

    async function askIfCategory(loop = false){
        const sentMsg = await bot.sendMessage(chatId, !loop ? txts.ifCategory.main : txts.ifCategory.loopMain, options);  
        bot.onReplyToMessage(chatId, sentMsg.message_id, async (msg) => {
          if(validAnswers.ifCategory.yes.includes(msg.text.toLowerCase())){
            if (!loop){
                await bot.sendMessage(chatId, txts.ifCategory.retrieving,{...options, reply_markup: {force_reply: false}})
                groups = await CategoryController.getGroupsAndCategories()    
            }
            await getCategory();
          } else
            if(validAnswers.ifCategory.no.includes(msg.text.toLowerCase())){
              await end();
        } else {
            await bot.sendMessage(chatId, txts.type.retry,{...options, reply_markup: {force_reply: false}})
          }
        })  
      }
  
    async function getCategory(){
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
          await sendCategoryBudget(msg.text);
        } else {
          await bot.sendMessage(chatId, txts.category.retry,{...options, reply_markup: {force_reply: false}})
        }
      })  
    }

    async function sendCategoryBudget(catId){
        const values = {
            expected: budget.balances.categories[catId].expected / 100,
            made: budget.balances.categories[catId].made / 100,
            result: (budget.balances.categories[catId].made / 100 - budget.balances.categories[catId].expected / 100).toFixed(2)
        }
        const msgTxt = `
        ${txts.categoryResult.main}\n
        - Previsto: R$ ${values.expected.toString().replace('.', ',')}
        - Executado: R$ ${values.made.toString().replace('.', ',')}
        - Resultado: R$  ${values.result.toString().replace('.', ',')}
        `
        await bot.sendMessage(chatId, msgTxt,{...options, reply_markup: {force_reply: false}})
        await askIfCategory(true);
    }

    async function end(){
        await bot.sendMessage(chatId, txts.end.main,{...options, reply_markup: {force_reply: false}})
    }

    await startAndGetMonth();
  }
}