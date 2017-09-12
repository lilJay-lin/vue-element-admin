import Base from './base'
import api from 'api/classification'

export default new Base('ShopClassification', {
  SET_LIST: 'SET_CLASSIFICATION_LIST'
}, api)

