<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 消息提示 -->
    <el-row class="alert">
      <el-col>
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      </el-col>
    </el-row>
    <!-- 步骤条 -->
    <el-steps :active="1*active" align-center class="step">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    
    <el-form label-position="top" model="form" label-width="80px" class="elform">
       <el-tabs tab-position="left" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-input></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane name="3" label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane name="4" label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane name="5" label="商品内容">商品内容</el-tab-pane>
      </el-tabs>   
    </el-form>
    <!-- 标签页el-tab -->
    
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active:"1"
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
  .step {
    margin-bottom: 20px;
  }
  .elform {
    height: 400px;
    overflow: hidden;
  }
</style>
