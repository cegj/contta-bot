import objectToQueryString from "./src/Helpers/objectToQueryString.mjs";

export const API_URL = '';

export function POST_LOGIN(body){
  return {
    url: API_URL + '/users/login',
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function POST_INCOME(body, token){
  return {
    url: API_URL + '/transactions/incomes',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function POST_EXPENSE(body, token){
  return {
    url: API_URL + '/transactions/expenses',
    options: {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body)
    }
  }
}

export function GET_CATEGORIES(token){
  return {
    url: API_URL + '/categories/groups',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function GET_ACCOUNTS(token){
  return {
    url: API_URL + '/accounts',
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  }
}

export function GET_BALANCE_FOR_BUDGET(token, queryObject){
  const query = objectToQueryString(queryObject)

  return {
    url: API_URL + `/balances/budget?${query}`,
    options: {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token
      }  
    }
  }
}
