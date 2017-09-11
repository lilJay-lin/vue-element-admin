import { loginByName, logout, getInfo, getPublicKey, geetest } from 'api/login';
import * as TYPES from '../types'
import * as Token from '../../utils/auth'
import { getAll, getDetail, updateDetail, batch, create, updateSelf } from '../../api/user'

/*
* 登录用户和用户列表state
* */
const user = {
  state: {
    id: '',
    userName: '',
    locked: '',
    avatar: '',
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
      state.id = user.id
      state.userName = user.name
      state.permissions = (user.permissionList || []).map((permission) => {
        return permission.code
      })
      state.locked = user.locked
    },
    [TYPES.SET_SETTING]: (state, setting) => {
      state.setting = setting;
    },
    [TYPES.SET_USERS_LIST] (state, data) {
      state.records = data.datas
      state.pageInfo = {
        currentPage: data.targetPage,
        totalRow: data.total,
        totalPage: data.totalPage
      }
    }
  },

  actions: {
    // 邮箱登录
    LoginByName({ commit }, data) {
      return new Promise((resolve, reject) => {
        loginByName(data).then(response => {
          const result = response.data.result
          commit(TYPES.SET_USER, result)
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(({ data: { result } }) => {
          const permissions = Token.getPermissions() || ''
          result.permissionList = (permissions.split(',')).map((code) => {
            return { code }
          })
          commit(TYPES.SET_USER, result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 更新当前用户信息
    UpdateSelf({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        updateSelf(detail).then(({ data: { result } }) => {
          result.permissionList = state.permissionList
          commit(TYPES.SET_USER, result)
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取公钥
    GetPublicKey () {
      return new Promise((resolve, reject) => {
        getPublicKey().then(response => {
          resolve(response.data.result);
        }).catch(error => {
          reject(error);
        });
      });
    },
    Geetest () {
      return new Promise((resolve, reject) => {
        geetest().then(({ data: { user_id, success, gt, challenge } }) => {
          resolve({
            user_id,
            challenge,
            offline: success,
            product: 'popup',
            gt
          });
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
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          Token.removeToken()
          commit(TYPES.SET_USER, { id: '', userName: '', permissionList: [], locked: false });
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut() {
      return new Promise(resolve => {
        Token.removeToken()
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({ commit }, roles) {
      return new Promise(resolve => {
        commit(TYPES.SET_USER, { roles });
        resolve();
      })
    },
    GetAllUsers ({ commit }, query) {
      return new Promise((resolve, reject) => {
        getAll(query).then(({ data: { result } }) => {
          commit(TYPES.SET_USERS_LIST, result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { result } }) => {
          resolve(result)
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
    DelUsers ({ dispatch }, { ids }) {
      return new Promise((resolve, reject) => {
        batch(ids).then(() => {
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
