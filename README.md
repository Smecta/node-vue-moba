# node-vue-moba
nodejs+vuejs+express+element-ui

git方法：

* git add .

* git commit -am "初始化"

* git push -u node-vue-moba master


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
6. 将router文件夹下里面的router.js 进行调整，把Main.vue 引入进来，将Home引入方法拷贝一下并修改，去除Home引入否则报错 ` import Main from '../views/Main.vue'`
7. 修改main.js `import router from './router/router'`
8. 将 path 下的 name , component 值改成Main，删除about的路由规则，已完成路由修改
9. 设置Main.vue 的 element的布局容器 其中 整体样式只保留高度 100vh


### 创建 分类
修改前端界面 Main.vue  
1. 修改左侧导航菜单
2. 修改el-menu 添加router 属性 
3. 修改el-menu-item 添加index分页路径
4. 在views文件夹下创建分类子页面 CatagoryEdit.vue
5. 设置router文件夹下 router.js
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
   7. 下面开始写接口 切到服务端server 参照接口写法
   8. 在views/CategoryEdit.vue 内 save()方法里
   ``` js 
    async save(){
            // 发起接口请求 提交到 categories 接口，传递参数 this.model
            // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
            const res = await this.$http.post('categories', this.model)
            // 跳转分类列表页面
            this.$router.push('/categories/list')
            // 用elementui 提供message 方法，提示成功消息
            this.$message({
                type:'success',
                message:'保存成功'
            })
        }

   ```



### server 服务端写接口
在server文件夹下  
1. 启动服务端 ` npm run serve`
2. 安装常用模块
   1. ` npm i express@next mongoose cors ` mongoose连接数据库 和cors 跨域请求
   > 安装 express mongoose cors 
   > npm i express@next mongoose cors 
3. 打开 index.js 配置基本信息
   ``` js 
    // 引入 express
    const express = require('express');

    // 定义app 是express实例
    const app = express()

    // app.listen 启动 3000端口，同时传入一个回调函数。表示启动之后让它做什么
    app.listen(3000, () => {
        console.log('http://localhost:3000')
    });

   ```
4. 写具体路由API 在server 下新建 routes 文件夹
   1. 新建admin文件夹，表示后端文件夹 新建index.js
   2. 在index.js里 （路由里面的index.js）
   3. 路径为：server/routes/admin/index.js
   ``` js

    // 使用module.exports导出一个函数 app 这个函数接收一个app对象 里面可以用外层app

    module.exports = app => {
        // 定义个 express
        const express = require('express');
        // 定义一个路由router express的子路由，需要的时候就用它
        const router = express.Router();
        
        // 加一个post方法，接口地址是这个分类
        router.post('/categories', async(req,res) => {

        })

        // 使用这个app.use（路由地址,子路由挂载）为后续的增删改查提供路由
        app.use('./admin/api', router )
    }
   ```
   4. server 下 index.js
    ``` js
    // 定义app 是express实例
    const app = express()
    // 引用过来是个函数，执行函数同时传入app 这样admin里面就可使用app
    require('./router/admin')(app)
    ```
5. 连接mongodb数据库
   1. 在server文件夹下新建一个plugins文件夹 进入plugins下新建db.js
   2. 路径为：server/index.js
    ``` js
        // 引用过来是个函数，使用同样的方式使用
        require('./plugins/db')(app)
        // 引用过来是个函数，执行函数同时传入app 这样admin里面就可使用app
        require('./router/admin')(app)
    ```
   3. 路径为：server/plugins/db.js
        ``` js
        // 数据库插件写法
        // module.exports 导出是一个函数 接收的是一个app 
        module.exports = app => {

            // 定义mongoose
            const mongoose = require('mongoose');
            // mongoose 连接 node-vue-moba这个数据库
            mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
                // 连接的参数 必须要加
                useNewUrlParser: true
            })    
        }
        ```
6. 模型文件
   1. 在server文件夹下 新建一个models文件夹 用来存放模型 在里面建立Category.js 分类模型
   2. 路径为：server/models/Category.js
        ``` js 

        // 引入mongoose
        const mongoose = require('mongoose');

        // 建立schema 用它定义模型字段有那些
        const schema = new mongoose.Schema({
            // 名字/类型：字符串
            name: { type: String }
        });

        // 导出mongoo.module 的模型
        module.exports = mongoose.model('Categroy', schema)
        ```
7. 引入模型文件，分类接口定义，那里需要就去那里引用
   1. 在 server/routes/admin/index.js
        ``` js
        // 引用Category模型
        const Category = require('../../models/Category');

        // 加一个post方法，接口地址是这个分类
        router.post('/categories', async(req,res) => {
            //创建数据 数据来源是req.body 但是要在index.js添加中间件json 定义一个model 
            const model = await Category.create(req.body)
            // 发回客户端，让客户端知道创建完成，创建的数据是什么
            res.send(model)
        })

        // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
        // 分类接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
        app.use('./admin/api', router )
        ```
   2. 中间要再server/index.js 添加中间件json和跨域模块
        ``` js
        // 定义app 是express实例
        const app = express()

        // 引用跨域模式，加括号是为了使用它
        app.use(require('cors')())
        // 加入中间件 express.json() 
        app.use(express.json())

        ```

### 分类列表
1. 分类列表页实现 之数据展示
   1. 在admin下src下views下创建CategoryList.vue
   2. 路由router下 router.js 和创建列表一样引用和添加 children 子路径
   3. 在列表页面写入el-form 表格，表格需要提供数据 items  items绑定数据到data中
   4. 创建methods下的 fetch()方法获取API接口数据，后端配置查找API
      1. 去server端下routes下admin下index.js 添加分类列表接口 
        ``` js
        // 分类查找
        // 使用get方法
        router.get('/categories', async(req,res) => {
            //使用 Category.find()方法获取数据，使用limit()方法限制数据只显示10条 定义给items
            const items = await Category.find().limit(10)
            // 发回客户端，让客户端知道创建完成，创建的数据是什么
            res.send(items)
        })

        // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
        // 分类接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
        app.use('/admin/api', router ) 
        ```
        ``` js
            async fetch(){
                const res = await this.$http.get('categories')
                console.log(res)
                this.items = res.data
                }
        ```
   5. 再创建created()函数方法 执行fetch()方法,才能获取数据
    ``` js 
        created(){
            this.fetch()
        }
    ```
### 分类编辑 列表中查找某个数据
1. 利用创建页面，实现编辑页面保存修改功能
2. 利用element 找到table 复制操作代码块
3. 在分类列表增加一列，只保留编辑
4. 添加跳转地址用es6模板字符串，传递${scope.row._id} 是本行的_id
   ``` js
    <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
            <el-button type="text" size="small" @click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
        </template>
    </el-table-column>
   ```
5. 设置admin 下的router下的router.js

   ``` js
    children: [
        { path: "/categories/create", component: CategoryEdit },
        { path: "/categories/edit/:id", component: CategoryEdit, props:true },
        { path: "/categories/list", component: CategoryList }
        ],
   ```
6. 两个不同的地址使用同一个页面组件，后面要添加props为true,在CategoryEdit.vue可以使用变量id 需要用props去接收数据 id对象 和使用this.$route.params.id 效果一样，这样的好处就是跟路由尽可能的解耦，不用写这么长this.$route.params.id的写法
   CategoryEdit.vue
   ``` js 
    props: {
        id: {}
        <!-- id: {type:string} -->
    },
    data(){
        return{
            model:{},
        }
    },
   ```
7. 设置这个页面动态新建编辑分类 利用三元运算符
   ``` JS
    <h1>{{id ? '编辑':'新建'}}分类 </h1>
   ```
8. 编辑页面获取原来的数据 
   1. 在created() 里面 自动执行一个方法获取数据，要判断一下，如有有this.id 才执行
   ``` js
   created(){
        this.id && this.fetch()
   }
   ```
   2. 再写个fetch()方法，去请求这个接口，需要去后端写接口
   3. 写后端接口 server 下routes下admin下index.js
    ``` js 
    // 分类查找 获取某一个详细页接口
    router.get('/categories/:id', async(req,res) => {
        //定义 model 使用 Category.findById() 其中req.params是指命名路由的需求参数，express中的
        const model = await Category.findById(req.params.id)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

    ```
    4. 写fetch()方法
    ``` js
    async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`categories/${this.id}`)
            this.model = res.data
        }

    ```
    5. 编辑后保存数据的方法有变,这里写了一个判断，如果有ID 则使用put 反之则post,这里接着写后端put接口,完成修改新建在一个save()方法中
    ``` js
     async save(){
            // console.log("ok")
            if(this.id){
                await this.$http.put(`categories/${this.id}`, this.model)
            }
            else{
                // 发起接口请求 提交到 categories 接口，传递参数 this.model
                // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
                // const res = await this.$http.post('categories', this.model)
                await this.$http.post('categories', this.model)
            }
            
            // 跳转页面
            this.$router.push('/categories/list')
            // 用elementui 提供message 方法，提示成功消息
            this.$message({
                type:'success',
                message:'保存成功'
            })
        },

    ```
    server/routes/admin/index.js
    ``` js
    // 创建分类
    //加一个put方法，接口地址是这个分类,路径url要加:id,
    router.put('/categories/:id', async(req,res) => {
        //定义一个model 把create 换成 findByIdAndUpdate()方法，接收两个参数，一个是id,第二是内容req.body
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

    ```
### 分类删除 列表中查找某个数据进行删除
1. 在分类列表页面 编辑下面添加删除按钮
2. 绑定点击事件 执行remove()方法 传入scope.row 这一行 也就是 remove(scope.row)
   ``` js 
    <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
   ```
3. 在methods 写 remove(row){} 传入一个row 
   ``` js 
   async remove(row) {

   }
   ```
4. 使用element ui 的messageBOX弹框 请求接口，然写接口
   ``` js
   async remove(row) {
      // 添加elementui的 Message Box 的this.$confirm()方法
      this.$confirm(`是否确定要删除分类"${row.name}"?`,'提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 请求接口 使用delete去请求 url是categories/${row._id} 是下划线id 使用await then后必须使用async 
          await this.$http.delete(`categories/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取获取一下数据
          this.fetch()
        })
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        // });
    }
   ```
   接口写法
   ``` js
   // 删除分类 指定ID的删除
    // 加一个delete方法，接口地址是这个分类,路径url要加:id,
    router.delete('/categories/:id', async(req,res) => {
        //不需要返回值  findByIdAndUpdate()方法换成findByIdAndDelete()，接收两个参数，一个是id,第二是内容req.body
        await Category.findByIdAndDelete(req.params.id, req.body)
        // 发回客户端，返回一个 success 为true
        res.send({
            success: true
        })
    })
   ```


### 添加子分类 
* 逻辑上父子级关系 实际上是数据库是扁平数据是平行的
1. 在分类下面增加子类 建立父子级关系
2. 在编辑分类页面，增加上级分类 parent
3. 设置上级分类 parent 为 element ui 下拉菜单 select option  
4. 在data中添加 parents数据为列表[] 
5. 写获取数据方法 
   1. 请求方法 可以单独写一个请求api接口 如 this.$http.get(`categories/parent-options`) 这样的后端定义一个路由就可以了
   2. 现在直接简单做法使用分类列表这个路由
   3. 在created() 添加获取方法
    ``` js
    async fetchParents(){
            // 获取分页列表数据给parents
            const res = await this.$http.get(`categories`)
            // console.log(res.data)
            this.parents = res.data
    ```

    ``` js
    created(){
        this.fetchParents()
        this.id && this.fetch()
    }
    ```

   ``` js
    <el-form-item label="上级分类" >
        <el-select v-model='model.parent'>
            <!-- label 显示的内容 这里写name，value是这个数据真实存的内容，这里写_id -->
            <el-option v-for="item in parents" :key="item._id"
            :label="item.name" :value="item._id" ></el-option>
        </el-select>
    </el-form-item>
   ```
   4. 保存数据到数据库
      1. 更改模型类型
        ```js
        name: { type: String },
        // 定义个字段，type不能是string 是特殊类型，是一个mongoose.SchemaTypes.ObjectId 类型要保存关联的id 表示是数据库里面的ObjectId 同时指定一个ref 表示它关联的模型，这里是本身模型 
        // 去分类模型当前的这个id找等于parent的id 就能把这个父级分类找出来
        parent: { type: mongoose.SchemaTypes.ObjectId, ref:'Categroy' },
        ```
      2. 看分类列表里展示出来 
         1. 添加分类列表增加一列为上级分类
            ``` js
                <el-table-column prop="parent.name" label="上级分类"> </el-table-column>
            ```
         2. 此时展示出来的 parent是 id 需要展示parent.name
         3. 修改分类列表的接口 使用.populate("parent")，如果不加parent 是字符串的ID 跟存入数据库一模一样，但是加完关联查询之后，这个populate就是对象了，在前端修改为prop="parent.name"
            ``` js
            // 分类列表
            // 使用get方法
            router.get('/categories', async(req,res) => {
                //使用 Category.find()方法获取数据，使用limit()方法限制数据只显示10条 定义给items
                const items = await Category.find().populate('parent').limit(10)
                // 发回客户端，让客户端知道创建完成，创建的数据是什么
                res.send(items)
            })  
            ```
### 通用CURD接口
路径不一样  模型不一样
创建 查找 更新 删除  是一样的

通过一套 给所有的接口使用
前端需要分开写，后端接口可以写通用的 实际要根据情况写通用接口，一定要考虑通用性和扩展性

模型不能通用

路径改成动态参数 命名规范是复数变成单数
接口添加前缀 /rest 后面添加动态参数 /:resource 

修改后端接口路径和模型名称
以分类列表为例
> ` npm i inflection` 这个模块 专门处理单复数转换，下划线以及单词的格式转换
``` js
    // 分类列表
    // 使用get方法
    router.get('/', async(req,res) => {
        // console.log("转换前："+ req.params.resource)
        // //转换类名 classify()方法  小写复数转大写单数的 类名转换的方法 注意这里只是针对类名规范的，如果取名字不规范这方法不适用  
        // const modelName = require('inflection').classify(req.params.resource)
        // console.log("转换后："+ modelName)
        // // npm i inflection 这个模块 专门处理单复数转换，下划线以及单词的格式转换
        // const Model = require(`../../models/${modelName}`)
        //使用 Model.find()方法获取数据，使用limit()方法限制数据只显示10条 定义给items
        // const items = await req.Model.find().populate('parent').limit(10)
        // 这里需要特殊处理一下 利用setOptions()方法 因为有的需要关联查，有的不需要关联查，所以使用这个方法，加上条件选择，如果是这个分类，那就使用关联差，如果不是，那就为空
        let queryOptions = {}
        // 如果模型名称符合判断条件，则给queryOptions的populate 传入 parent
        // 这块用if判断modelName不怎么好，建议在Category这Model里写queryOptions，再判断是否存在Model.queryOptions
        if (req.Model.modelName === 'Categroy') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(items)
    })
```


``` js
    const router = express.Router({
        // 在app.use定义的参数，又要在router里面使用这个参数，需要添加特殊参数 表示合并url参数，这里是要把父级定义的url参数传递给router里面的路由来都能访问到
        mergeParams: true
    });
    // 引用Category模型
    // const Category = require('../../models/Category');
    // 增加动态模型 每一个路由里面找到对应的模型是什么
    ...
    ...
    ...

    // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
    // 分类接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
    // 增加中间件 放到前置处理，当存在next()方法就会调用这个方法，执行下一步 也就是处理函数,请求地址后先用这个处理
    app.use('/admin/api/rest/:resource', async(req, res, next) => {
        console.log("转换前："+ req.params.resource)
        // npm i inflection 这个模块 专门处理单复数转换，下划线以及单词的格式转换
        //转换类名 classify()方法  小写复数转大写单数的 类名转换的方法 注意这里只是针对类名规范的，如果取名字不规范这方法不适用  
        const modelName = require('inflection').classify(req.params.resource)
        console.log("转换后："+ modelName)
        //定义Model 通过模型的名称经过 require 过来的得到模型的类  如果是const 后面访问不到，需要加上req.Model 表示 给请求对象上async(req, res, next)的 req 挂载个一个属性model 是这个require过来的模型 注意experss 链式操作 平时接口返回数据是最终状态，所以不需要next() 一般都省略
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router )

```


修改前端 所有请求接口路径 增加前缀rest/
``` js
    async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`rest/categories/${this.id}`)
            this.model = res.data
        },
```

### 制作物品 模型
1. 在Main.vue 添加 左侧菜单  物品 菜单
    ``` js
    <el-menu-item-group>
    <template slot="title">物品</template>
    <el-menu-item index="/items/create">新建物品</el-menu-item>
    <el-menu-item index="/items/list">物品列表</el-menu-item>
    </el-menu-item-group>
    ```
   1. 在 admin 文件夹下复制新建分类到新建物品 名称 图标 
   2. 在 admin 文件夹下复制分类列表到物品列表
2. 添加 路由 在router.js 复制分类 添加 引入 和 路由 
   ``` js
    import ItemEdit from "../views/ItemEdit.vue";
    import ItemList from "../views/ItemList.vue";
    ...
    ...

    { path: "/items/create", component: ItemEdit },
    { path: "/items/edit/:id", component: ItemEdit, props:true },
    { path: "/items/list", component: ItemList },
   ```
3. 在server下创建模型 item.js 复制分类模型，修改对应的模型名称 增加icon字段
    ``` js

    // 引入mongoose
    const mongoose = require('mongoose');

    // 建立schema 用它定义模型字段有那些
    const schema = new mongoose.Schema({
        // 名字/类型：字符串
        name: { type: String },
        // 这里是将用户上传的图片不保存到后端数据库里面，而是将图片上传到一个地址，然后给前端提供一个图片地址即可，这里类型是字符串
        icon: { type: String },
    });

    // 导出mongoo.module 的模型
    module.exports = mongoose.model('Item', schema)
    ```
4. 接口因为是通用的，无须修改 同分类
5. 修改新建物品和物品列表的请求url地址 即可

##### 物品 图标  上传 
1. 使用element ui 自带的用户头像上传uploader 这里css样式也要复制过来 其中:action 动态获取 文件地址  
    ``` js
    <el-form-item label="图标">
          <!-- :action 前面加个 accept="image/*" 只允许上传图片 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >   
          <!-- 判断，如有有图片显示图片否则显示图标 -->
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </el-form-item>
    ```
2. 在物品编辑页面添加 afterUpload()方法
    ``` js
    afterUpload(res){
        // vue 数据响应式的问题，数据一开始没定义，后面再赋值可能赋值不成功，使用vue的显示赋值$set() 方法第一个参数赋值的主题，第二个是赋值的属性 设置这个属性，第三个是值
          this.$set(this.model, 'icon', res.url)
        //   this.model.icon = res.url
          console.log(res.url)
      },
    ```
3. 编写server 下 routes/admin/index.js
   > multer 插件 ` npm i multer ` 
   ``` js
    // 图片文件上传接口 express 本身获取不到上传文件数据
    // 需要中间件处理，专门处理上传文件数据的 multer 插件 npm i multer

    const multer = require('multer')
    // multer()方法，目标dest 地址 使用绝对地址 
    const upload = multer({ dest: __dirname + '/../../uploads'})

     // upload.single()表示接收单个文件的上传 参数填写接收的file
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
        //
        const file = req.file
        // 拼接url  返回客户端一个http连接
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

   ```
4. 定义静态文件托管
    1. 在server 下 index.js 
    ``` JS

    // 加入中间件 express.json() 
    app.use(express.json())
    // 托管静态文件夹 让我们uploads下所有文件，可以通过/uploads 文件夹来访问
    app.use('/uploads', express.static(__dirname + '/uploads'))


    ```
    2. 去拼接url 返回图片url地址
5. 回到前端去使用后端返回的数据
   1. 回到步骤 2. afterUpload()方法
   2. 如果想要列表显示 则增加 prop = "icon"
    ``` js 
    <el-table-column prop="icon" label="图标"> 
        //显示的内容  scope.row 表示这一行的数据
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="height:3rem" alt="">
        </template>
      </el-table-column>
    ```

### 英雄的管理
1. 同物品添加方法 一样 在Main.vue 添加链接
2. 创建英雄新增和英雄列表 页面
3. 在router.js 添加路由 ，同物品添加方式
4. 创建英雄 修改内容
   1. 英雄具备 名称 头像  同物品 其中icon 修改为avatar
    ``` js 
    <script>
    // @ is an alias to /src

    export default {
    props: {
        id: {},
    },
    data() {
        return {
        model: {
            name:"", // 提前定义好属性
            avatar:""
        },
        };
    },
    methods: {
        afterUpload(res){
            // this.$set(this.model, 'avatar', res.url)
            // 可以提前在data里提前定义好属性，就可以用普通的赋值方式赋值，如果没有定义使用$set，建议用普通赋值
            this.model.avatar = res.url
            console.log(res.url)
        },
        async save() {
        // console.log("ok")
        if (this.id) {
            await this.$http.put(`rest/heros/${this.id}`, this.model);
        } else {
            // 发起接口请求 提交到 heros 接口，传递参数 this.model
            // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
            // const res = await this.$http.post('heros', this.model)
            await this.$http.post("rest/heros", this.model);
        }

        // 跳转页面
        this.$router.push("/heros/list");
        // 用elementui 提供message 方法，提示成功消息
        this.$message({
            type: "success",
            message: "保存成功",
        });
        },
        async fetch() {
        // 获取详细页接口
        const res = await this.$http.get(`rest/heros/${this.id}`);
        this.model = res.data;
        },
    },
    created() {
        this.id && this.fetch();
    },
    };
    </script>



    ```

5. 增加模型
   1. 建立英雄模型，在server/models 新建 Hero.js
    ``` js 
        // 引入mongoose
    const mongoose = require('mongoose');

    // 建立schmema 用它定义模型字段有那些
    const schema = new mongoose.Schema({
        // 名字/类型：字符串
        name: { type: String },
        // 这里是将用户上传的图片不保存到后端数据库里面，而是将图片上传到一个地址，然后给前端提供一个图片地址即可，这里类型是字符串
        avatar: { type: String },
    });

    // 导出mongoo.module 的模型
    module.exports = mongoose.model('Hero', schema)

    ```
   2. 回到前端英雄列表页面修改相对应的接口请求数据 同物品

##### 英雄的编辑
1. 模型字段 增加 在server/models/Hero.js
   1. 增加 称号字段 title 类型为String
   2. 关联英雄分类id categories 定义多个分类 为数组
   3. 增加 打分 scores 复合类型 数据 可以是数组可以是字符串，但这里不是个数组是个对象，而且对象有子集 以下是子集
      1. 增加 难度 difficult 类型为Number
      2. 增加 技能 skills 类型为Number
      3. 增加 攻击 attack 类型为Number
      4. 增加 生存 survive 类型为Number
   4. 增加 技能 skills 数据 注意定义的是复数，如果是复数 多个则外面套上一个数组 里面是对象
      1. 增加 图标 icon 类型是String
      2. 增加 名称 name 类型是String
      3. 增加 描述 description 类型是String
      4. 增加 小提示 tips 类型是 类型是String
   5. 增加 顺风物品 items1 数据，注意定义的是复数，如果是复数 多个则外面套上一个数组 里面是个关联分类物品数据
   6. 增加 逆风物品 items2 数据，注意定义的是复数，如果是复数 多个则外面套上一个数组 里面是个关联分类物品数据
   7. 增加 使用技巧文本 usageTips 数据，类型是String
   8. 增加 对抗技巧文本 battleTips 数据，类型是String
   9. 增加 团战思路文本 teamTips 数据，类型是String
   10. 增加 英雄关系 搭档 partners 是个数组，里面含英雄关联和一个描述字段
       1.  关联英雄数据 hero
       2.  增加 描述 description 类型是String
``` js
    title: { type: String },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Category' }],
    // 复合类型数据 对象有子集
    scores: {
        difficult: { type: Number },
        skills: {type: Number},
        attack: {type: Number},
        survive: {type: Number},
    },
    // 注意英文编程 复数的问题
    skills: [{
        icon: { type:String },
        name: {type:String},
        description: {type:String},
        tips: {type:String},
    }],
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Item' }],
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Item' }],
    usageTips: { type:String },
    battleTips: { type:String },
    teamTips: { type:String },
    // 注意这里是多个
    partners: [{
        hero:{ type:mongoose.SchemaTypes.ObjectId, ref:'Hero' },
        description:{ type: String }
    }]

```

2. 编辑前端表单
    ``` JS
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="称号">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="头像">
          <!-- :action 前面加个 accept="image/*" 只允许上传图片 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.avatar" :src="model.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型">
        <!-- multiple为多选 -->
        <el-select v-model="model.categories" multiple >
          <el-option v-for="item of categories" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难度">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.difficult"></el-rate>
      </el-form-item>
      <el-form-item label="技能">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.skills"></el-rate>
      </el-form-item>
      <el-form-item label="攻击">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.attack"></el-rate>
      </el-form-item>
      <el-form-item label="生存">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.survive"></el-rate>
      </el-form-item>
      
      <el-form-item label="顺风出装">
        <!-- multiple为多选 -->
        <el-select v-model="model.items1" multiple >
          <el-option v-for="item of items" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="逆风出装">
        <!-- multiple为多选 -->
        <el-select v-model="model.items2" multiple >
          <el-option v-for="item of items" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用技巧">
        <el-input type="textarea" v-model="model.usageTips" ></el-input>
      </el-form-item>
      <el-form-item label="对抗技巧">
        <el-input type="textarea" v-model="model.battleTips" ></el-input>
      </el-form-item>
      <el-form-item label="团战思路">
        <el-input type="textarea" v-model="model.teamTips" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
    ```
2. 数据整理
   ``` js
    data() {
        return {
        categories:[],
        items:[],
        model: {
            name:"",
            avatar:"",
            scores:{
            difficult:0,
            skills:0,
            attack:0,
            survive:0
            },
        },
        };
    },
   ```
3. 方法整理
    ``` js 

    methods:{
        async fetch() {
        // 获取详细页接口
        const res = await this.$http.get(`rest/heros/${this.id}`);
        // this.model = res.data;
        // 首先创建个空对象，然后再把res.data 替换到空对象
        // this.model = {...this.model, ...res.data}
        this.model = Object.assign({}, this.model, res.data)
        },
        async fetchCategories() {
        // 获取详细页接口
        const res = await this.$http.get(`rest/categories`);
        this.categories = res.data;
        },
        async fetchItems() {
        // 获取详细页接口
        const res = await this.$http.get(`rest/items`);
        this.items = res.data;
        },
    },
    created() {
        this.fetchItems()
        this.fetchCategories()
        this.id && this.fetch();
    },
    
    ```
4. 英雄列表调整
   ``` js 
    <el-table-column prop="name" label="英雄名称"> </el-table-column>
    <el-table-column prop="title" label="称号"> </el-table-column>
   ```

5. 英雄技能编辑
   1. 新增三个个方法
      1. 添加技能 ` model.skills.push({}) `
      2. 添加技能图标 ` :on-success="res => $set(item,'icon' , res.url)" ` 这里:on-success 返回的是一个函数，可以直接使用箭头函数，再使用vue的显示赋值$set() 方法第一个参数赋值的主题，第二个是赋值的属性 设置这个属性，第三个是值
      3. 删除技能 ` model.skills.splice(i,1) ` 这里的i是下标，1是步长
   ``` js
    <el-tabs value="skills" type="border-card">
        <el-tab-pane label="基本信息" name="basic">
          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          ...
        </el-tab-pane>
        <el-tab-pane label="技能" name="skills">
          <el-button size="small" @click="model.skills.push({})" > <i class="el-icon-plus"></i> 添加技能</el-button>
          <el-row type="flex" style="flex-wrap:wrap">
            <el-col :md="12"  v-for="(item,i) in model.skills" :key="i">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="res => $set(item,'icon' , res.url)"
            >
              <img v-if="item.icon" :src="item.icon" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="item.description" type="textarea"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input v-model="item.tips" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="model.skills.splice(i,1)"> 
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
    </el-tabs>

   ```

### 文章管理
1. 在Main.vue添加 左侧菜单
2. 在router下router.js 添加路由
   1. 引入 路径
   2. 添加path
3. src/views 下 新建 ArticleEdit.vue ArticleList.vue 两个文件
4. 修改ArticleEdit.vue 文件
5. 修改ArticleList.vue 文件
6. 建立模型 在server下 models/Article.js 
   ``` js 
    title: { type: String },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Category'}],
    body: { type: String },
   ```
7. 添加富文本编辑器 quill vue2-editor 
   1. npm install --save ue2-editor
   2. yarn add vue2-editor
   3. 安装模块是要放到前端后台路径 admin文件夹下安装
   4. 在文章编辑页面引入进来
    ``` js

        <el-form-item label="详情" >
            <vue-editor v-model='model.body'></vue-editor>
        </el-form-item>


        // 这里使用{}解构的方式，如果不用这种方式，传统的方式需要比如a  a是一个对象需要用a.Vueeditor 
        import { VueEditor } from 'vue2-editor'

        export default {
            props: {
                id: {}
            },
            components:{
                VueEditor
            },

    ```
   5.  编辑器图片上传的问题
       1.  添加 vue2-editor 的自定义文件上传方法

        ``` js
        <el-form-item label="详情" >
            <vue-editor v-model='model.body' useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
        </el-form-item>
        ```
       2.  添加 handleImageAdded() 方法
        ``` js 
        // 自定义的文件上传器
        async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData();
        // 这里要和服务端保持一致 file字段名
        formData.append("file", file);
        // 用自带的http请求 得到res 
        const res = await this.$http.post('upload', formData)
        // 拿到 res.data.url 
        // 编辑器 插入 一个元素  （光标位置 图片 图片地址 ）
        Editor.insertEmbed(cursorLocation, "image", res.data.url);
        // 重置上传器
        resetUploader();
        },

        原版方法：

        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            // An example of using FormData
            // NOTE: Your key could be different such as:
            // formData.append('file', file)
        
            var formData = new FormData();
            formData.append("image", file);
        
            axios({
                url: "https://fakeapi.yoursite.com/images",
                method: "POST",
                data: formData
            })
                .then(result => {
                let url = result.data.url; // Get url from response
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
                })
                .catch(err => {
                console.log(err);
                });
            }
        }
        ```
### 首页幻灯片 广告位

1. 后台管理广告位和广告
2. 在main.vue 添加左侧广告位菜单
3. 在router下router.js 添加路由
   1. 引入 路径
   2. 添加path
4. src/views 下 新建 AdEdit.vue AdList.vue 两个文件
5. 修改 AdEdit.vue 文件
6. 修改 AdList.vue 文件
7. 建立模型 在server下 models/Ad.js 
   ``` js 

    name: { type: String },
    items:[{
        image:{ type:String },
        url:{ type:String },
    }]

   ```
8. 添加公共样式 admin/src/style.css
9. 在src/main.js 下引入 公共样式
    ``` js 
    import './style.css'
    ```

10. 修改 AdEdit.vue 页面
    ``` js 
    <el-form-item label="名称" >
            <el-input v-model='model.name'></el-input>
        </el-form-item>
        <el-form-item label="广告">
            <el-button size="small" @click="model.items.push({})" > <i class="el-icon-plus"></i> 添加广告</el-button>
          <el-row type="flex" style="flex-wrap:wrap">
            <el-col :md="24"  v-for="(item,i) in model.items" :key="i">
              <el-form-item label="跳转链接 (URL)">
                <el-input v-model="item.url"></el-input>
              </el-form-item>
              <el-form-item label="图片" style="margin-top:0.5rem;">
                <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/upload'"
              :show-file-list="false"
              :on-success="res => $set(item,'image' , res.url)"
            >
              <img v-if="item.image" :src="item.image" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
              </el-form-item>
              <el-form-item>
                <el-button size="small" type="danger" @click="model.items.splice(i,1)"> 
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
    ```
11. 修改 AdEdit.vue script标签内容
    ``` js 
    data(){
        return{
            model:{
                items:[]
            },
        }
    },
    methods:{
        async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`rest/ads/${this.id}`)
            this.model = Object.assign({},this.model, res.data)
            // 扩展运算符
            // this.model = {...this.model, ...res.data}
        },
    }
    ```
### 管理账号权限 bcrypt
1. 后台进行用户登录，登录页面所有页面可以访问
2. 登录需要用到用户
   1. 首先建立模型 建立 AdminUser.js 驼峰命名法
   2. 确定 基本字段 username 和 password 用户名和密码
   3. 前端页面Main.vue 加入左侧菜单 添加默认点击激活高亮和默认展示页面
       ``` js
       <el-menu router :default-openeds="['1']" unique-opened default-active="$route.path">
            <el-submenu index="1">
       ```
   4. 在src/views 新建 AdminUserEdit.vue AdminUserList.vue 
   5. 在router下 router.js 添加路由
   6. 修改相对应的AdminUserEdit AdminUserList
   7. 用户密码 散列加密 
      1. 对模型进行添加
        ```js
            // 建立schmema 用它定义模型字段有那些
            const schema = new mongoose.Schema({
                // 名字/类型：字符串
                username: { type: String },
                // 添加特殊操作，增加个set函数 自定义修改值，把这个值修改一下再保存
                password: { 
                    type: String, 
                    // 添加这个方式是指默认查询，不带此项数据，不可查询 为了防止再次被散列 设置不可查询
                    select: false,
                    // 接收一个用户填写的值，return返回一个值
                    // 添加一个散列模块bcrypt 散列不可逆，随机生成不会重复 npm i bcrypt
                    set(val){
                        // 使用requeire 导入，使用hashSync 是同步方法，第一个参数 传递个参数 val ,第二个参数是散列的强度
                        return require('bcrypt').hashSync(val, 10)
                    }
                },
            });

        ```
      2. 服务端安装一个散列模块  ` npm i bcrypt `
3. 登录页面
   1. 添加一个登录页面Login.vue
   2. 登录页面接口
   3. 给客户端存入token

   ``` js
    <template>
    <div class="login-container">
        <el-card header="请先登录" class="login-card">
        <el-form @submit.native.prevent="login">
            <el-form-item label="用户名">
            <el-input v-model="model.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
            <el-input type="password" v-model="model.password"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" native-type="submit" >登录</el-button>
            </el-form-item>
        </el-form>

        </el-card>
    </div>
    </template>
    <script>
    // @ is an alias to /src

    export default {
    data(){
        return{
        model:{}
        }
    },
    methods:{
        async login(){
        // 写一个接口请求  第一个是请求路径，第二参数是把model数据传给服务端
        const res = await this.$http.post('login', this.model)
        // 关闭浏览器后会去除
        // sessionStorage.token = res.data.token
        // 关闭浏览器再打开还会保留token
        localStorage.token = res.data.token
        // 跳转到首页路径
        this.$router.push('/')
        this.$message({
            type:'success',
            message:'登录成功'
        })
        // 查看服务端返回的数据
        // console.log(res.data);
        }
    }
    }
    </script>
    
    <style>
    .login-card{
    width:25rem;
    margin: 5rem auto;
    }
    </style>

   ```

   1. 写提交登录login的方法
    ``` js
     async login(){
        // 写一个接口请求  第一个是请求路径，第二参数是把model数据传给服务端
        const res = await this.$http.post('login', this.model)
        // 关闭浏览器后会去除token
        // sessionStorage.token = res.data.token
        // 关闭浏览器再打开还会保留 token
        localStorage.token = res.data.token
        // 跳转到首页路径
        this.$router.push('/')
        this.$message({
            type:'success',
            message:'登录成功'
        })
        // 查看服务端返回的数据
        // console.log(res.data);
        }
    ```

       1.  在admin 下 http.js写全局拦截器 捕获错误
   
            ``` js
                import axios from 'axios'
                import Vue from 'vue'

                const http = axios.create({
                    baseURL:'http://localhost:3000/admin/api'
                })

                // 捕获错误使用全局捕获，给http请求加个拦截器
                // axios 响应的全局拦截器 use后面是函数 第一个参数是 接收的一个响应 第二个是err函数
                http.interceptors.response.use(res => {
                    return res
                }, err =>{
                    // 客户端监听错误 引入 vue
                    if(err.response.data.message){ 
                        // 使用vue的prototype的$message 弹出错误
                        // $message 是 elment ui 的一个方法
                        Vue.prototype.$message({
                            type: 'error',
                            message: err.response.data.message
                        })
                    }
                    
                    return Promise.reject(err)
                })

                export default http
            ```
       2.  
   2. 后端写请求登录接口
      1. 安装 ` npm i jsonwebtoken ` 模块
   ``` js
    // 登录 路由 接口 
    app.post('/admin/api/login', async (req, res) => {
        // console.log(req.body);
        // 接收前端传递过来的用户名和密码，校验后得到一个数据，返回前端一个token 密钥
        // 解构赋值 取对象里面的值 拿到 前端req req.body就是请求过来的所有数据
        const { username, password } = req.body
        
        // 1.根据用户名找用户
        // 引入用户模型
        const AdminUser = require('../../models/AdminUser');
        // findOne 找一条  第一个参数 条件 键值对 如果键值对一样直接简写{username}
        const user = await AdminUser.findOne({
            username:username
        }).select('+password')// 默认密码取不到，这里加个select 使用+号要取出来
        // 判断 ，如果用户不存在，执行终断条件 return 
        if (!user) {
            return res.status(422).send({
                message:'用户不存在'
            })
        }
        // 2.校验密码
        // compareSync() 方法 第一个参数明文(用户提交的密码) 第二个参数是密文(数据库里面的密码) 比较明文和密文是否匹配 返回的是一个布尔值，true false  
        const isValid = require('bcrypt').compareSync(password, user.password)
        if(!isValid){
            return res.status(422).send({
                message:'密码错误'
            })
        }
        // 3.返回token
        // 这里服务端用到一个模块 jwt 这是做web token 验证 ` npm i jsonwebtoken `
        const jwt = require('jsonwebtoken')
        // sign()方法 签名，用它来生成一个token 第一个参数是加密的数据 第二个参数是个密钥用户token生成给一个密钥，全局变量
        // app.get如果只有一个参数是获取配置 （根据参数名来确认是获取配置还是定义路由）
        const token = jwt.sign({
            id: user._id,
            // _id: user._id,
            // username: user.username,
        }, app.get('secret')) 
        
         // 将token返回前端
        res.send({token})
    })
   ```
    1. 在server 下 index.js 添加生成token密钥，注意：这里的值应该写在全局环境变量里面
    ``` js
    // 定义app 是express实例
    const app = express()

    // 表示在当前的 express 设置个变量
    app.set('secret', 'i12dsa2i32v3ee63')

    ```
4. 服务端登录校验 jwt
   1. 请求接口未做限制，添加用户token限制
   2. 对每个接口添加前置处理函数，也就是中间件(express里面的) 进行登录校验
   3. 创建个中间件文件夹 server下middleware文件夹
      1. 创建auth.js 中间件文件 登录校验 (注意引用路径) 
        ``` js
            module.exports =  options => {
                const AdminUser = require('../models/AdminUser');

                const jwt = require('jsonwebtoken')

                const assert = require('http-assert')

                return async(req,res,next) =>{
                    // 校验用户是否登录
                    // 获取用户信息(请求头里面传递过来的)request headers
                    const token = String(req.headers.authorization || '' ).split(' ').pop()
                    assert(token, 401, '请先登录')
                    // 解密token 用的 verify()方法 第一个参数是拿到的前端传递过来的token，第二个参数是拿到密钥
                    const { id } = jwt.verify(token, req.app.get('secret'))
                    assert(id, 401, '请先登录')
                    // 解密出来的id 在数据库里找到这个id 
                    // 想要给后续接口函数都能用的，使用req,res挂载才可以，这里挂载到req,表示客户端请求用户数据是谁
                    req.user = await AdminUser.findById(id)
                    // http-assert 用户确保判断这个东西是否存在 测试使用  npm i http-assert
                    assert(req.user, 401, '请先登录')
                    await next()
                }
            }

        ```
         1. 不建议在地址上进行传递，更好的方式是在请求头地方request headers传递
         2. 在admin/src/http.js 添加 axios interceptors 拦截器 request请求拦截器
          
            ``` js

                const http = axios.create({
                baseURL:'http://localhost:3000/admin/api'
                })
                // 请求 拦截器
                http.interceptors.request.use(function (config) {
                    // Do something before request is sent
                    // 行业规范 前面添加 Bearer +
                    // 验证是否有token,如果有，就在headers添加
                    if(localStorage.token){
                        config.headers.Authorization = 'Bearer ' + localStorage.token
                    }
                    return config;
                }, function (error) {
                    // Do something with request error
                    return Promise.reject(error);
                });
            ```

         3. 服务端 auth.js 提取请求头传递过来的 Bearer + token , req.headers.authorization  
            1. 使用String 转换 字符串，用.split(' ')分隔为数组，再使用.pop() 提取最后一个数组 拿到token
            2. 使用jwt.verify()方法 校验 token 解密出用户id
            3. 拿到解密出的id 去在数据库找这个id 使用findById()方法找到这个用户
            4. 使用http-assert这个包，用于判断这个条件是否存在正确，
               1. assert() 方法 第一个是条件 第二个状态码，第三个是返回的message消息
               2. 在所有路由的最后 添加个错误处理函数 自定义选择发送的状态码和消息 统一发送错误消息
            5. 判断用户是否存在
            6. 判断前端请求过来的token是否存在
            7. 判断用户id是否存在
            8. 考虑扩展性 写成一个函数返回一个函数 接收一个options参数 （添加options为了可配置，现在没有用到)里面return 一个函数
      2. 创建resource.js 中间件文件 资源处理单复数 
        ``` js
            module.exports =  options => {
                return async(req, res, next) => {
                    // console.log("转换前："+ req.params.resource)
                    // npm i inflection 这个模块 专门处理单复数转换，下划线以及单词的格式转换
                    //转换类名 classify()方法  小写复数转大写单数的 类名转换的方法 注意这里只是针对类名规范的，如果取名字不规范这方法不适用  
                    const modelName = require('inflection').classify(req.params.resource)
                    // console.log("转换后："+ modelName)
                    //定义Model 通过模型的名称经过 require 过来的得到模型的类  如果是const 后面访问不到，需要加上req.Model 表示 给请求对象上req 挂载个一个属性model 是这个require过来的模型
                    req.Model = require(`../models/${modelName}`)
                    next()
                }
            }
        ```
   4. 在资源接口添加 登录校验 和 资源处理 中间件
      1. 引用中间件
      2. 使用中间件一定要加括号为了执行调用 
    ``` js
        // 登录校验中间件
        const authMiddleware = require('../../middleware/auth')
        // 资源中间件
        const resourceMiddleware = require('../../middleware/resource')

        // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
        // 资源接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
        // 增加中间件 也就是处理函数,请求地址后先用这个处理
        app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router ) 
    ```
   5. 客户端路由限制 （前端做限制）
      1. 因接口请求做了限制，会跳转登录页面，但是对没有接口请求的界面还需要做限制
      2. 登录页面公开访问，其他页面必须要登录 
         1. 在登录页面添加一个参数 `meta:{isPublic:True} `
            ``` js 
                {
                    path: "/login",
                    name: 'login',
                    component: Login,
                    meta: {isPublic: true}
                },
            ``` 
         2. 添加导航守卫全局
            ``` js
                const router = new VueRouter({
                routes,
                });
                // 客户端的路由限制 路由添加beforEach
                router.beforeEach((to, from, next) => {
                    // 如果 没有isPublic 和 没有缓存用户token 
                if(!to.meta.isPublic && !localStorage.token){
                    // 则跳转到登录页面
                    return next('/login')
                }
                // 否则正常进入页面
                next()
                })
                export default router;
            ```
         3. 上传文件功能失败修复 (混入 简单理解为提供公共的属性方法)
            1. 由于上传图片使用的是element ui 自带的 :action 请求 并没有使用自带的$http也就是axios请求，所以不会添加token
            2. 对上传文件的请求头添加Authorization
               1. 全局添加 admin/src/main.js Vue.mixin 混入
               2. 相当于实例化一个代码块，让每一个vue实例都拥有这个
                ``` js
                    Vue.mixin({
                        // 计算属性 
                        computed: {
                            // 定义一个uploadUrl
                            uploadUrl(){
                            return this.$http.defaults.baseURL + '/upload';
                            },
                        },
                        // 最好使用methods 方法，避免使用data,如果定义变量无法实时取到这个数据，最好用方法，随时使用随时用
                        methods: {
                            // 这个方法可以在任意组件使用相当于组件下的methods 方法
                            getAuthHeaders(){
                            return {
                                Authorization: `Bearer ${localStorage.token || ""}`,
                            };
                            },
                        },
                    });
                ```
            3. 将全局方法返给使用element ui的 :action   
                ``` js
                    <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="getAuthHeaders()"
                    :show-file-list="false"
                    :on-success="afterUpload"
                    >
                ```

### 开发移动端网站
1. SASS (SCSS)用于写css 更高级的语法
   1. 在web/src下 新建 style.scss
   2. 在web/src/main.js 引入 style.scss
   3. web 下 安装 npm i -D sass sass-loader
2. 样式重置
3. 网站色彩和字体样式
   1. 主色调
4. flex布局
   1. 