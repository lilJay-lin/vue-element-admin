import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';
import createLogger from 'vuex/dist/logger'
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
import present from './modules/present'
import presentOrder from './modules/presentOrder'
import promotionalPartner from './modules/promotionalPartner'

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
    refundReason,
    present,
    presentOrder,
    promotionalPartner
  },
  getters,
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : []
});

export default store
