/**
 * Created by linxiaojie on 2017/8/8.
 */
import Base from './base'
import fetch from '../utils/fetch_new'
class Classification extends Base {
  constructor (base) {
    super(base)
    this.base = base
  }
  getMaintenanceStatusGet () {
    return fetch({
      url: '/mi/shopAccountAction/maintenanceStatusGet'
    })
  }
  updateMaintenanceStatusPost (status) {
    return fetch({
      method: 'post',
      url: '/mi/shopAccountAction/maintenanceStatusPost',
      data: {
        redPackHide: status
      }
    })
  }
  getPartnerMaintenanceStatusGet () {
    return fetch({
      method: 'get',
      url: '/mi/promotionalPartnerAction/maintenanceStatusGet'
    })
  }
  updatePartnerMaintenanceStatusPost (rate) {
    return fetch({
      method: 'post',
      url: '/mi/promotionalPartnerAction/maintenanceStatusPost',
      data: {
        rate
      }
    })
  }
  getContactMaintenanceStatusGet () {
    return fetch({
      method: 'get',
      url: '/mi/indexContactWayAction/maintenanceStatusGet'
    })
  }
  updateContactMaintenanceStatusPost (data) {
    return fetch({
      method: 'post',
      url: '/mi/indexContactWayAction/maintenanceStatusPost',
      data
    })
  }
  getCashCouponOrderMaintenanceStatusGet () {
    return fetch({
      method: 'get',
      url: '/mi/cashCouponOrderAction/maintenanceStatusGet'
    })
  }
  updateCashCouponOrderMaintenanceStatusPost (cashCouponOrderHide) {
    return fetch({
      method: 'post',
      url: '/mi/cashCouponOrderAction/maintenanceStatusPost',
      data: {
        cashCouponOrderHide
      }
    })
  }
  getServerRootUrl () {
    return fetch({
      url: '/open/getServerRootUrl'
    })
  }
  countPartner () {
    return fetch({
      method: 'post',
      url: '/mi/promotionalPartnerAction/countNow'
    })
  }
  countCashCouponOrder () {
    return fetch({
      method: 'post',
      url: '/mi/cashCouponOrderAction/countNow'
    })
  }
}

export default new Classification('/mi/shop')
