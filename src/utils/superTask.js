export default class SuperTask {
  constructor(parallelCount = 2) {
    this.parallelCount = parallelCount // 并发数量
    this.tasks = [] // 任务列表
    this.runningCount = 0 // 正在执行的任务数量
  }
  // 运行任务
  #run() {
    // 当前任务数量小于并发数量 并且任务列表有任务
    while (this.runningCount < this.parallelCount && this.tasks.length > 0) {
      // 取出任务列表内的第一条任务， 并进行解构
      const { task, resolve, reject } = this.tasks.shift()
      this.runningCount++
      task()
        .then(resolve, reject)
        .finally(() => {
          this.runningCount--
          this.#run()
        })
    }
  }
  // 添加任务,task要求是一个函数，且返回值是promise
  add(task) {
    return new Promise((resolve, reject) => {
      this.tasks.push({
        task,
        resolve,
        reject
      })
      this.#run()
    })
  }
}
