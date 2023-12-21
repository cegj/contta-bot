import fetch from 'node-fetch';
import { POST_EXPENSE, POST_LOGIN } from '../../api.mjs';
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
}