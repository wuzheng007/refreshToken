// 基于 Node.js 平台，快速、开放、极简的 Web 开发框架
const express = require('express')

// 创建应用对象
const server = express()

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 允许来自任何源的请求
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE') // 允许的 HTTP 方法
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization') // 允许的请求头
  next()
})

// 普通 token
let accessToken = null
// 刷新 token
let refreshToken = null

// 普通 token，10s过期
const ACCESS_EXPIRES = 30 * 1000
// 刷新 token，30s过期
const REFRESH_EXPIRES = 60 * 1000

// 模拟服务端缓存 accessToken
const getAccessToken = (() => {
  let timer = null
  return () => {
    if (timer) return accessToken
    accessToken = `accessToken ${Date.now()}`
    timer = setTimeout(() => {
      timer = null
      accessToken = null
    }, ACCESS_EXPIRES)
    return accessToken
  }
})()

// 模拟服务端缓存 refreshToken
const getRefreshToken = (() => {
  let timer = null
  return () => {
    if (timer) return refreshToken
    refreshToken = `refreshToken ${Date.now()}`
    timer = setTimeout(() => {
      timer = null
      refreshToken = null
    }, REFRESH_EXPIRES)
    return refreshToken
  }
})()

// 登录接口
server.post('/login', (req, res) => {
  console.log('请求登录')
  // 将两个 token 发送到前端
  setTimeout(() => {
    res.send({
      accessToken: getAccessToken(),
      refreshToken: getRefreshToken()
    })
  }, 500)
})

// 测试接口
server.get('/test', (req, res) => {
  console.log('请求测试')
  const _accessToken = req.headers.authorization
  // 将两个 token 发送到前端
  if (_accessToken !== accessToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  setTimeout(() => {
    res.send({
      name: '张三',
      age: 24,
      timestamp: Date.now()
    })
  }, 1000)
})
// 测试接口
server.get('/test2', (req, res) => {
  console.log('请求测试')
  const _accessToken = req.headers.authorization
  // 将两个 token 发送到前端
  if (_accessToken !== accessToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  setTimeout(() => {
    res.send({
      name: 'test2',
      age: 24,
      timestamp: Date.now()
    })
  }, 1000)
})

// 获取token的接口
server.get('/token', (req, res) => {
  console.log('请求token')
  const _refreshToken = req.headers.authorization
  if (_refreshToken !== refreshToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  setTimeout(() => {
    res.send({
      accessToken: getAccessToken()
    })
  }, 4000)
})

server.listen(8888, () => {
  console.log('成功启动端口：8888')
})
