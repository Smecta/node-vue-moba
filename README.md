# node-vue-moba
nodejs+vuejs

## 初始化项目

创建 server 文件夹
运行 `npm init -y` 生成 package.json 文件
在 server 文件夹下创建 index.js 
在服务端里面自定义一个脚本如下：
* 修改 package.json 文件
* "scripts" 添加 ```"server":"nodemon index.js"```
### 默认安装vue npm i -g @vue/cli 全局安装vue
### 安装nodemon 全局安装 npm i -g nodemon 
在 server 文件夹下 使用 `npm run server` 启动服务器

在根文件夹下，使用 `vue create web` 选择默认 创建 web 
在根文件夹下，使用 `vue create admin` 选择默认 创建 admin

## 搭建管理后台基础界面
基于 Element UI 的后台管理基础界面搭建
进入 admin 文件夹下 运行 `npm run serve`

打开element 官网 找到Container 布局容器相关代码 

安装插件1
element ui 

安装方法
安装 element 在 admin 文件夹下 运行 `vue add element` 选择默认即可
完全引用，直接回车默认即可

安装插件2
router 路由插件
安装方法
添加 路由  `vue add router` 不使用history mode 

修改element ui 界面 如下：
1. 安装好route，检查页面是否有home和about标签跳转连接
2. 检查admin目录下的是否有views,新建Main.vue 作为主要入口文件
3. 将elementui 的布局容器代码 复制黏贴到Main.vue里面，注意：将内容（除去style和script）添加```<template>```标签里面
4. 将app.vue `<template>`里只保留 ````<router-view/>````
5. 将app.vue 的style 去除，自定义css样式调整页面
6. 将router文件夹下里面的index.js 进行调整，把Main.vue 引入进来，将Home引入方法拷贝一下并修改，去除Home引入否则报错
7. 将 path 下的 name , component 值改成Main，删除about的路由规则，已完成路由修改

