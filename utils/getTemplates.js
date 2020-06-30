/** @format */
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const TemplateGenerator = require('../lib/template-generator')
/**
 * 根据模板目录读取模板
 * @param {*} rootPath 存放模板的目录
 * @return {Object[]} tmpObjs - 模板信息对象
 * @return {string} tmpObjs[].name - 模板名称
 * @return {string} tmpObjs[].tmpPath - 模板存放路径
 * @return {Object} tmpObjs[].config - 模板配置对象
 * @return {string} tmpObjs[].configPath - 配置存放路径
 */
function getTemplates(rootPath) {
  let result = []
  try {
    let dirs = fs.readdirSync(rootPath) // 模板的目录下的文件夹
    dirs.forEach(item => {
      let templatePath = path.join(rootPath, item, 'template') // 模板路径
      let configPath = path.join(rootPath, item, 'tpl-config.js') // 模板配置路径
      try {
        let tmpObj = {}
        result.push(tmpObj)

        // 写入模板路径
        if (!fse.pathExistsSync(templatePath)) return
        tmpObj.tmpPath = templatePath
        tmpObj.name = item

        // 写入模板配置路径和配置类
        if (!fse.pathExistsSync(configPath)) return
        tmpObj.configPath = configPath
        let configClass = require(configPath)
        if (configClass) {
          tmpObj.config = new configClass()
          tmpObj.name = tmpObj.config.name || tmpObj.name
          if (!(tmpObj.config instanceof TemplateGenerator)) {
            console.log(chalk.red(tmpObj.name, '的配置文件输出的类必须继承自 TemplateGenerator '))
          }
        }
      } catch (e) {
        console.log(e)
      }
    })
  } catch (e) {
    console.log(e)
  }

  return result.filter(item => !!item.tmpPath)
}

module.exports = getTemplates
