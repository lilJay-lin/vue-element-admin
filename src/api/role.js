/**
 * Created by linxiaojie on 2017/8/8.
 */
import fetch from '../utils/fetch_new'
import { cleanArray } from '../utils'

const base = '/mi/role'
/*
 * 获取列表
 * */
export const getAll = (query) => {
  return fetch({
    url: base,
    method: 'get',
    params: query
  })
}

/*
 * 查询详情
 * */
export const getDetail = (id) => {
  return fetch({
    url: base + '/' + id,
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
    url: base + '/' + data.id,
    method: 'patch',
    data
  })
}

/*
 * 批量操作数据
 * */
export const batch = (ids = []) => {
  ids = cleanArray(ids)
  if (ids.length === 0) {
    return Promise.reject('ids不能为空')
  }
  return fetch({
    url: base + '?ids=' + ids.join(','),
    method: 'delete'
  })
}

/*
 * 新增
 * */
export const create = (data) => {
  return fetch({
    url: base,
    method: 'post',
    data
  })
}

