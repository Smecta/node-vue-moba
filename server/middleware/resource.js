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