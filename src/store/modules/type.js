/**
 * Created by linxiaojie on 2017/8/8.
 */
import { each, has } from '../../utils'
import * as TYPES from '../types'
import * as API from '../../api/type'

const state = {
  state: {
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
    }
  },
  mutations: {
    [TYPES.SET_TYPES_LIST] (state, data) {
      each(data, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
    }
  },
  actions: {
    GetAllTypes ({ commit }, query) {
      return new Promise((resolve, reject) => {
        API.getAll(query).then(({ data }) => {
          commit(TYPES.SET_TYPES_LIST, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetTypeDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        API.getDetail(id).then(({ data: { type } }) => {
          resolve(type)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateTypeDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        API.updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelTypes ({ dispatch }, { ids, data }) {
      return new Promise((resolve, reject) => {
        API.batch(ids, data).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreateType (store, detail) {
      return new Promise((resolve, reject) => {
        API.create(detail).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default state
