/**
 * Created by linxiaojie on 2017/8/8.
 */
/**
 * Created by linxiaojie on 2017/8/8.
 */
import Base from './base'
import fetch from '../utils/fetch_new'

class Admin extends Base {
  constructor (base) {
    super(base)
    this.base = base
  }
  updateSelf (data) {
    return fetch({
      url: '/mi/adminAction/self',
      method: 'patch',
      data
    })
  }
}
export default new Admin('/mi/admin')



