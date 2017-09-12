import API from 'api/register';
import * as TYPES from '../types'

/*
* 登录用户和用户列表state
* */
const register = {
  state: {
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
    }
  },
  mutations: {
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
    GetAllRegisters ({ commit }, query) {
      return new Promise((resolve, reject) => {
        API.getAll(query).then(({ data: { result } }) => {
          commit(TYPES.SET_USERS_LIST, result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetRegisterDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        API.getDetail(id).then(({ data: { result } }) => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateRegisterDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        API.updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelRegisters ({ dispatch }, { ids }) {
      return new Promise((resolve, reject) => {
        API.batch(ids).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreateRegister(store, detail) {
      return new Promise((resolve, reject) => {
        API.create(detail).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
};

export default register;
