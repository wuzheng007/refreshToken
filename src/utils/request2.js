import axios from 'axios'
import { fetchToken } from '../api/index.js'
import { addAbortController, removeAbortController } from './abortController.js'
import {
  LOCAL_ACCESS_KEY,
  BASE_URL,
  FETCH_TOKEN_URL,
  LOCAL_REFRESH_KEY
} from '../consts/index.js'



/* 声明一个变量fetchTokenPromise，用来保存刷新token的promise，当fetchTokenPromise不为空时，说明正在刷新token，
此时不需要再次刷新token，只需要等待fetchTokenPromise执行完毕即可。 */
let fetchTokenPromise = null

// 重试函数，当请求返回401时，说明accessToken过期，需要用refreshToken去刷新token，刷新成功后再次发起刚才失败的请求
function retry(config) {
  return new Promise((resolve, reject)=> {
    if(!fetchTokenPromise) {
      fetchTokenPromise= fetchToken()
    }
    fetchTokenPromise.then(res=> {
      localStorage.setItem(LOCAL_ACCESS_KEY, res.data.accessToken)
      instance(config).then(res=> {
        resolve(res)
      }).catch(err=> {
        reject(err)
      })
    }).catch(err=>{
      console.log('刷新token失败', err)
      reject()
    }).finally(() => {
      fetchTokenPromise = null;
      console.log('finally')
    })

  })
}


// 创建一个axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10 * 1000
})


// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    addAbortController(config)
    const url = config.url
    // 不是登录请求，请求头添加accessToken
    if (url !== '/login') {
      config.headers.Authorization = localStorage.getItem(LOCAL_ACCESS_KEY)
    }
    // 是刷新token的请求，请求头添加refreshToken
    if(url === FETCH_TOKEN_URL) {
      config.headers.Authorization = localStorage.getItem(LOCAL_REFRESH_KEY)
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
    if(error.response.status === 401 && error.config.url !== FETCH_TOKEN_URL) {
      return retry(error.config)
    }
    return Promise.reject(error);
  }
);

const get = (url, options) => {
  return instance.get(url, options)
}
const post = (url, data, options) => {
  return instance.post(url, data, options)
}

export {
  get,
  post
}
