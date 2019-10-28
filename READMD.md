
## JM Design 小程序组件库

### 文档介绍

   基于微信小程序 开发的小程序端组件库，框架使用原生的小程序框架开发。

### 命令介绍

```bash
# 安装依赖
npm install

# 运行开发环境(将packages目录下文件打包到/example/dist下的，用于组件库开发)
npm run dev

# 打包插件库(将packages目录下文件打包到/lib下的，用于外部引用)
npm run build

# 运行开发环境（转换为微信语法，demo 文件夹为 example-wx）
npm run dev:wx

# 打包插件库（同时打包成京东和微信）
npm run build:wx
```

### 使用的技术栈

sass + 小程序

### 构建工具

gulp

### 开发流程

#### 使用京东小程序开发者工具开发，下载地址：http://doc.jd.com/ares/alldoc/JDmp/download/IDE%E4%B8%8B%E8%BD%BD.html

  1、运行 `npm run dev` 命令
  
  2、在京东小程序开发者工具中导入项目，项目地址选择 example 文件夹

  3、在京东小程序开发者工具上预览效果

  4、创建新组件

    

#### 使用微信开发者工具开发

### 项目架构

   ```html
   .
   ├── ReadMe.md
   ├── dist										packages通过gulp打包生成组件库，用于外部项目引入。
   │   └── button
   ├── example								    小程序开发工具打开的项目目录，用于组件库调用实例以及组件库测试操作
   │   ├── app.js
   │   ├── app.json								 内部的pages属性用于定义页面，开发哪个页面最好将其放在第一位，工具会默认设置第一个为初始化页面
   │   ├── app.wxss
   │   ├── dist									 组件库需要打包到小程序项目内使用。使用npm run dev 生成。
   │   ├── pages						         小程序项目页面使用目录
   │   ├── project.config.json
   │   └── sitemap.json
   ├── gulpfile.js					            组件gulp打包程序
   ├── package-lock.json
   ├── package.json
   └── packages									组件库
       ├── button									button组件
       ├── common								    组件公共样式与方法
       └── wxs									小程序wxs语法公共库
   ```

### 组件库开发步骤

   - [ ] 新建分支，用于组件开发。

   - [ ] 参照小程序原生框架（ https://developers.weixin.qq.com/miniprogram/dev/component/ ）进行封装，封装为自定义组件（ https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/ ）

   - [ ] 组件库packages下新建组件目录例如radio,下面新建index.js（参照小程序自定义组件库开发帮助说明）,index.scss（用于编写小程序样式，可使用sass语法，打包后会生成小程序样式库wxss）,index.json（用于声明新建的是一个自定义组件）,index.wxml（用于定义组件结构）

   - [ ] 小程序项目example开发：pages下新建目录radio,下面封装radio的radio.js，radio.json，radio.wxml，radio.wxss。

   - [ ] example/app.json   

     ```json
     {
       "pages": [
         "pages/index/index",
         "pages/button/button"
       ],
       "usingComponents": {
         "jmd-button": "dist/button/index"			//引入小程序自定义组件库，即打包后开发的工具组件库
       }
     ```
  可以在微信开发者工具中添加编译模式，将自己开发的组件页面设定为当前编译的页面。

  ![编译页面](https://img10.360buyimg.com/jmadvertisement/jfs/t1/69211/17/10309/119659/5d7f628fE022d5dcd/9534d56d95f58f5e.png)