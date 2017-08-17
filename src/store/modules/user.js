import { loginByName, logout, getInfo } from 'api/login';
import { getToken, setToken, removeToken } from 'utils/auth';
import { each, has } from '../../utils'
import * as TYPES from '../types'
import { getAll, getDetail, updateDetail, batch, create } from '../../api/user'

/*
* 登录用户和用户列表state
* */
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
    permissions: [],
    setting: {
      articlePlatform: []
    },
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
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
    [TYPES.SET_TOKEN]: (state, token) => {
      state.token = token;
    },
    [TYPES.SET_SETTING]: (state, setting) => {
      state.setting = setting;
    },
    [TYPES.SET_USERS_LIST] (state, data) {
      each(data, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
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

/*    // 第三方验证登录
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
    },*/

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit(TYPES.SET_TOKEN, '');
          commit(TYPES.SET_USER, { roles: [] });
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
    ChangeRole({ commit }, roles) {
      return new Promise(resolve => {
        commit(TYPES.SET_USER, { roles });
        commit(TYPES.SET_TOKEN, user);
        setToken(user);
        resolve();
      })
    },
    GetAllUsers ({ commit }, query) {
      return new Promise((resolve, reject) => {
        getAll(query).then(({ data }) => {
          commit(TYPES.SET_USERS_LIST, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { user } }) => {
          resolve(user)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateUserDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelUsers ({ dispatch }, { ids, data }) {
      return new Promise((resolve, reject) => {
        batch(ids, data).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreateUser(store, detail) {
      return new Promise((resolve, reject) => {
        create(detail).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
};

export default user;
