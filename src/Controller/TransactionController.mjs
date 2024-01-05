import fetch from 'node-fetch';
import { GET_TRANSACTIONS, PATCH_EXPENSE, PATCH_INCOME, POST_EXPENSE, POST_INCOME, POST_LOGIN } from '../api.mjs';
import {config} from '../config.mjs';


export default class TransactionController {

  static async storeTransaction(body){

    const {url, options} = POST_LOGIN({email: config.apiUser, password: config.apiPassword})
    const response = await fetch(url, options)
    if (response.status !== 200){
      const json = await response.json()
      console.log('error', json)
      return response
    }

    const {access_token} = await response.json()
    if (access_token) {
      let url, options;
      if (body.type === "R") {
        const apiParams = POST_INCOME(body, access_token)
        url = apiParams.url;
        options = apiParams.options;
      }
      if (body.type === "D") {
        const apiParams = POST_EXPENSE(body, access_token)
        url = apiParams.url;
        options = apiParams.options;
      }

      const response = await fetch(url, options)
      return response
    }
  }

  static async editTransaction(body, type, id){

    const {url, options} = POST_LOGIN({email: config.apiUser, password: config.apiPassword})
    const response = await fetch(url, options)
    if (response.status !== 200){
      const json = await response.json()
      console.log('error', json)
      return response
    }

    const {access_token} = await response.json()
    if (access_token) {
      let url, options;
      if (type === "R") {
        const apiParams = PATCH_INCOME(body, access_token, id)
        url = apiParams.url;
        options = apiParams.options;
      }
      if (type === "D") {
        const apiParams = PATCH_EXPENSE(body, access_token, id)
        url = apiParams.url;
        options = apiParams.options;
      }

      const response = await fetch(url, options)
      return response
    }
  }

  static async getTransactions(queryObject){
    const {url, options} = POST_LOGIN({email: config.apiUser, password: config.apiPassword})
    const response = await fetch(url, options)
    if (response.status !== 200){
      const json = await response.json()
      console.log('error', json)
      return response
    }
    const {access_token} = await response.json()
    if (access_token) {
      let url, options;
      const apiParams = GET_TRANSACTIONS(access_token, queryObject)
      url = apiParams.url;
      options = apiParams.options;
      const response = await fetch(url, options)
      const json = await response.json()
      // console.log('not-error', json)
      return json
    }
  }
}
