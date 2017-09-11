/**
 * Created by linxiaojie on 2017/8/8.
 */
import { each, has } from '../../utils'
import * as TYPES from '../types'
import { getAll, getDetail, updateDetail, batch, create } from '../../api/role'

const role = {
  state: {
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
    }
  },
  mutations: {
    [TYPES.SET_ROLES_LIST] (state, data) {
      state.records = data.datas
      state.pageInfo = {
        currentPage: data.targetPage,
        totalRow: data.total,
        totalPage: data.totalPage
      }
    }
  },
  actions: {
    GetAllRoles ({ commit }, query) {
      return new Promise((resolve, reject) => {
        getAll(query).then(({ data: { result } }) => {
          commit(TYPES.SET_ROLES_LIST, result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetRoleDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { result } }) => {
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateRoleDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelRoles ({ dispatch }, { ids }) {
      return new Promise((resolve, reject) => {
        batch(ids).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreateRole (store, detail) {
      return new Promise((resolve, reject) => {
        create(detail).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default role
