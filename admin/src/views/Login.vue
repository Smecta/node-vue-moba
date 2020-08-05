<template>
  <div class="login-container">
    <el-card header="请先登录" class="login-card">
      <el-form @submit.native.prevent="login">
        <el-form-item label="用户名">
          <el-input v-model="model.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" >登录</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  data(){
    return{
      model:{}
    }
  },
  methods:{
    async login(){
      // 写一个接口请求  第一个是请求路径，第二参数是把model数据传给服务端
      const res = await this.$http.post('login', this.model)
      // 关闭浏览器后会去除
      // sessionStorage.token = res.data.token
      // 关闭浏览器再打开还会保留
      localStorage.token = res.data.token
      // 跳转到首页路径
      this.$router.push('/')
      this.$message({
        type:'success',
        message:'登录成功'
      })
      // 查看服务端返回的数据
      // console.log(res.data);
    }
  }
}
</script>

<style>
.login-card{
  width:25rem;
  margin: 5rem auto;
}
</style>