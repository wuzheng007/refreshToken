// 一个添加了一些安全性的查询字符串解析和字符串化库，可以把对象转成字符串，也可以把字符串转成对象
import qs from 'qs'

// 保存着相同请求（method, url, params, data全部相同）的控制器
const abortControllerMap = new Map()

/**
 * @Date 2023-10-21 19:30:25
 * @introduction 生成key
 * @description 传入一个config对象，生成一个key（相同请求（method,url,params,data都相同）会生成一样的key）
 * @param {Object} config axiso的配置对象config
 */

function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}
/**
 * @Date 2023-10-21 19:34:42
 * @introduction 向abortControllerMap中添加一个控制器
 * @description 传入一个配置对象config，先移除之前的控制器，再向abortControllerMap中添加一个控制器
 * @param {Object} config axiso的配置对象config
 */
function addAbortController(config) {
  removeAbortController(config)
  const requestKey = generateReqKey(config)
  const controller = new AbortController()
  config.signal = controller.signal
  abortControllerMap.set(requestKey, controller)
}
/**
 * @Date 2023-10-21 19:38:32
 * @introduction 从abortControllerMap中移除一个控制器
 * @description 传入一个配置对象，从abortControllerMap中移除一个控制器
 * @param @param {Object} config axiso的配置对象config
 */
function removeAbortController(config) {
  const requestKey = generateReqKey(config)
  if (abortControllerMap.has(requestKey)) {
    const abortController = abortControllerMap.get(requestKey)
    abortController.abort()
    abortControllerMap.delete(requestKey)
  }
}

export {
  addAbortController,
  removeAbortController
}
