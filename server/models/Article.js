
// 引入mongoose
const mongoose = require('mongoose');

// 建立schmema 用它定义模型字段有那些
const schema = new mongoose.Schema({
    // 名字/类型：字符串
    title: { type: String },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Category' }],
    body: { type: String },
});

// 导出mongoo.module 的模型
module.exports = mongoose.model('Article', schema)