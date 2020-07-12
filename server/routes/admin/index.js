
// 使用module.exports导出一个函数 app 这个函数接收一个app对象 里面可以用外层app

module.exports = app => {
    // 定义个 express
    const express = require('express');
    // 定义一个路由router express的子路由，需要的时候就用它
    const router = express.Router();
    // 引用Category模型
    const Category = require('../../models/Category');

    // 创建分类
    // 加一个post方法，接口地址是这个分类
    router.post('/categories', async(req,res) => {
        //创建数据 数据来源是req.body 但是要在index.js添加中间件json 定义一个model 
        const model = await Category.create(req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })
    // 创建分类
    // 加一个put方法，接口地址是这个分类,路径url要加:id,
    router.put('/categories/:id', async(req,res) => {
        //定义一个model 把create 换成 findByIdAndUpdate()方法，接收两个参数，一个是id,第二是内容req.body
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

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

    // 分类列表
    // 使用get方法
    router.get('/categories', async(req,res) => {
        //使用 Category.find()方法获取数据，使用limit()方法限制数据只显示10条 定义给items
        const items = await Category.find().limit(10)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(items)
    })

    // 分类查找 获取某一个详细页接口
    router.get('/categories/:id', async(req,res) => {
        //定义 model 使用 Category.findById() 其中req.params是指命名路由的需求参数，express中的
        const model = await Category.findById(req.params.id)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })


    // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
    // 分类接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
    app.use('/admin/api', router )
}