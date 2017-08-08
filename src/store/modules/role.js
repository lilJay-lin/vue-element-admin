/**
 * Created by linxiaojie on 2017/8/8.
 */
import { each, has } from '../../utils'
import * as TYPES from '../types'
import { getAll, getDetail, updateDetail, del } from '../../api/role'

const role = {
  state: {
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
    },
    current: {
      _id: '',
      name: '',
      description: '',
      status: '',
      permissions: []
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
          commit(TYPES.SET_ROLES_LIST, data);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    GetRoleDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { role } }) => {
          commit(TYPES.SET_ROLES_SELECTED, role);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    UpdateRoleDetail ({ commit, state }, id, detail) {
      return new Promise((resolve, reject) => {
        updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error);
        });
      });
    },
    DelRoles ({ dispatch }, ids) {
      return new Promise((resolve, reject) => {
        del(ids).then(() => {
          dispatch('GetAllRoles').then(resolve, reject)
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
}

export default role