import Base from './base'
import api from 'api/cashCouponOrder'

export default new Base('CashCouponOrder', {
  SET_LIST: 'SET_CashCouponOrder_LIST'
}, api)

