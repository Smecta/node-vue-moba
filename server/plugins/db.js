// 数据库插件写法
// module.exports 导出是一个函数 接收的是一个app 
module.exports = app => {

    // 定义mongoose
    const mongoose = require('mongoose');
    // mongoose 连接 node-vue-moba这个数据库
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
        // 连接的参数 必须要加
        useNewUrlParser: true,
        useUnifiedTopology: true
    })    
}