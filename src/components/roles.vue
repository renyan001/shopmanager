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
        <el-table-column type="expand" width="250">
          <template slot-scope="scope">
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <el-col :span="4"><el-tag closable type="success" @close="deleRights(scope.row,item1)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4" ><el-tag closable type="warning" @close="deleRights(scope.row,item2)">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                  </el-col>                  
                  <el-col :span="20">
                    <el-tag closable v-for="(item3, i) in item2.children" :key="i" @close="deleRights(scope.row,item3)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.children.length===0">
              <el-col>
                <span>该角色没有分配权限</span> 
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
              <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showDiaRights(scope.row)"></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的对话框 -->
      <el-dialog title="权限管理" :visible.sync="dialogVisiblerights" width="50%">
        <el-tree 
        ref="tree"
        :data="treeData" show-checkbox node-key="id" 
        default-expand-all
        :default-checked-keys="checkedArr"
        :props="defaultProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblerights = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles:[],
      dialogVisiblerights:false,
      currentRoleId:-1,
      treeData:[],
      checkedArr:[],
      defaultProps:{
        children: 'children',
        label: 'authName'
      }
    }
  },
  created() {
    this.getRoles();
  },
  methods:{
    // 点击确定 重新确定权限
    async setRights() {
      // 权限id列表 -> 全选节点 + 半选节点
      // 获取树形结构 el-tree 的全选节点
      const arr1 = this.$refs.tree.getCheckedKeys();
      console.log(arr1);
      // 获取树形结构 el-tree 的半选节点
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      console.log(arr2);

      const arr = [...arr1, ...arr2];
      console.log(arr);
      
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids:arr.join(",")
      });
      this.getRoles();
      this.dialogVisiblerights = false;
      
    },
    // 点击打开对话框 展示所有权限列表
    async showDiaRights(rights) {
      // console.log(rights.id);
      this.currentRoleId = rights.id;
      this.dialogVisiblerights = true;
      // 获取树形结构的数据
      const res = await this.$http.get(`rights/tree`);
      console.log(res);
      this.treeData = res.data.data;

      const tempArr = [];

      // 遍历所有权限
      // console.log(rights.children);
      // rights.children.forEach(item1 => {
      //   console.log(item1.id);
        
      // })
      
      rights.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          })
        })
      });
      // console.log(tempArr);
      this.checkedArr = tempArr;
      
        
      
    },
    // 删除tag
    async deleRights(role,rights) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
      // console.log(res);
      // this.getRoles();
      role.children = res.data.data;
      
    },
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
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
  .height {
    margin-bottom: 10px;
  }
</style>
