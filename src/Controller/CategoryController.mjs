import fetch from 'node-fetch';
import { GET_CATEGORIES, POST_LOGIN } from '../../api.mjs';
import {config} from '../config.mjs';


export default class CategoryController {

  static async getGroupsAndCategories(){

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
      const apiParams = GET_CATEGORIES(access_token)
      url = apiParams.url;
      options = apiParams.options;
      const response = await fetch(url, options)
      const json = await response.json()
      // console.log('not-error', json)
      return json
    }
  }
}