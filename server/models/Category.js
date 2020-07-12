
// 引入mongoose
const mongoose = require('mongoose');

// 建立schmema 用它定义模型字段有那些
const schema = new mongoose.Schema({
    // 名字/类型：字符串
    name: { type: String },
    // 定义个字段，type不能是string 是特殊类型，是一个mongoose.SchemaTypes.ObjectId  表示是数据库里面的ObjectId 同时指定一个ref 表示它关联的模型，这里是本身模型 
    // 去分类模型当前的这个id找等于parent的id 就能把这个父级分类找出来
    parent: { type: mongoose.SchemaTypes.ObjectId, ref:'Categroy' },
});

// 导出mongoo.module 的模型
module.exports = mongoose.model('Categroy', schema)