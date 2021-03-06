import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';
import createLogger from '../../node_modules/vuex/src/plugins/logger'
import role from './modules/role'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    role
  },
  getters,
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : []
});

export default store
