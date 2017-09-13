import Base from './base'
import api from 'api/shopAccount'

export default new Base('ShopAccount', {
  SET_LIST: 'SET_ShopAccount_LIST'
}, api)

