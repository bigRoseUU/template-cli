/** @format */

const shell = require('shelljs')
const chalk = require('chalk')

/**
 * 模板配置类要继承的工具类
 */
class TemplateGenerator {
  answers = {} // 用于保存模板创建时用户回答的信息

  shell = shell // 用于运行终端名称

  chalk = chalk // 用于修改日志文案样式

  log = console.log // 用于输出日志

  // chalk 与 log 的结合，用法，this.chalkLog.red('hello world!')。目前不支持 chalk 的链式写法，只是一个简单的代理
  chalkLog = new Proxy(chalk, {
    get: function(target, propKey) {
      return function() {
        console.log(target[propKey](...arguments))
      }
    },
  })

  /**
   * 设置 answers
   * @param {Object} value
   */
  setAnswers(value) {
    Object.assign(this.answers, value)
  }

  /**
   * 生命周期： 模板创建前
   */
  beforeCreate() {}

  /**
   * 生命周期： 模板创建后
   */
  mounted() {}
}

module.exports = TemplateGenerator
