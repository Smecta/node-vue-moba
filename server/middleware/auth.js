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