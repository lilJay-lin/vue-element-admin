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
  agree (data) {
    return fetch({
      method: 'POST',
      url: '/mi/refundAction/agree',
      data
    })
  }
  refuse (data) {
    return fetch({
      method: 'POST',
      url: '/mi/refundAction/reject',
      data
    })
  }
}

export default new Classification('/mi/refund')
