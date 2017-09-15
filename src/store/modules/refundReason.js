import Base from './base'
import api from 'api/refundReason'

export default new Base('RefundReason', {
  SET_LIST: 'SET_RefundReason_LIST'
}, api)

