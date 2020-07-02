# conf-tpl-cli
可读取模板文件，根据模板自带的配置生成内容，受 [YEOMAN](https://yeoman.io/) 启发

  - [安装](#安装)
  - [创建模板文件](#创建模板文件)
    - [模板目录结构](#模板目录结构)
    - [tpl-config.js 例子](#tpl-configjs-例子)
    - [TemplateGenerator 类](#templategenerator-类)
    - [模板文件写法](#模板文件写法)
  - [使用](#使用)
    - [创建文件](#创建文件)
  - [配置](#配置)
    - [tpl-config.json](#tpl-configjson)

## 安装

```
npm install install conf-tpl-cli -g
# OR
yarn global add conf-tpl-cli
```

## 创建模板文件

### 模板目录结构

一个模板包含了 `tpl-config.js` 和 `template` 

其中 `tpl-config.js` 可以没有，这样创建模板就会直接复制  `template` 中的文件，不做任何处理

```
app-template
├─tpl-config.js // 配置文件
├─template // 存放模板内容
|    ├─package.json
|    ├─src
|    |   └index.html
```

### tpl-config.js 例子

配置文件必须输出一个继承于 [TemplateGenerator 类](#templategenerator-类) 

```javascript
const { TemplateGenerator } = require('conf-tpl-cli') // 配置类

module.exports = class AppTmp extends TemplateGenerator {
  /**
   * 此值用于创建模板时显示的模板名称
   */
  name = '应用模板'

	/**
   * 模板所需数据,
   * 参考 inquirer 的配置
   * 获取的数据将用于模板编译
   */
  get question() {
    return [
      {
        type: 'input',
        name: 'appName',
        message: '请指定应用的名称(全小写，中划线连接。如：smart-parking)：',
        validate: appName => {
          if (!/^[-a-z0-9]+$/.test(appName)) {
            return '应用名称不合法'
          }
          return true
        },
      },
      {
        type: 'input',
        name: 'port',
        message: '请指定应用的运行端口(如有默认值，可直接使用默认值)：',
        default: this.answers.port || '', // 可读取 answers 对象的值
        validate: port => {
          if (!/^[0-9]+$/.test(port)) {
            return '端口不合法'
          }
          return true
        },
      },
    ]
  }
	/**
   * 模板创建前的生命钩子，在 question 触发前
   */
	beforeCreate () {
    console.log('beforeCreate')
    this.setAnswers({
      port: 8080,
    })
  }

	/**
   * 模板创建后的生命钩子，可以做一些自定义操作
   */
  mounted() {
		console.log(this.answers) // 在钩子或是类方法中可以读取到 answers 对象
    
    this.shell.exec('yarn install')
  }
}
```

### TemplateGenerator 类

一个用于输出配置的工具类，继承这个类后，会有以下功能

* this.answers :  用于存放 question 完成后的信息，一个对象

* this.setAnswers：用于设置 this.answers 的值

  ```
  this.setAnswers({
  	port: 8080,
  })
  ```

* this.shell: 用于运行终端命令

* this.log: 就是 console.log 的简写

* this.chalk: 用于修改日志文案样式，用法见[文档](https://github.com/chalk/chalk)

### 模板文件写法

在模板文件中 用 `{{ appName }}` 的写法替换由 question 运行后获得的信息

package.json

```
{
	name: "{{ appName }}",
	"version": "0.1.0",
	...
}
```

## 使用

### 创建文件

当我们创建了不同的模板后，要将其统一放在一个文件夹下，默认为项目根目录下的 `templates` ，`create` 命令会读取

里面符合要求的模板并列表出来。也可以通过在根目录创建一个 tpl-config.json 来配置 模板 放置的地方

```
conf-tpl-cli create
```

## 配置

### tpl-config.json

用于配置 `conf-tpl-cli` 在当前项目下的动作

```json
{
  "templates": ["templates"] // 模板放置的地方，默认为根目录下的 templates 文件夹
}
```


