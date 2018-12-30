<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username" type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password" type="password"></el-input>
      </el-form-item>
      <el-button class="btn" type="primary" @click="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      const res = await this.$http.post('login', this.formdata);
      const { data: { data, meta: { msg, status } } } = res;
      if (status === 200) {
        localStorage.setItem('token',data.token);
        this.$router.push({
          name:'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
    // handleLogin () {
    //   this.$http.post('login', this.formdata).then(res => {
    //     const { data: { data, meta: { msg, status } } } = res;
    //     if (status === 200) {
    //       this.$router.push({
    //         name:'home'
    //       })
    //     } else {
    //       this.$message.error(msg)
    //       // this.$message({
    //       //   message: msg,
    //       //   type: 'error'
    //       // })
    //     }
    //   })
    // }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-wrap .login-form .btn {
  width: 100%;
}
</style>
