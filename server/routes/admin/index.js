
// 使用module.exports导出一个函数 app 这个函数接收一个app对象 里面可以用外层app

module.exports = app => {
    // 定义个 express
    const express = require('express');
    // 定义一个路由router express的子路由，需要的时候就用它
    const router = express.Router({
        // 在app.use定义的参数，又要在router里面使用这个参数，需要添加特殊参数 表示合并url参数，这里是要把父级定义的url参数传递给router里面的路由来都能访问到
        mergeParams: true
    });
    // 引用Category模型
    // const Category = require('../../models/Category');
    // 增加动态模型 每一个路由里面找到对应的模型是什么


    // 创建分类
    // 加一个post方法，接口地址是这个分类
    router.post('/', async(req,res) => {
        //创建数据 数据来源是req.body 但是要在index.js添加中间件json 定义一个model 
        const model = await req.Model.create(req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })
    // 创建分类
    // 加一个put方法，接口地址是这个分类,路径url要加:id,
    router.put('/:id', async(req,res) => {
        //定义一个model 把create 换成 findByIdAndUpdate()方法，接收两个参数，一个是id,第二是内容req.body
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

    // 删除分类 指定ID的删除
    // 加一个delete方法，接口地址是这个分类,路径url要加:id,
    router.delete('/:id', async(req,res) => {
        //不需要返回值  findByIdAndUpdate()方法换成findByIdAndDelete()，接收两个参数，一个是id,第二是内容req.body
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        // 发回客户端，返回一个 success 为true
        res.send({
            success: true
        })
    })

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
        // 这里需要特殊处理一下 利用setOptions()方法
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

    // 分类查找 获取某一个详细页接口
    router.get('/:id', async(req,res) => {
        //定义 model 使用 Category.findById() 其中req.params是指命名路由的需求参数，express中的
        const model = await req.Model.findById(req.params.id)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })


    // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
    // 分类接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
    // 增加中间件 也就是处理函数,请求地址后先用这个处理
    app.use('/admin/api/rest/:resource', async(req, res, next) => {
        console.log("转换前："+ req.params.resource)
        // npm i inflection 这个模块 专门处理单复数转换，下划线以及单词的格式转换
        //转换类名 classify()方法  小写复数转大写单数的 类名转换的方法 注意这里只是针对类名规范的，如果取名字不规范这方法不适用  
        const modelName = require('inflection').classify(req.params.resource)
        console.log("转换后："+ modelName)
        //定义Model 通过模型的名称经过 require 过来的得到模型的类  如果是const 后面访问不到，需要加上req.Model 表示 给请求对象上req 挂载个一个属性model 是这个require过来的模型
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router )
}