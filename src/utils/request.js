import axios from 'axios'
import { AxiosRetry } from './retry.js'
import {
  addAbortController,
  removeAbortController
} from './abortController.js'
// 创建一个axios实例
import {
  LOCAL_ACCESS_KEY,
  BASE_URL,
  FETCH_TOKEN_URL,
  LOCAL_REFRESH_KEY
} from '../consts/index.js'
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    addAbortController(config)
    const url = config.url
    // 不是登录请求，请求头添加 token
    if (url !== '/login') {
      config.headers.Authorization = localStorage.getItem(LOCAL_ACCESS_KEY)
    }
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    removeAbortController(response.config)
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if(!axios.isCancel(error)) { // 不是因为取消请求导致的错误，就移除这个控制器
      removeAbortController(error.config)
    }
    return Promise.reject(error);
  }
);

const axiosRetry = new AxiosRetry({
  baseUrl: BASE_URL,
  url: FETCH_TOKEN_URL,
  getRefreshToken: () => localStorage.getItem(LOCAL_REFRESH_KEY),
  unauthorizedCode: 401,
  onSuccess: (res) => {
    localStorage.setItem(LOCAL_ACCESS_KEY, res.data.accessToken)
  },
  onError: () => {
    console.log('refreshToken过期了，请重新登陆')
  }
})

const get = (url, options) => {
  return axiosRetry.requestWrapper(() => instance.get(url, options))
}
const post = (url, data, options) => {
  return axiosRetry.requestWrapper(() => instance.post(url, data, options))
}

export {
  get,
  post
}
