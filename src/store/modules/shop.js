import Base from './base'
import api from 'api/shop'

export default new Base('Shop', {
  SET_LIST: 'SET_SHOP_LIST'
}, api)

