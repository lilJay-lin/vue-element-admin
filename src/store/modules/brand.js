/**
 * Created by linxiaojie on 2017/8/8.
 */
import { each, has } from '../../utils'
import * as TYPES from '../types'
import * as API from '../../api/brand'

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
    [TYPES.SET_BRANDS_LIST] (state, data) {
      each(data, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
    }
  },
  actions: {
    GetAllBrands ({ commit }, query) {
      return new Promise((resolve, reject) => {
        API.getAll(query).then(({ data }) => {
          commit(TYPES.SET_BRANDS_LIST, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetBrandDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        API.getDetail(id).then(({ data: { brand } }) => {
          resolve(brand)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateBrandDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        API.updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelBrands ({ dispatch }, { ids, data }) {
      return new Promise((resolve, reject) => {
        API.batch(ids, data).then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreateBrand (store, detail) {
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
