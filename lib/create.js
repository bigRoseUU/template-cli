/** @format */
const inquirer = require('inquirer')
const path = require('path')
const getTemplates = require('../utils/getTemplates')
const pathJoin = src => path.join(process.cwd(), src)
const fse = require('fs-extra')
const consolidate = require('consolidate')
const Metalsmith = require('metalsmith')

/**
 * 内容生成指令
 * @param {Object} tmpConfig 项目的全局配置
 */
create = async function(tmpConfig) {
  let allTmp = [] // 模板集合

  // 读取所有的模板
  let templatesDirs = tmpConfig.templates
  for (let path of templatesDirs) {
    allTmp = allTmp.concat(getTemplates(pathJoin(path)))
  }

  // 选择要使用的模板 和 目标路径
  let answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '选择要使用的模板',
      choices: allTmp.map(item => ({
        name: item.name,
        value: item,
      })),
    },
    {
      type: 'input',
      name: 'targetFolder',
      message: '填写要创建模板的文件夹路径，如 packages/xxx-xxx',
      validate: async targetFolder => {
        let destination = pathJoin(targetFolder)
        if (!(await fse.pathExists(destination))) {
          return `目标地址：${destination}不存在, 请先创建对应文件夹`
        }
        return true
      },
    },
  ])

  let { template, targetFolder } = answer

  createByTmpObj(template, pathJoin(targetFolder))
}

/**
 * 根据 模板信息对象 和 目标路径 创建文件
 * @param {*} tmpObj 模板信息对象
 * @param {*} targetFolder 目标路径
 */
async function createByTmpObj(tmpObj, targetFolder) {
  let config = tmpObj.config || {} // 模板的配置实例
  let answers = {} // 用户交互信息对象

  // 运行 "创建文件前" 生命周期
  config.beforeCreate && config.beforeCreate()

  // 执行信息交互
  if (config && config.question) {
    answers = await inquirer.prompt(config.question)
    config.setAnswers(answers)
  }

  // 根据模板创建内容
  Metalsmith(__dirname)
    .source(tmpObj.tmpPath)
    .destination(targetFolder)
    .clean(false)
    .use((files, metalsmith, done) => {
      var metadata = metalsmith.metadata()
      Object.assign(metadata, answers)
      done()
    })
    .use(template)
    .build(function(err) {
      if (err) throw err
      console.log('应用已成功创建在: ', targetFolder)

      // 运行 "安装后" 生命周期
      config.mounted && config.mounted()
    })
}

function template(files, metalsmith, done) {
  var keys = Object.keys(files)
  var metadata = metalsmith.metadata()
  keys.forEach(file => {
    var str = files[file].contents.toString()
    consolidate.handlebars.render(str, metadata, function(err, res) {
      if (err) return done(err)
      files[file].contents = new Buffer(res)
      done()
    })
  })
}

module.exports = create
