<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="称号">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="头像">
          <!-- :action 前面加个 accept="image/*" 只允许上传图片 -->
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.avatar" :src="model.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型">
        <!-- multiple为多选 -->
        <el-select v-model="model.categories" multiple >
          <el-option v-for="item of categories" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="难度">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.difficult"></el-rate>
      </el-form-item>
      <el-form-item label="技能">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.skills"></el-rate>
      </el-form-item>
      <el-form-item label="攻击">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.attack"></el-rate>
      </el-form-item>
      <el-form-item label="生存">
        <el-rate style="margin-top:0.6rem" :max="9" show-score v-model="model.scores.survive"></el-rate>
      </el-form-item>
      
      <el-form-item label="顺风出装">
        <!-- multiple为多选 -->
        <el-select v-model="model.items1" multiple >
          <el-option v-for="item of items" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="逆风出装">
        <!-- multiple为多选 -->
        <el-select v-model="model.items2" multiple >
          <el-option v-for="item of items" :label="item.name" :key="item._id" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用技巧">
        <el-input type="textarea" v-model="model.usageTips" ></el-input>
      </el-form-item>
      <el-form-item label="对抗技巧">
        <el-input type="textarea" v-model="model.battleTips" ></el-input>
      </el-form-item>
      <el-form-item label="团战思路">
        <el-input type="textarea" v-model="model.teamTips" ></el-input>
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
      categories:[],
      items:[],
      model: {
        name:"",
        avatar:"",
        scores:{
          difficult:0,
          skills:0,
          attack:0,
          survive:0
        },
      },
    };
  },
  methods: {
      afterUpload(res){
          // this.$set(this.model, 'avatar', res.url)
          // 可以提前在data里提前定义好属性，就可以用普通的赋值方式赋值，如果没有定义使用$set，建议用普通赋值
          this.model.avatar = res.url
          console.log(res.url)
      },
    async save() {
      // console.log("ok")
      if (this.id) {
        await this.$http.put(`rest/heros/${this.id}`, this.model);
      } else {
        // 发起接口请求 提交到 heros 接口，传递参数 this.model
        // 这里将.then方法改成 async await返回承诺 是将异步的回调函数写法换成类似同步的写法
        // const res = await this.$http.post('heros', this.model)
        await this.$http.post("rest/heros", this.model);
      }

      // 跳转页面
      this.$router.push("/heros/list");
      // 用elementui 提供message 方法，提示成功消息
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      // 获取详细页接口
      const res = await this.$http.get(`rest/heros/${this.id}`);
      // this.model = res.data;
      // 首先创建个空对象，然后再把res.data 替换到空对象
      // this.model = {...this.model, ...res.data}
      this.model = Object.assign({}, this.model, res.data)
    },
    async fetchCategories() {
      // 获取详细页接口
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    async fetchItems() {
      // 获取详细页接口
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    },
  },
  created() {
    this.fetchItems()
    this.fetchCategories()
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