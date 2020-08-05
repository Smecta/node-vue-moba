<template>
<div class="about">
    <h1>{{id ? '编辑':'新建'}}文章 </h1>
    <el-form label-width='120px' @submit.native.prevent="save">
        <el-form-item label="所属分类" >
            <el-select v-model='model.categories' multiple>
                <!-- label 显示的内容 这里写name，value是这个数据真实存的内容，这里写_id -->
                <el-option v-for="item in categories" :key="item._id"
                :label="item.name" :value="item._id" ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="标题" >
            <el-input v-model='model.title'></el-input>
        </el-form-item>
        <el-form-item label="详情" >
            <vue-editor v-model='model.body' useCustomImageHandler @image-added="handleImageAdded"></vue-editor>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" native-type="submit">保存</el-button>
        </el-form-item>
    </el-form>
</div>  
</template>

<script>
// @ is an alias to /src
// 这里使用{}解构的方式，如果不用这种方式，传统的方式需要比如a 需要用a.Vueeditor 
import { VueEditor } from 'vue2-editor'

export default {
    props: {
        id: {}
    },
    components:{
        VueEditor
    },
    data(){
        return{
            model:{},
            parents:[],
            categories:[],
        }
    },
    methods:{
        // 自定义的文件上传器
        async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
        const formData = new FormData();
        // 这里要和服务端保持一致 file字段名
        formData.append("file", file);
        // 用自带的http请求 得到res 
        const res = await this.$http.post('upload', formData)
        // 拿到 res.data.url 
        // 编辑器 插入 一个元素  （光标位置 图片 图片地址 ）
        Editor.insertEmbed(cursorLocation, "image", res.data.url);
        // 重置上传器
        resetUploader();
        },
        async save(){
            // console.log("ok")
            if(this.id){
                await this.$http.put(`rest/articles/${this.id}`, this.model)
            }
            else{
                // 发起接口请求 提交到 articles 接口，传递参数 this.model
                // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
                // const res = await this.$http.post('articles', this.model)
                await this.$http.post('rest/articles', this.model)
            }
            
            // 跳转页面
            this.$router.push('/articles/list')
            // 用elementui 提供message 方法，提示成功消息
            this.$message({
                type:'success',
                message:'保存成功'
            })
        },
        async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`rest/articles/${this.id}`)
            this.model = res.data
        },
        async fetchCategories(){
            // 获取分页列表数据给parents
            const res = await this.$http.get(`rest/categories`)
            // console.log(res.data)
            this.categories = res.data
        }
    },
    created(){
        this.fetchCategories()
        this.id && this.fetch()
    }
}
</script>
