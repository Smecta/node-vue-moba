<template>
<div class="about">
    <h1>{{id ? '编辑':'新建'}}管理员 </h1>
    <el-form label-width='120px' @submit.native.prevent="save">
        

        <el-form-item label="用户名" >
            <el-input v-model='model.username'></el-input>
        </el-form-item>
        <el-form-item label="密码" >
            <el-input type="password" v-model='model.password'></el-input>
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
           
        }
    },
    methods:{
        async save(){
            // console.log("ok")
            if(this.id){
                await this.$http.put(`rest/admin_users/${this.id}`, this.model)
            }
            else{
                // 发起接口请求 提交到 admin_users 接口，传递参数 this.model
                // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
                // const res = await this.$http.post('admin_users', this.model)
                await this.$http.post('rest/admin_users', this.model)
            }
            
            // 跳转页面
            this.$router.push('/admin_users/list')
            // 用elementui 提供message 方法，提示成功消息
            this.$message({
                type:'success',
                message:'保存成功'
            })
        },
        async fetch(){
            // 获取详细页接口
            const res = await this.$http.get(`rest/admin_users/${this.id}`)
            this.model = res.data
        },

    },
    created(){

        this.id && this.fetch()
    }
}
</script>
