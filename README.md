# Infinite-ui

A lightweight jQuery UI library

## Version
`1.2.0`

##Support
* Internet Explorer 8+

* Chrome 4+

* Firefox 5+

* IOS 6+

* Android 4.4.0+

## Installation


Install using npm:

```shell
$ npm install
```


## Usage

```shell
$ gulp build				//编译全部组件及css
```

```shell
$ gulp build:pc				//编译pc组件及css
```

```shell
$ gulp build:mobi			//编译mobile组件及css
```
```shell
$ gulp watch				//开发及预览

```
```shell
http://localhost:3000/examples/index.html
```

##History
* 2016年06月26日 更新记录：
  * 修复`alert`,`layer`弹出时`body`因`overflow:hidden`而跳动的问题
  * 优化`tip`插件，简化了接口，新增demo及文档

* 2016年06月16日 更新记录：
  * `1.2.0`的 `cookie` 不再向下兼容，升级后请对之前cookie的调用做修改
  * 优化`loading`插件，增强调用的灵活性


* 2016年06月14日 更新记录：
  * `mPicker` 增加 `display` 显示方式和 `isshort` 简写参数
  * `validate` 增加了一条生日的验证规则 `isBirthday`
  * `layer` 增加显示的回调函数 `showCall`
  * 新增分享组件 `share`
  * 后台错误提示组件 `ajaxError`
  * 唯一字段邮箱或者手机显示隐藏组件 `exist`（活动专用）



* 2016年06月13日 **适配`webpack`模块加载  `version 1.2`**

* 2016年6月13日 重构`placeholder`组件，使用label模拟,避免提交出错

* 2016年6月12日 重构`layer`组件的居中方式及动画效果

* 2016年6月8日 更新记录：
  * `ajaxForm`增加always回调和对ajax2的支持
  * `tokenize`优化js和css代码，增加搜索回调函数和可以限制输入搜索的字符的长度


* 2016年6月3日 新增`dialog`组件

* 2016年5月30日 新增`pagination`组件

* 2016年5月23日 `tokenize`增加多级列表选择

* 2016年5月5日 修复`tokenize`的多个初始选项bug，增加只读模式，只读模式只能显示初始选项（不能删除、增加）

* 2016年03月29日 增加初始选项及禁止删除功能，修复`tokenize`的多次调用bug

* 2016年03月21日 更新记录：
  * 重构`layer`组件，降低耦合度
  * 新增`mpicker`组件


* 2016年03月11日 新增`tokenize`组件

* 2016年03月05日 新增`validate`组件

* 2016年03月01日 取消`animated`库的依赖

* 2016年02月29日 **重构项目结构，`version 1.1.0`**

* 2016年02月23日 修复`ajaxForm`的一些细节bug

* 2016年02月18日 优化`layer`、`tooltip`组件

* 2015年09月21日 新增`layer`、`alert`的用例

* 2015年09月17日 修改动画效果，支持[animated.css](https://daneden.github.io/animate.css/)库

* 2015年09月14日 新增`placeholder`组件

* 2015年09月11日 新增`alert`组件

* 2015年09月08日 新增`tooltip`组件

* 2015年08月29日 `Infinite-UI Library 1.0` 正式上线全局

* 2015年08月27日 新增`ajaxForm`组件

* 2015年08月23日 新增`pub/sub`全局功能

* 2015年08月19日 代码重新整理，并使用`gulp`+`compass`来构建本项目

* 2015年08月17日 新增`loading`全局功能

* 2015年08月15日 新增`pub/sub`全局功能

* 2015年08月11日 新增`layer`组件

* 2015年08月10日 更新记录：
  * 新增`returnTop`组件
  * 新增IUI库扩展功能，支持`AMD`、`CMD`模块加载


* 2015年08月09日 完成`emailSuffix`组件

* 2015年08月08日 完成`tab`组件

* 2015年08月07日 着手开发`Infinite-UI Library`
