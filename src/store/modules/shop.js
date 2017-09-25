import Base from './base'
import api from 'api/shop'

const store = new Base('Shop', {
  SET_LIST: 'SET_SHOP_LIST'
}, api)

store.actions['MaintenanceStatusGet'] = () => {
  return new Promise((resolve, reject) => {
    api.getMaintenanceStatusGet().then(({ data: { result: { redPackHide } } }) => {
      resolve(redPackHide)
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['MaintenanceStatusPost'] = ({ commit }, redPackHide) => {
  return new Promise((resolve, reject) => {
    api.updateMaintenanceStatusPost(redPackHide).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

store.actions['PartnerMaintenanceStatusGet'] = () => {
  return new Promise((resolve, reject) => {
    api.getPartnerMaintenanceStatusGet().then(({ data: { result } }) => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['PartnerMaintenanceStatusPost'] = (store, data) => {
  return new Promise((resolve, reject) => {
    api.updatePartnerMaintenanceStatusPost(data).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

store.actions['ContactMaintenanceStatusGet'] = () => {
  return new Promise((resolve, reject) => {
    api.getContactMaintenanceStatusGet().then(({ data: { result } }) => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['ContactMaintenanceStatusPost'] = (store, data) => {
  return new Promise((resolve, reject) => {
    api.updateContactMaintenanceStatusPost(data).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

store.actions['CashCouponOrderMaintenanceStatusGet'] = () => {
  return new Promise((resolve, reject) => {
    api.getCashCouponOrderMaintenanceStatusGet().then(({ data: { result } }) => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['CashCouponOrderMaintenanceStatusPost'] = (store, cashCouponOrderHide) => {
  return new Promise((resolve, reject) => {
    api.updateCashCouponOrderMaintenanceStatusPost(cashCouponOrderHide).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['GetServerRootUrl'] = () => {
  return new Promise((resolve, reject) => {
    api.getServerRootUrl().then(({ data: { result } }) => {
      resolve(result)
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['CountPartner'] = () => {
  return new Promise((resolve, reject) => {
    api.countPartner().then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
store.actions['CountCashCouponOrder'] = () => {
  return new Promise((resolve, reject) => {
    api.countCashCouponOrder().then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export default store


