import Base from './base'
import api from 'api/refund'

const store = new Base('Refund', {
  SET_LIST: 'SET_Refund_LIST'
}, api)

store.actions['Agree'] = (store, data) => {
  return new Promise((resolve, reject) => {
    api.agree(data).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

store.actions['Refuse'] = (store, data) => {
  return new Promise((resolve, reject) => {
    api.refuse(data).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export default store

