import { loginByName, logout, getInfo } from 'api/login';
import { getToken, setToken, removeToken } from 'utils/auth';
import * as TYPES from '../types'
import { each, has } from '../../utils'

const user = {
  state: {
    userName: '',
    loginName: '',
    email: '',
    status: '',
    token: getToken(),
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },


  mutations: {
    [TYPES.SET_USER]: (state, user) => {
      each(user, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
    },
    [TYPES.SET_CODE]: (state, code) => {
      state.code = code;
    },
    [TYPES.SET_TOKEN]: (state, token) => {
      state.token = token;
    },
    [TYPES.SET_INTRODUCTION]: (state, introduction) => {
      state.introduction = introduction;
    },
    [TYPES.SET_SETTING]: (state, setting) => {
      state.setting = setting;
    },
    [TYPES.SET_STATUS]: (state, status) => {
      state.status = status;
    },
    [TYPES.SET_LOGIN_NAME]: (state, name) => {
      state.loginName = name;
    },
    [TYPES.SET_USER_NAME]: (state, name) => {
      state.userName = name;
    },
    [TYPES.SET_AVATAR]: (state, avatar) => {
      state.avatar = avatar;
    },
    [TYPES.SET_CURRENT_ROLES]: (state, roles) => {
      state.roles = roles;
    },
    [TYPES.LOGIN_SUCCESS]: () => {
      console.log('login success')
    },
    [TYPES.LOGOUT_USER]: state => {
      state.user = '';
    }
  },

  actions: {
    // 邮箱登录
    LoginByName({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim();
      return new Promise((resolve, reject) => {
        loginByName(loginName, userInfo.password).then(response => {
          const data = response.data;
          setToken(data.token);
          commit(TYPES.SET_TOKEN, data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          commit(TYPES.SET_USER, response.data.user)
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit(TYPES.SET_CODE, code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit(TYPES.SET_TOKEN, response.data.token);
          setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit(TYPES.SET_TOKEN, '');
          commit(TYPES.SET_CURRENT_ROLES, []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit(TYPES.SET_TOKEN, '');
        removeToken();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, role) {
      return new Promise(resolve => {
        commit(TYPES.SET_CURRENT_ROLES, [role]);
        commit(TYPES.SET_TOKEN, role);
        setToken(role);
        resolve();
      })
    }
  }
};

export default user;
