
// 使用module.exports导出一个函数 app 这个函数接收一个app对象 里面可以用外层app



module.exports = app => {
    // 定义个 express
    const express = require('express');

    const AdminUser = require('../../models/AdminUser');

    const jwt = require('jsonwebtoken')

    const assert = require('http-assert')

    // 定义一个路由router express的子路由，需要的时候就用它
    const router = express.Router({
        // 在app.use定义的参数，又要在router里面使用这个参数，需要添加特殊参数 表示合并url参数，这里是要把父级定义的url参数传递给router里面的路由来都能访问到
        mergeParams: true
    });
    // 引用Category模型
    // const Category = require('../../models/Category');
    // 增加动态模型 每一个路由里面找到对应的模型是什么


    // 创建资源
    // 加一个post方法，接口地址是这个资源
    router.post('/', async(req,res) => {
        //创建数据 数据来源是req.body 但是要在index.js添加中间件json 定义一个model 
        const model = await req.Model.create(req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })
    // 更新资源
    // 加一个put方法，接口地址是这个资源,路径url要加:id,
    router.put('/:id', async(req,res) => {
        //定义一个model 把create 换成 findByIdAndUpdate()方法，接收两个参数，一个是id,第二是内容req.body
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

    // 删除资源 指定ID的删除
    // 加一个delete方法，接口地址是这个资源,路径url要加:id,
    router.delete('/:id', async(req,res) => {
        //不需要返回值  findByIdAndUpdate()方法换成findByIdAndDelete()，接收两个参数，一个是id,第二是内容req.body
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        // 发回客户端，返回一个 success 为true
        res.send({
            success: true
        })
    })

    // 资源列表
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

    // 资源详情 查找 获取某一个详细页接口
    router.get('/:id', async(req,res) => {
        //定义 model 使用 Category.findById() 其中req.params是指命名路由的需求参数，express中的
        const model = await req.Model.findById(req.params.id)
        // 发回客户端，让客户端知道创建完成，创建的数据是什么
        res.send(model)
    })

    // 登录校验中间件
    const authMiddleware = require('../../middleware/auth')
    // 资源中间件
    const resourceMiddleware = require('../../middleware/resource')

    // 使用这个app.use（路由地址,接口地址）为后续的增删改查提供路由
    // 资源接口定义完毕，就是admin/api/categories 下一步去前端发起这个接口请求
    // 增加中间件 也就是处理函数,请求地址后先用这个处理
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router )

    // 图片文件上传接口 express 本身获取不到上传文件数据
    // 需要中间件处理，专门处理上传文件数据的 multer 插件 npm i multer

    const multer = require('multer')
    const upload = multer({ dest: __dirname + '/../../uploads'})
    // 这里的file是定义的字段名，接收的是一个file，前端也要写成file
    app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
        //
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    // 登录 路由 接口 
    app.post('/admin/api/login', async (req, res) => {
        // console.log(req.body);
        // 接收前端传递过来的用户名和密码，校验后得到一个数据，返回前端一个token 密钥
        // 解构赋值 取对象里面的值 拿到 前端req req.body就是请求过来的所有数据
        const { username, password } = req.body
        
        // 1.根据用户名找用户
        // const AdminUser = require('../../models/AdminUser');
        // findOne 找一条  第一个参数 条件 键值对 如果键值对一样直接简写{username}
        const user = await AdminUser.findOne({
            username:username
        }).select('+password')// 默认密码取不到，这里加个select 使用+号要取出来
        // 第一个参数 判断条件，第二参数 状态码，第三个参数 自定义信息
        assert(user, 422,'用户不存在')
        // 判断 ，如果用户不存在，执行终断条件 return 
        // if (!user) {
        //     return res.status(422).send({
        //         message:'用户不存在'
        //     })
        // }
        // 2.校验密码
        // compareSync() 方法 第一个参数明文(用户提交的密码) 第二个参数是密文(数据库里面的密码) 比较明文和密文是否匹配 返回的是一个布尔值，true false  
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
        // if(!isValid){
        //     return res.status(422).send({
        //         message:'密码错误'
        //     })
        // }
        // 3.返回token
        // 这里服务端用到一个模块 jwt 这是做web token 验证  npm i jsonwebtoken 
        // const jwt = require('jsonwebtoken')
        // sign()方法 签名，用它来生成一个token 第一个参数是加密的数据 第二个参数是个密钥用户token生成给一个密钥，全局变量
        // app.get如果只有一个参数是获取配置 （根据参数名来确认是获取配置还是定义路由）
        const token = jwt.sign({
            id: user._id,
            // _id: user._id,
            // username: user.username,
        }, app.get('secret')) 

        res.send({token})
    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        // console.log(err);
        res.status(err.statusCode || 500).send({
            message: err.message
        })
        // await next()
    })
}