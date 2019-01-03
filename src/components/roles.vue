<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-row class="row">
        <el-col :span="24">
          <el-button>添加角色</el-button>
        </el-col>
      </el-row>
    <!-- 表格 -->
    <el-table
        :data="roles"
        height="400px"
        style="width: 100%">
        <el-table-column type="expand" width="80" >
          <template slot-scope="scope">
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <el-col :span="4"><el-tag type="success">{{item1.authName}}</el-tag></el-col>
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4" ><el-tag type="warning">{{item2.authName}}</el-tag></el-col>
                  <el-col :span="20">
                    <el-tag v-for="(item3, i) in item2.children" :key="i">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"  label="#"  width="80" ></el-table-column>
        <el-table-column prop="roleName"  label="角色名称"  width="180"></el-table-column>
        <el-table-column prop="roleDesc"  label="角色描述"  width="200"></el-table-column>
        <el-table-column label="操作"  width="180">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain ></el-button>
              <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles:[]
    }
  },
  created() {
    this.getRoles();
  },
  methods:{
    async getRoles() {
      const res = await this.$http.get(`roles`);
      console.log(res);
      this.roles = res.data.data;
      
    }
  }
}
</script>

<style>
  .card {
    height: 100%;
  }
  .row {
    margin-top: 20px;
  }
</style>
