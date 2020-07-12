<template>
  <div class="about">
    <h1>分类列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"> </el-table-column>
      <el-table-column prop="name" label="分类名称"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push(`/categories/edit/${scope.row._id}`)">编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("categories");
      console.log(res);
      this.items = res.data;
    },
    async remove(row) {
      // 添加elementui的 Message Box 的this.$confirm()方法
      this.$confirm(`是否确定要删除分类"${row.name}"?`,'提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 请求接口 使用delete去请求 url是categories/${row._id} 是下划线id 使用await then后必须使用async 
          await this.$http.delete(`categories/${row._id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 重新获取获取一下数据
          this.fetch()
        })
        // .catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消删除'
        //   });          
        // });
    }
  },
  created() {
    this.fetch();
  },
};
</script>
