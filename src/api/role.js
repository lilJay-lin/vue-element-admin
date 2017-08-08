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
export const updateDetail = (data = { id: '' }) => {
  if (data.id === '') {
    return Promise.reject('id不能为空')
  }
  return fetch({
    url: 'roles/' + data.id,
    method: 'post',
    data
  })
}

/*
* 删除数据
* */
export const del = (ids = []) => {
  ids = cleanArray(ids)
  if (ids.length === 0) {
    return Promise.reject('ids不能为空')
  }
  const url = 'roles/' + (ids.length > 1 ? '/batch/' + ids.join(',') : ids[0]) + id
  return fetch({
    url,
    method: 'post',
    data
  })
}