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
      each(data, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
    },
    [TYPES.SET_ROLES_SELECTED] (state, item) {
      each(item, (val, key) => {
        if (state.current.has(key)) {
          state.current[key] = val
        }
      })
    },
    [TYPES.SET_ROLES_PERMISSIONS] (state, permissions) {
      state.current.permissions = permissions
    }
  },
  actions: {
    GetAllRoles ({ commit }, query) {
      return new Promise((resolve, reject) => {
        getAll(query).then(({ data }) => {
          commit(TYPES.SET_ROLES_LIST, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetRoleDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { role } }) => {
          resolve(role)
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
    DelRoles ({ dispatch }, {ids, data}) {
      return new Promise((resolve, reject) => {
        batch(ids, data).then(() => {
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
