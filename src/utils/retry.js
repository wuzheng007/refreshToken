import axios from 'axios';

export class AxiosRetry {
  // 维护一个promise
  #fetchNewTokenPromise = null;

  // 一些必须的配置
  #baseUrl = null; // 基础url
  #url = null; // 请求新accessToken的url
  #getRefreshToken = null; // 获取refreshToken的函数
  #unauthorizedCode = null; // 无权限的状态码，默认401
  #onSuccess = null; // 获取新accessToken成功后的回调
  #onError = null; // 获取新accessToken失败后的回调

  constructor({
    baseUrl,
    url,
    getRefreshToken,
    unauthorizedCode = 401,
    onSuccess,
    onError,
  }) {
    this.#baseUrl = baseUrl;
    this.#url = url;
    this.#getRefreshToken = getRefreshToken;
    this.#unauthorizedCode = unauthorizedCode;
    this.#onSuccess = onSuccess;
    this.#onError =onError;
  }

  requestWrapper(request) {
    return new Promise((resolve, reject)=> {
      // 先把请求函数保存下来
      const requestFn = request;
      return request()
        .then(resolve)
        .catch(err => {
          const {response} = err
          // 状态码是无权限的状态码，且请求地址不是请求新accessToken的url时
          if (response?.status === this.#unauthorizedCode && !(response?.config?.url === this.#url)) {
            if (!this.#fetchNewTokenPromise) {
              this.#fetchNewTokenPromise = this.fetchNewToken();
            }
            this.#fetchNewTokenPromise
              .then(() => {
                console.log('===============================')
                // 获取token成功后，重新执行请求
                requestFn().then(resolve).catch(reject);
              })
              .finally(() => {
                // 置空
                this.#fetchNewTokenPromise = null;
              });
          } else {
            reject(err);
          }
        });
    });
  }

  // 获取token的函数
  fetchNewToken() {
    return axios.create({ baseURL: this.#baseUrl }).get(this.#url, {
      headers: {
        Authorization: this.#getRefreshToken(),
      },
    })
      .then(this.#onSuccess)
      .catch(() => {
        this.#onError();
        return Promise.reject();
      });
  }
}

