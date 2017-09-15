import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';
import createLogger from '../../node_modules/vuex/src/plugins/logger'
import role from './modules/role'
import register from './modules/register'
import classification from './modules/classification'
import shop from './modules/shop'
import cashCoupon from './modules/cashCoupon'
import shopAccount from './modules/shopAccount'
import shopIntroductionImage from './modules/shopIntroductionImage'
import cashCouponOrder from './modules/cashCouponOrder'
import refund from './modules/refund'
import advertisement from './modules/advertisement'
import refundReason from './modules/refundReason'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    role,
    register,
    classification,
    shop,
    cashCoupon,
    shopAccount,
    shopIntroductionImage,
    cashCouponOrder,
    refund,
    advertisement,
    refundReason
  },
  getters,
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : []
});

export default store
