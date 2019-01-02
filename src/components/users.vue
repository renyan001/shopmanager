<template>
  <div>
    <el-card class="box-card">
      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索框 -->
      <el-row>
        <el-col>
          <el-input 
          class="searchInput" 
          clearable
          @clear="getAllUsers()"
          placeholder="请输入用户名"
          v-model="query">
            <el-button 
            @click="selectUsers()"
            slot="append" icon="el-icon-search"></el-button>            
          </el-input>
          <el-button type="primary" plain
          @click="showDiaAdd()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column prop="id"  label="#"  width="80"></el-table-column>
        <el-table-column prop="username"  label="姓名"  width="120"></el-table-column>
        <el-table-column prop="email"  label="邮箱"  width="160"></el-table-column>
        <el-table-column prop="mobile"  label="电话"  width="160"></el-table-column>
        <el-table-column label="创建日期"  width="160">
          <template slot-scope="scope">
            {{scope.row.create_time | fmtData}}
          </template>
        </el-table-column>
        <el-table-column label="用户状态"  width="140">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>          
        </el-table-column>
        <el-table-column label="操作"  width="180">
          <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditDia(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDeleConfirm(scope.row.id)"></el-button>
              <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        height="300px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query:"",
      pagenum:1,
      pagesize:2,
      total:-1,
      form:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      formLabelWidth:"100px",
      dialogFormVisibleAdd:false,
      dialogFormVisibleEdit:false
    }
  },
  created() {
    this.getTableData();
  },
  methods:{
    editUser() {

    },
    // 编辑
    async showEditDia(user) {
      this.$http.defaults.headers.common['Authorization'] = localStorage.getItem('token');
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.put(`users/${user.id}`, {
        username:this.form.username,
        mobile: this.form.mobile,
        email: this.form.email
      });
      // console.log(form);
      
      const {meta:{msg, status}} = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.editUserDialogFormVisible = false
        this.getTableData();
        this.form = {};
      } else {
        this.$message.error(msg);
      }
    },
    // 删除
    showDeleConfirm(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`users/${id}`);
          const {meta:{msg, status}} = res.data;                    
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
          
        }).catch(() => {
          this.$message.error('删除失败');
        });
      },
    // 添加用户 发送请求
    async addUser() {
      // 发请求
      const res = await this.$http.post(`users`,this.form);
      console.log(res);
      const {
        data:{
          meta:{
          msg,status
        }
        }
        
      } = res;
      if (status === 201) {
        
        this.$message.success(msg);
        // 关闭对话框
        this.dialogFormVisibleAdd = false;   
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }  
    },
    // 点击添加用户 打开对话框
    showDiaAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true
    },
    // 清空输入框时 获取所有信息
    getAllUsers() {
      this.getTableData();
    },
    // 搜索
    selectUsers() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
      console.log(`当前页: ${val}`);
    },
    async getTableData() {
      // 请求数据
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      const {
        data:{
          data: { total, users },
          meta: { status, msg }
        }        
      } = res;
      console.log(res);
      
      if (status === 200) {
        // 给表格数据赋值
        this.tableData = users;
        this.total = total;
        console.log(this.tableData);
        
        // 提示成功
        this.$message.success(msg);
      }
    }
  }
}

</script>

<style>
  
  .box-card {
    height: 100%;
  }
  .searchInput {
    margin-top: 20px;
    width: 350px;
  }
</style>
