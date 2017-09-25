import Vue from 'vue'
import Router from 'vue-router'
import * as Constant from '../constant'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/* view */
import Login from '../views/login'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* noDropdown : if `noDropdown:true` will has no submenu
* meta : { role: ['admin'] }  will control the page role
**/
export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
    { path: '/404', component: _import('error/404'), hidden: true },
    { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/crp',
    component: Layout,
    redirect: 'noredirect',
    name: '系统模块',
    icon: 'quanxian',
    meta: { role: [Constant.admin_r, Constant.role_r, Constant.user_r] },
    children: [
      { path: 'admin', component: _import('admin/index'), name: '管理员管理', meta: { role: [Constant.admin_r] } },
      { path: 'role', component: _import('role/index'), name: '角色管理', meta: { role: [Constant.role_r] } },
      { path: 'user', component: _import('register/index'), name: '注册用户管理', meta: { role: [Constant.user_r] } }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: 'noredirect',
    name: '业务管理',
    icon: 'xinrenzhinan',
    meta: { role: [Constant.cashCouponOrder_r, Constant.refund_r, Constant.cashCouponOrderCount_manage] },
    children: [
      { path: 'cashCouponOrder', component: _import('cashCouponOrder/index'), name: '代金券订单管理', meta: { role: [Constant.cashCouponOrder_r] } },
      { path: 'refund', component: _import('refund/index'), name: '代金券退款管理', meta: { role: [Constant.refund_r] } },
      { path: 'cashCouponOrderStatus', component: _import('cashCouponOrderStatus/index'), name: '代金券订单统计维护', meta: { role: [Constant.cashCouponOrderCount_manage] } }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: 'noredirect',
    name: '商家模块',
    icon: 'yinhangqia',
    meta: { role: [Constant.shopClassification_r, Constant.shop_r, Constant.cashCoupon_r, Constant.promotionalPartner_r, Constant.indexContactWay_manage, Constant.promotionalPartner_manage] },
    children: [
      { path: 'index', component: _import('shop/index'), name: '商家帐号管理', meta: { role: [Constant.shop_r] } },
      { path: 'classification', component: _import('classification/index'), name: '商家分类管理', meta: { role: [Constant.shopClassification_r] } },
      { path: 'promotionalPartner', component: _import('promotionalPartner/index'), name: '合作伙伴管理', meta: { role: [Constant.promotionalPartner_r] } },
      { path: 'contact', component: _import('contact/index'), name: '联系方式维护', meta: { role: [Constant.indexContactWay_manage] } },
      { path: 'partner', component: _import('partner/index'), name: '合作伙伴费率维护', meta: { role: [Constant.promotionalPartner_manage] } }
    ]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/index',
    hidden: true,
    children: [{ path: 'index', component: _import('userCenter/index'), name: '个人中心' }]
  },
  {
    path: '/ad',
    component: Layout,
    redirect: 'noredirect',
    name: '抽奖模块',
    icon: 'table',
    meta: { role: [Constant.refundReason_r, Constant.advertisement_r, Constant.shopAccountRedPack_manage] },
    children: [
      { path: 'present', component: _import('present/index'), name: '礼品管理', meta: { role: [Constant.advertisement_r] } },
      { path: 'presentOrder', component: _import('presentOrder/index'), name: '抽奖管理', meta: { role: [Constant.refundReason_r] } },
      { path: 'redPack', component: _import('redPack/index'), name: '抽奖维护', meta: { role: [Constant.shopAccountRedPack_manage] } }
    ]
  },
  {
    path: '/other',
    component: Layout,
    redirect: 'noredirect',
    name: '其他',
    icon: 'zonghe',
    meta: { role: [Constant.refundReason_r, Constant.advertisement_r] },
    children: [
      { path: 'advertisement', component: _import('advertisement/index'), name: '广告管理', meta: { role: [Constant.advertisement_r] } },
      { path: 'refundReason', component: _import('refundReason/index'), name: '退款原因管理', meta: { role: [Constant.refundReason_r] } }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
