import {
  LOCAL_ACCESS_KEY,
  LOCAL_REFRESH_KEY,
} from './consts/index.js'

import {
  login,
  test,
  test2
} from './api/index.js'

const usernameEl = document.querySelector('.box .username')
const loginBtn = document.querySelector('.login-btn')
const reqBtn = document.querySelector('.req-btn')
const cancelBtn = document.querySelector('.cancel-btn')

loginBtn.addEventListener('click', async () => {
  try {
    const { data } = await login()
    console.log('data', data)
    localStorage.setItem(LOCAL_ACCESS_KEY, data.accessToken)
    localStorage.setItem(LOCAL_REFRESH_KEY, data.refreshToken)
  }catch(err) {
    console.log(err)
  }

})

reqBtn.addEventListener('click', async () => {
  try {
    let { data } = await test()
    console.log('测试接口', data)
    usernameEl.textContent = data.timestamp
  } catch (err) {
    console.log('===', err)
  }
})
cancelBtn.addEventListener('click', async () => {
  try {
    const { data } = await test2()
    console.log('测试接口2', data)
    usernameEl.textContent = data.timestamp
  } catch (err) {
    console.log('===', err)
  }
})
