import Base from './base'
import api from 'api/presentOrder'

export default new Base('PresentOrder', {
  SET_LIST: 'SET_PresentOrder_LIST'
}, api)

