import { asyncRouterMap, constantRouterMap } from 'src/router'
import { each, has } from '../../utils'
import { getAll, getDetail, updateDetail, batch, create } from '../../api/permission'
import * as TYPES from '../types'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    records: [],
    pageInfo: {
      currentPage: 1,
      totalRow: 0,
      totalPage: 0
    }
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    [TYPES.SET_PERMISSIONS_LIST] (state, data) {
      each(data, (val, key) => {
        if (has(state, key)) {
          state[key] = val
        }
      })
    },
    [TYPES.SET_PERMISSIONS_SELECTED] (state, item) {
      each(item, (val, key) => {
        if (state.current.has(key)) {
          state.current[key] = val
        }
      })
    },
    [TYPES.SET_PERMISSIONS_PERMISSIONS] (state, permissions) {
      state.current.permissions = permissions
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.indexOf('admin') >= 0) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    },
    GetAllPermissions ({ commit }, query) {
      return new Promise((resolve, reject) => {
        getAll(query).then(({ data }) => {
          commit(TYPES.SET_PERMISSIONS_LIST, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetPermissionDetail ({ commit }, id) {
      return new Promise((resolve, reject) => {
        getDetail(id).then(({ data: { permission } }) => {
          resolve(permission)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdatePermissionDetail ({ commit, state }, detail) {
      return new Promise((resolve, reject) => {
        updateDetail(detail).then(() => resolve()).catch(error => {
          reject(error)
        })
      })
    },
    DelPermissions ({ dispatch }, { ids, data }) {
      return new Promise((resolve, reject) => {
        batch(ids, data).then(() => {
          dispatch('GetAllPermissions').then(resolve, reject)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    CreatePermission (store, detail) {
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

export default permission;
