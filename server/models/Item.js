
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