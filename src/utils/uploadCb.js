/**
 * Created by liljay on 2017/9/12.
 */
export default class UploadCallback {
  constructor (resolve, reject) {
    return {
      methods: {
        /*
        * 统一header
        * */
        uploadHeaders () {
          return {}
        },
        /*
         *  图片上传
         * */
        uploadSuccess (res) {
          const me = this
          if (res.status === 2) {
            me.$store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
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
        uploadError (type, data) {
          const me = this
          // 图片大小不对
          if (type === 'size') {
            me.$message({
              message: '图片像素宽高尺寸必须为' + data.width + '*' + data.height,
              type: 'error'
            })
          }
          if (type === 'type') {
            me.$message({
              message: '只能上传图片',
              type: 'error'
            })
          }
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
