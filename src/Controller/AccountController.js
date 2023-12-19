import fetch from 'node-fetch';
import { GET_ACCOUNTS, POST_LOGIN } from '../../api.js';
import {config} from '../config.js';


export default class AccountController {

  static async getAccounts(){

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
      const apiParams = GET_ACCOUNTS(access_token)
      url = apiParams.url;
      options = apiParams.options;
      const response = await fetch(url, options)
      const json = await response.json()
      // console.log('not-error', json)
      return json
    }
  }
}