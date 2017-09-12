import Base from './base'
import api from 'api/cashCoupon'

export default new Base('CashCoupon', {
  SET_LIST: 'SET_CASH_COUPON_LIST'
}, api)

