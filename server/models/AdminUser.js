
// 引入mongoose
const mongoose = require('mongoose');

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

// 导出mongoo.module 的模型
module.exports = mongoose.model('AdminUser', schema)