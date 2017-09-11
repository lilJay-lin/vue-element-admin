/**
 * Created by linxiaojie on 2017/8/8.
 */
import fetch from '../utils/fetch_new'
import { cleanArray } from '../utils'

/*
* 获取列表
* */
export const getAll = () => {
  return fetch({
    url: '/mi/permission',
    method: 'get'
  })
}
