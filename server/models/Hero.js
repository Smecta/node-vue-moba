
// 引入mongoose
const mongoose = require('mongoose');

// 建立schmema 用它定义模型字段有那些
const schema = new mongoose.Schema({
    // 名字/类型：字符串
    name: { type: String },
    // 这里是将用户上传的图片不保存到后端数据库里面，而是将图片上传到一个地址，然后给前端提供一个图片地址即可，这里类型是字符串
    avatar: { type: String },
    title: { type: String },
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Category' }],
    // 复合类型数据 对象有子集
    scores: {
        difficult: { type: Number },
        skills: {type: Number},
        attack: {type: Number},
        survive: {type: Number},
    },
    // 注意英文编程 复数的问题
    skills: [{
        icon: { type:String },
        name: {type:String},
        description: {type:String},
        tips: {type:String},
    }],
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Item' }],
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref:'Item' }],
    usageTips: { type:String },
    battleTips: { type:String },
    teamTips: { type:String },
    // 注意这里是多个 和items1 有区分
    partners: [{
        hero:{ type:mongoose.SchemaTypes.ObjectId, ref:'Hero' },
        description:{ type: String }
    }]

});

// 导出mongoo.module 的模型
module.exports = mongoose.model('Hero', schema)