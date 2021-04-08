import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Home = ()=>import('../views/Home.vue')
const DataDetail = ()=>import('../views/dataDetail.vue')
const OrderTime = ()=>import('../views/orderTime.vue')
const Login = ()=>import('../views/login.vue')
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children:[
      {
        path:'/',
        redirect:'orderTime'
      },
      {
        path:'dataDetail',
        component:DataDetail

      },
      {
        path:'orderTime',
        component:OrderTime

      }
    ]
  },
  {
    path:'/login',
    name:'login',
    component:Login
  }
  
]

const router = new VueRouter({
  routes
})

export default router
