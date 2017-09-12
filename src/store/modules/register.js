import Base from './base'
import api from 'api/register'

export default new Base('Register', {
  SET_LIST: 'SET_REGISTER_LIST'
}, api)
