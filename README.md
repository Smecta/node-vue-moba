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

    // 建立schmema 用它定义模型字段有那些
    const schema = new mongoose.Schema({
        // 名字/类型：字符串
        name: { type: String },
        // 这里是将用户上传的图片不保存到后端数据库里面，而是将图片上传到一个地址，然后给前端提供一个图片地址即可，这里类型是字符串
        icon: { type: String },
    });

    // 导出mongoo.module 的模型
    module.exports = mongoose.model('Item', schema)
    ```
4. 接口因为是通用的，无须修改
5. 修改新建物品和物品列表的请求url地址 即可

##### 物品 图标  上传 (待详细更新说明)
1. 使用element ui 自带的用户头像上传 其中:action 动态获取 文件地址
    ``` js
    <el-form-item label="图标">
          <!-- :action 前面加个 accept="image/*" 只允许上传图片 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </el-form-item>
    ```
2. 在物品编辑页面添加 afterUpload()方法
    ``` js
    afterUpload(res){
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
    const upload = multer({ dest: __dirname + '/../../uploads'})

    app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
        //
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

   ```