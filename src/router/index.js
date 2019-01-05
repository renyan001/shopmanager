import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/roles.vue'
import GoodsAdd from '@/components/roles.vue'
// 单独引入组件
import {
  Message
} from 'element-ui'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsadd',
          path: '/goods/add',
          component: GoodsAdd
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// 拦截路由配置
router.beforeEach((to, from, next) => {
  // 如果要去的是login 继续执行路由配置
  if (to.name === 'login') {
    next();
  } else {
    // 如果要去home 判断token 如果有token ,next()  如果没有token 返回到login
    const token = localStorage.getItem('token');
    if (!token) {
      Message.warning("请先登录");
      router.push({
        name: 'login'
      });
    } else {
      next();
    }
  }

  next(); //前往下一个页面
  })

export default router;