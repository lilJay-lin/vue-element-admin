import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
const qs = require('qs')
import { removeToken } from '../utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000,                // 请求超时时间
  cache: false,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [function (data) {
    return data ? qs.stringify(data) : null
  }]
})
// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status === 1 || res.status === undefined) {
      return Promise.resolve(response)
    } else if (res.status === 2) {
      removeToken()
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
    } else { /* 0: 错误; 3: 无权限 */
      Message({
        message: res.message || res.msg,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(res)
    }
  },
  (error) => {
    console.log('err' + error)// for debug
    Message({
      message: error.response.data.msg || error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
