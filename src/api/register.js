/**
 * Created by linxiaojie on 2017/8/8.
 */
import Base from './base'

class Register extends Base {
  constructor (base) {
    super(base)
    this.base = base
  }
}

export default new Register('/mi/user')

