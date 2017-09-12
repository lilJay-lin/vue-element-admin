/**
 * Created by liljay on 2017/9/12.
 */
import fetch from '../utils/fetch_new'
import { cleanArray } from '../utils'

export default class {
  constructor (base) {
    this.base = base
  }
  /*
   * 获取列表
   * */
  getAll (query) {
    return fetch({
      url: this.base,
      method: 'get',
      params: query
    })
  }
  /*
   * 查询详情
   * */
  getDetail (id) {
    return fetch({
      url: this.base + '/' + id,
      method: 'get'
    })
  }
  /*
   * 更新详情
   * */
  updateDetail (data = { id: '' }) {
    if (data.id === '') {
      return Promise.reject('id不能为空')
    }
    return fetch({
      url: this.base + '/' + data.id,
      method: 'patch',
      data
    })
  }
  /*
   * 批量操作数据
   * */
  batch (ids = []) {
    ids = cleanArray(ids)
    if (ids.length === 0) {
      return Promise.reject('ids不能为空')
    }
    return fetch({
      url: this.base + '?ids=' + ids.join(','),
      method: 'delete'
    })
  }
  /*
   * 新增
   * */
  create (data) {
    return fetch({
      url: this.base,
      method: 'post',
      data
    })
  }
}
