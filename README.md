# node-vue-moba
nodejs+vuejs

git方法：
git add .
git commit -am "初始化"
git push -u node-vue-moba master

## 初始化项目

创建 server 文件夹

在根文件夹下，使用 `vue create web` 选择默认 创建 web 

在根文件夹下，使用 `vue create admin` 选择默认 创建 admin

在server初始化 进入server
运行 `npm init -y` 生成 package.json 文件
在 server 文件夹下创建 index.js 入口文件
在服务端里面自定义一个脚本如下：
* 修改 package.json 文件
* "scripts" 自定义脚本 添加 ```"serve":"nodemon index.js"```
* 
> 安装nodemon 全局安装 npm i -g nodemon 
  
> 默认安装vue npm i -g @vue/cli 全局安装vue脚手架

在 server 文件夹下 使用 `npm run serve` 启动服务器



## 搭建管理后台基础界面
基于 Element UI 的后台管理基础界面搭建
进入 admin 文件夹下 运行 `npm run serve`

打开element 官网 找到Container 布局容器相关代码 
> vue add element 默认安装
> vue add router 不使用history mode 
1. 安装插件
element ui 插件

安装方法
安装 element 在 admin 文件夹下 运行 
`vue add element` 
选择默认即可
完全引用，直接回车默认即可

2. 安装插件
router 路由插件

安装方法
添加 路由  
`vue add router` 
不使用history mode 


修改element ui 界面 如下：
1. 安装好route，检查页面是否有home和about标签跳转连接
2. 检查admin目录下的是否有views,新建Main.vue 作为主要入口文件
3. 将elementui 的布局容器代码 复制黏贴到Main.vue里面，注意：将内容（除去style和script）添加```<template>```标签里面
4. 将app.vue `<template>`里只保留 ``` <router-view/>```
5. 将app.vue 的style 去除，自定义css样式调整页面 
    ``` css 
    html,body {
        margin: 0;
        padding: 0;
    } 
    ```
6. 将router文件夹下里面的index.js 进行调整，把Main.vue 引入进来，将Home引入方法拷贝一下并修改，去除Home引入否则报错 ` import Main from '../views/Main.vue'`
7. 将 path 下的 name , component 值改成Main，删除about的路由规则，已完成路由修改
8. 设置Main.vue 的 element的布局容器 其中 整体样式只保留高度 100vh


### 创建 分类
修改前端界面 Main.vue  
1. 修改左侧导航菜单
2. 修改el-menu 添加router 属性 
3. 修改el-menu-item 添加index分页路径
4. 在views文件夹下创建分类子页面 CatagoryEdit.vue
5. 设置router文件夹下 index.js
   1. 引入CatagoryEdit.vue ``` import CategoryEdit from "../views/CategoryEdit.vue" ```
   2. 在 main 下添加 children路径

    ``` js 
    children: [
        { path: "/categories/create", component: CategoryEdit }
    ], 
    ```
   3. 在Main.vue中找到合适的位置添加 子路由` <!-- 路由容器  添加子路由定义path--> <router-view></router-view>`
6. 设置子路由CategoryEdit.vue页面
   1. 添加element 表单元素
   2. 设置el-form 样式和原生默认阻止提交设置并给一个save方法 ` @submit.native.prevent="save" `
   3. 在data中定义一个model值 在input标签内进行v-model 双向绑定数据
   4. 在methods中添加save()方法 提交数据
   5. 安装 axios 插件 来请求接口提交数据
      1. 安装方法 ` npm i axios `
        > 安装axios npm i axios 
      2. 建议接口请求每一个功能写一个js 然后导出放到main.js中引用
      3. 在main.js同级 创建一个http.js
         1. 引入axios
         2. 定义一个http 创建axios 实例
         3. 添加baseURL属性 路径
         4. 导出文件
        ``` js
        import axios from 'axios'

        const http = axios.create({
            baseURL:'http://localhost:3000/admin/api'
        })

        export default http
        ```
      4. 在main.js 引入http变量

         1. 将http加载vue原型实例 可以在任意页面使用$http 访问数据请求接口
        ``` js
        import http from './http'
        Vue.prototype.$http = http
        ```
   6. 在save()方法里 可以使用` this.$http.post() `
   7. 下面开始写接口 切到服务端server

### server 服务端写接口
在server文件夹下  
1. 启动服务端 ` npm run serve`
2. 安装常用模块
   1. ` npm i express@next mongoose cors ` mongoose连接数据库 和cors 跨域请求
   > 安装 express mongoose cors 
   > npm i express@next mongoose cors 
   2. 


    