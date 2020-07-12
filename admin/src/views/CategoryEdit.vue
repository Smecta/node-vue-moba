<template>
<div class="about">
    <h1>{{id ? '编辑':'新建'}}分类 </h1>
    <el-form label-width='120px' @submit.native.prevent="save">
        <el-form-item label="上级分类" >
            <el-select v-model='model.parent'>
                <!-- label 显示的内容 这里写name，value是这个数据真实存的内容，这里写_id -->
                <el-option v-for="item in parents" :key="item._id"
                :label="item.name" :value="item._id" ></el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="名称" >
            <el-input v-model='model.name'></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" native-type="submit">保存</el-button>
        </el-form-item>
    </el-form>
</div>  
</template>

<script>
// @ is an alias to /src

export default {
    props: {
        id: {}
    },
    data(){
        return{
            model:{},
            parents:[],
        }
    },
    methods:{
        async save(){
            // console.log("ok")
            if(this.id){
                await this.$http.put(`rest/categories/${this.id}`, this.model)
            }
            else{
                // 发起接口请求 提交到 categories 接口，传递参数 this.model
                // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
                // const res = await this.$http.post('categories', this.model)
                await this.$http.post('rest/categories', this.model)
            }
            
            // 跳转页面
            this.$router.push('/categories/list')
            // 用elementui 提供message 方法，提示成功消息
            this.$message({
                type:'success',
                message:'保存成功'
            })
        },
        async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`rest/categories/${this.id}`)
            this.model = res.data
        },
        async fetchParents(){
            // 获取分页列表数据给parents
            const res = await this.$http.get(`rest/categories`)
            // console.log(res.data)
            this.parents = res.data
        }
    },
    created(){
        this.fetchParents()
        this.id && this.fetch()
    }
}
</script>
