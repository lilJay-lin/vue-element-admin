/**
 * Created by linxiaojie on 2017/8/8.
 */
import fetch from '../utils/fetch_new'
import { cleanArray } from '../utils'

/*
* 获取列表
* */
export const getAll = (query) => {
  return fetch({
    url: '/roles',
    method: 'get',
    params: query
  })
}

/*
* 查询详情
* */
export const getDetail = (id) => {
  return fetch({
    url: '/roles/' + id,
    method: 'get'
  })
}

/*
* 更新详情
* */
export const updateDetail = (data = { _id: '' }) => {
  if (data._id === '') {
    return Promise.reject('id不能为空')
  }
  return fetch({
    url: 'roles/' + data._id,
    method: 'put',
    data
  })
}

/*
* 批量操作数据
* */
export const batch = (ids = [], data = null) => {
  ids = cleanArray(ids)
  if (ids.length === 0) {
    return Promise.reject('ids不能为空')
  }
  const url = 'roles/batch/' + ids.join(',')
  return fetch({
    url,
    method: 'put',
    data
  })
}

/*
* 新增
* */
export const create = (data) => {
  const url = 'roles/'
  return fetch({
    url,
    method: 'post',
    data
  })
}
