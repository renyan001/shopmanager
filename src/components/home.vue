<template>
  <el-container class="container">
    <!-- 顶部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="5">
          <img src="@/assets/logo.png" alt="">
        </el-col>
        <el-col :span="18">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <!-- 侧边栏 -->
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        unique-opened
        :router="true"
        >
        <!-- 1 -->
        <el-submenu :index="''+item1.order" v-for="(item1) in menus" :key="item1.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item1.authName}}</span>
          </template>
            <el-menu-item :index="item2.path" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
        </el-submenu>        
      </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>

</template>

<script>
export default {
  // 在组建渲染之前
  beforeCreate () {
    // if (!localStorage.getItem('token')) {
    //   // 回到登录
    //   this.$router.push({
    //     name: 'login'
    //   })
    //   // 提示
    //   this.$message.warning('请先登录')
    // }
  },
  created() {
    this.getMenus();
  },
  data() {
    return {
      menus:[]
    };    
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      this.menus = res.data.data;
    },
    handleLoginout () {
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
      this.$message.success('退出成功')
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
  }
  .header {
    background: #b3c0d1;
  }
  h2 {
    color:#fff;
    text-align: center;
    line-height: 56px;
  }
  a {
    text-decoration: none;
    line-height: 56px;
  }
  /* .aside {
    background: rgb(154, 188, 250);
  }
  .main {
    background: rgb(143, 153, 245);
  } */
</style>
