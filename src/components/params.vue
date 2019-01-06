<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示 -->
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
    <!-- 级联选择器 -->
    <el-span>请选择商品分类</el-span>
    <el-cascader
    expand-trigger="hover"
    :show-all-levels="false"
    :options="options"
    v-model="selectedOptions"
    :props="defaultProp"
    @change="handleChange">
    </el-cascader>
    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">动态参数</el-tab-pane>
      <el-tab-pane label="静态参数" name="2">静态参数</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
 data() {
   return {
     options:[],
     defaultProp:{
        label:"cat_name",
        value:"cat_id",
        children:"children"
      },
      selectedOptions:[],
   }
 },
  created() {
    this.getGoodCate();
  },
  //  级联的方法
 handleChange() {
   
 },
 methods:{
   async getGoodCate() {
     const res = await this.$http.get(`categories?type=3`);
     this.options = res.data.data;
   }
 }
}
</script>

<style>
  .card {
    height: 100%;
  }
  .alert {
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
