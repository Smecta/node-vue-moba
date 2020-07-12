<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
          <!-- :action 前面加个 accept="image/*" 只允许上传图片 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.icon" :src="model.icon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
    id: {},
  },
  data() {
    return {
      model: {},
    };
  },
  methods: {
      afterUpload(res){
          this.$set(this.model, 'icon', res.url)
        //   this.model.icon = res.url
          console.log(res.url)
      },
    async save() {
      // console.log("ok")
      if (this.id) {
        await this.$http.put(`rest/items/${this.id}`, this.model);
      } else {
        // 发起接口请求 提交到 items 接口，传递参数 this.model
        // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
        // const res = await this.$http.post('items', this.model)
        await this.$http.post("rest/items", this.model);
      }

      // 跳转页面
      this.$router.push("/items/list");
      // 用elementui 提供message 方法，提示成功消息
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 获取详细页接口
      const res = await this.$http.get(`rest/items/${this.id}`);
      this.model = res.data;
    },
  },
  created() {
    this.id && this.fetch();
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>