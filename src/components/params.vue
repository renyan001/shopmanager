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
    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary" :disabled="selectedOptions.length===0">设置动态参数</el-button>
      <el-table height="450px" stripe v-loading="loading" :data="arrDy" style="width: 100%">
      <!-- 序号 -->
      <el-table-column type="expand" width="200">
        <template slot-scope="scope">
          <el-tag v-for="(item) in scope.row.attr_vals" :key="item.attr_id" closable :disable-transitions="false" @close="handleClose(scope.row,item)">
            {{item}}
          </el-tag>
        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="attr_name" label="属性名称">
      </el-table-column>

      <el-table-column
        label="操作" width="100">
        <template slot-scope="scope">
        <el-button  plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
        <el-button  plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
  </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" :disabled="selectedOptions.length===0">设置静态参数</el-button>

        <el-table height="300px" :data="arrStatic" style="width: 100%">
          <el-table-column type="index" width="200" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
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
      active:"1",
      arrDy:[],
      arrStatic:[],
      inputVisible: false,
      inputValue: ''
   }
 },
  created() {
    this.getGoodCate();
  },
 methods:{
   async handleClose(attr,item) {

        attr.attr_vals.splice(attr.attr_vals.indexOf(item), 1);
        const putData = {
          attr_name:attr.attr_name,
          attr_sel:attr.attr_sel,
          attr_vals:attr.attr_vals.join(",")
        };
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
        console.log(res);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

     async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue);
          const putData = {
          attr_name:attr.attr_name,
          attr_sel:attr.attr_sel,
          attr_vals:attr.attr_vals.join(",")
        };
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,putData);
        console.log(res);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
  //  
  handleClick() {
    this.getDyparams();
  },
  //  级联的方法
  handleChange() {
     
    },
 changeTab() {   
   if (this.selectedOptions.length === 3 && this.active === "1") {    
     this.getDyparams();
   } 
   if (this.selectedOptions.length === 3 && this.active === "2") {
        this.getStparams();
      }
 },
  //  获取静态参数
  async getStparams() {
      const res = await this.$http.get(
        `categories/${this.selectedOptions[2]}/attributes?sel=only`
      );
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.arrStatic = res.data.data;
        console.log(this.arrStatic);
      }
    },
  //  获取动态参数
  async getDyparams() {
    const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
    // console.log(res);
    this.arrDy = res.data.data;
    // console.log(this.arrDy);

    this.arrDy.forEach(item => {
      // 把字符串以逗号分隔
      item.attr_vals = item.attr_vals.length === 0 ? [] :item.attr_vals.trim().split(",");
    });
  },
   async getGoodCate() {
     const res = await this.$http.get(`categories?type=3`);
     this.options = res.data.data;
   }
 }
}
</script>

<style scoped>
  .card {
    height: 100%;
  }
  .alert {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .el-tab-pane {
    height:350px;
    overflow: auto;
  }
</style>
