/**
 * Created by liljay on 2017/9/12.
 */
export default class UploadCallback {
  constructor (resolve, reject) {
    return {
      methods: {
        /*
         *  图片上传
         * */
        uploadSuccess (res) {
          const me = this
          if (res.status === 2) {
            me.$messageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              me.$store.dispatch('FedLogOut').then(() => {
                location.reload()// 为了重新实例化vue-router对象 避免bug
              })
            })
          } else if (res.status !== 1) { /* 0: 错误; 3: 无权限 */
            me.$message({
              message: res.message || res.msg,
              type: 'error',
              duration: 2 * 1000
            })
          }
          resolve.call(me, res)
        },
        // 错误
        uploadError (type) {
          const me = this
          if (type === 'limit') {
            me.$message({
              message: '图片大小不能超过20M',
              type: 'error'
            })
          }
          // 没有选择文件
          if (type === 'empty') {
            me.$message({
              message: '请选择图片',
              type: 'warning'
            })
          }
          // 服务器报错
          if (type === 'server') {
            me.$message({
              message: '服务器错误，请联系管理员处理',
              type: 'error'
            })
          }
          reject.call(me, type)
        }
      }
    }
  }
}
