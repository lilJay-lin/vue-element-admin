export default class {
  constructor (name, types, api) {
    this.types = types
    const API = api
    return {
      state: {
        records: [],
        pageInfo: {
          currentPage: 1,
          totalRow: 0,
          totalPage: 0
        }
      },
      mutations: {
        [types.SET_LIST] (state, data) {
          state.records = data.datas
          state.pageInfo = {
            currentPage: data.targetPage,
            totalRow: data.total,
            totalPage: data.totalPage
          }
        }
      },
      actions: {
        ['GetAll' + name] ({ commit }, query) {
          return new Promise((resolve, reject) => {
            API.getAll(query).then(({ data: { result } }) => {
              commit(types.SET_LIST, result)
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        },
        ['Get' + name + 'Detail'] ({ commit }, id) {
          return new Promise((resolve, reject) => {
            API.getDetail(id).then(({ data: { result } }) => {
              resolve(result)
            }).catch(error => {
              reject(error)
            })
          })
        },
        ['Update' + name + 'Detail'] ({ commit, state }, detail) {
          return new Promise((resolve, reject) => {
            API.updateDetail(detail).then(() => resolve()).catch(error => {
              reject(error)
            })
          })
        },
        ['Del' + name] ({ dispatch }, { ids }) {
          return new Promise((resolve, reject) => {
            API.batch(ids).then(() => {
              resolve()
            }).catch(error => {
              reject(error)
            })
          })
        },
        ['Create' + name] (store, detail) {
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
  }
}
