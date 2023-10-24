import { get, post } from '../utils/request.js'

import {
  LOGIN_URL,
  TEST_URL,
  FETCH_TOKEN_URL,
  LOCAL_REFRESH_KEY
} from '../consts/index.js'

// 刷新token接口
export const fetchToken = () => {
  return get(FETCH_TOKEN_URL, {
    headers: {
      Authorization: localStorage.getItem(LOCAL_REFRESH_KEY)
    }
  })
}

// 登录接口
export const login = (data) => {
  return post(LOGIN_URL, data)
}

// 测试接口
export const test = () => {
  return get(TEST_URL)
}
export const test2 = () => {
  return get('/test2')
}

