import Vue from 'vue'
import Router from 'vue-router'


const Login = () => import('@/components/login.vue')
const Home = () => import('@/components/home.vue')
const Users = () => import('@/components/users.vue')
const Rights = () => import('@/components/rights.vue')
const Roles = () => import('@/components/roles.vue')
const Goodslist = () => import('@/components/Goodslist.vue')
const GoodsAdd = () => import('@/components/goodsadd.vue')
const Params = () => import('@/components/params.vue')
const Categories = () => import('@/components/goodscate.vue')
const Orders = () => import('@/components/order.vue')
const Reports = () => import('@/components/reports.vue')
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
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'orders',
          path: '/orders',
          component: Orders
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
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