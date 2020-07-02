#!/usr/bin/env node

const { program } = require('commander')
const appInfo = require('../package.json')
const create = require('../lib/create')

// 获取cli的项目配置
const defaultConfig = require('../config/default-config')
let getConfig = require('../utils/getConfig')
const tmpConfig = Object.assign(defaultConfig, getConfig())

program.version(appInfo.version, '-v, --version')

program
  .command('create')
  .description('create code by template')
  .action(() => {
    create(tmpConfig)
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
