/** @format */

const path = require('path')
const fse = require('fs-extra')

/**
 * 读取
 */
const getConfig = function(configFileName = 'tpl-cli.json') {
  let config = {}
  try {
    const configPath = path.join(process.cwd(), configFileName)

    if (fse.pathExistsSync(configPath)) {
      config = fse.readJSONSync(configPath)
    }
  } catch (e) {
    console.log(e)
  }

  return config
}

module.exports = getConfig
