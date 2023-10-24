module.exports = {
  // 继承eslint 官网推荐规则
  extends: ['eslint:recommended'],
  // 指定环境
  env: {
    node: true, // 启用Node.js 的全局变量和 Node.js 的范围
    browser: true, // 启用浏览器全局变量
    es2022: true // 添加所有 ECMAScript 2022 的全局变量，并自动将解析器选项 ecmaVersion 设置为 13
  },
  // 设置解析器选项
  parserOptions: {
    ecmaVersion: 'latest', // 指定要使用的 ECMAScript 语法的版本, "latest" 来使用受支持的最新版本
    sourceType: 'module', // es module
  },
  // 
  rules: {
    'no-var': 2 // 禁用var
  }
}