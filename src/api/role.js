/**
 * Created by linxiaojie on 2017/8/8.
 */
import Base from './base'

class Role extends Base {
  constructor (base) {
    super(base)
    this.base = base
  }
}

export default new Role('/mi/role')

