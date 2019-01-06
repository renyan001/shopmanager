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
    
    <el-form class="elform" label-position="top" :model="form" label-width="80px">
       <el-tabs tab-position="left" v-model="active" @tab-click="changeTab()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{selectedOptions}}
            <el-cascader expand-trigger="hover"
            clearable
            :props="defaultProp" :options="options" v-model="selectedOptions" @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
            <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
          </el-checkbox-group>
          </el-form-item>          
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload class="upload-demo"
           action="http://localhost:8888/api/private/v1/upload"
           :on-success="handleSuccess"
           :on-remove="handleRemove"
           :headers="headers"
           list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-button @click="addGoods()">添加商品</el-button>
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>   
    </el-form>
    <!-- 标签页el-tab -->
    
  </el-card>
</template>

<script>
// 引入富文本插件需要的包
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active:"1",
      options:[],
      selectedOptions:[1,3,6],
      defaultProp:{
        label:"cat_name",
        value:"cat_id",
        children:"children"
      },
      arrDy:[],
      arrStatic:[],
      headers: {
        Authorization: localStorage.getItem("token")
      },
      form:{
        // 使用v-model双向数据绑定完成
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        // 商品分类 - 在级联选择器中的商品分类 - 以为','分割的分类列表
        goods_cat: "",
        // 图片 - 图片上传 临时路径 pics是一个数组 里面有一个对象，值是临时路径
        pics: [],
        // 商品参数(是数组) - 动态参数arrDy + 静态参数arrStatic
        attrs: []
      }
    }
  },
  created() {
    this.getGoodsCate();
  },
  methods:{
    // 点击添加商品
    async addGoods() {

      // 静态参数数据
      const arr1 = this.arrStatic;
      // 遍历arr1并且返回新数组
      const newArr1 = arr1.map(item => {
        return {
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        };
      });
      console.log(arr1);
      
      // 动态参数数据
      const arr2 = this.arrDy;
      const newArr2 = arr2.map(item => {
        return {
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        }
      });

      const arr = [...newArr1,...newArr2];
      this.form.attrs = arr;

      // 以为','分割的分类列表 把数组[1,3,6] 变成'1,3,6'
      this.form.goods_cat = this.selectedOptions.join(",");

      const res = await this.$http.post(`goods`,this.form);
      // console.log(res);
      this.$router.push({
        name:'goods'
      });
      
    },
    // 图片上传成功时
    handleSuccess(response) {
      // 往pics数组中添加一个对象 是该图片的临时路径
      this.form.pics.push({
        pic:response.data.tmp_path
      });
      console.log(this.form.pics);
      
    },
    // 图片移除成功时
    handleRemove(file, fileList) {
      const index = this.form.pics.findIndex(item => {
        return item.pic = file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      console.log(this.form.pics);
      
    },
    // 切换tab栏
    async changeTab() {
      // 点击第二个tab栏展示的内容
      if (this.active === "2") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
          // console.log(res);
          this.arrDy = res.data.data;
          // console.log(this.arrDy);

          this.arrDy.forEach(item => {
            // 把字符串以逗号分隔
            item.attr_vals = item.attr_vals.length === 0 ? [] :item.attr_vals.trim().split(",");
          });
          
        } else {
          this.$message.warning("请先选择三级分类");
        }        
      }

      // 点击第三个tab栏展示的内容
      if (this.active === "3") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
          this.arrStatic = res.data.data;
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }
      
      
    },
    // 级联选择器的方法
    handleChange() {},
    // 获取三级联动的数据
    async getGoodsCate() {
      //
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      console.log(res);
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
    height: 350px;
    overflow: auto;
  }
  .ql-editor{
    min-height: 150px;
  }
</style>
