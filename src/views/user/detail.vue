<template>
  <div>
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left"
             label-width="100px" style='margin-left:50px' :style="{width: width + 'px'}">
      <el-form-item label="头像">
        <pan-thumb :image='detail.avatar'></pan-thumb>
        <el-button type="primary" icon="upload" style="position: absolute;bottom: 15px;margin-left: 40px"
                   @click="toggleShow">修改头像
        </el-button>
      </el-form-item>
      <el-form-item label="登录名称" prop="loginName">
        <el-input v-model="detail.loginName"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="userName">
        <el-input v-model="detail.userName"></el-input>
      </el-form-item>
      <template v-if="dialogStatus === 'create'">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="detail.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="second_password">
          <el-input type="password" v-model="detail.second_password"></el-input>
        </el-form-item>
      </template>
      <template v-if="dialogStatus === 'update'">
        <el-form-item label="密码">
          <el-button type="primary" size="small" @click="showPass">修改密码</el-button>
        </el-form-item>
      </template>
      <el-form-item label="状态">
        <el-select class="filter-item" v-model="detail.status" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="detail.email"></el-input>
      </el-form-item>
      <el-form-item label="签名档">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"
                  v-model="detail.introduction">
        </el-input>
      </el-form-item>
      <el-form-item label="关联权限">
        <el-tooltip v-for="role in detail.roles" :key="role._id" :content="role.description" placement="top">
          <el-tag type="success" :closable="true"
                  :close-transition="false" @close="handleDelRelation(role)">
            {{role.name}}
          </el-tag>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择关联权限">
        <Permissions :is-main="isMain" :roles="detail.roles" @check="handleAddRelation"
                     @cancel-check="handleDelRelation"></Permissions>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="text-align: right;">
      <el-button @click="cancel" v-if="cancelVisible">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <el-button v-else type="primary" @click="update">确 定</el-button>
    </div>
    <Upload :headers="headers" :width="300" :height="300" url="/api/upload" @input='toggleShow' :value.sync="showUpload"
            img-format="jpg"
            @crop-success="cropSuccess"
            @crop-upload-success="cropUploadSuccess"
            @crop-upload-fail="cropUploadFail"></Upload>
    <el-dialog title="修改密码" :visible="passVisible" :before-close="closePass" size="tiny">
      <el-form class="small-space" :model="pass" :rules="passRules" ref="passForm" label-position="left" label-width="100px" style='width: 290px;'>
        <el-form-item label="密码" prop="val1">
          <el-input type="password" v-model="pass.val1"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="val2">
          <el-input type="password" v-model="pass.val2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePass">取 消</el-button>
        <el-button type="primary" @click="updatePass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import Permissions from '../role/records.vue'
  import PanThumb from 'components/PanThumb'
  import Upload from 'components/ImageUpload2'
  export default {
    components: {
      Permissions,
      PanThumb,
      Upload
    },
    props: {
      width: {
        type: String,
        default: '900'
      },
      cancelVisible: {
        type: Boolean,
        default: true
      },
      dialogStatus: {
        type: String,
        default: 'create'
      },
      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      statusOptions: {
        type: Array,
        default () {
          return []
        }
      },
      detail: {
        type: Object,
        default () {
          return {
            _id: '',
            userName: '',
            loginName: '',
            password: '',
            second_password: '',
            email: '',
            status: '1',
            avatar: '',
            introduction: '',
            roles: [],
            createdAt: '',
            updatedAt: ''
          }
        }
      }
    },
    computed: {
      headers () {
        return {
          'x-access-token': this.$store.getters['token']
        }
      }
    },
    data () {
      const NAME_MESSAGE = '登录名只能为数字、字母和下划线组成，长度6到20位'
      const validateLoginName = (rule, value, callback) => {
        if (!/^[0-9_a-zA-Z]{6,20}$/.test(value)) {
          callback(new Error(NAME_MESSAGE))
        } else {
          callback()
        }
      }
      const validatePass = (form, data, key) => {
        return (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'))
          } else if (value.length < 6) {
            callback(new Error('密码不能小于6位'))
          } else {
            if (this[data][key] !== '') {
              this.$refs[form].validateField(key);
            }
            callback()
          }
        }
      }
      const validateSecondPass = (data, key) => {
        return (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'))
          } else if (value !== this[data][key]) {
            callback(new Error('两次输入密码不一致'))
          } else if (value.length < 6) {
            callback(new Error('密码不能小于6位'))
          } else {
            callback()
          }
        }
      }
      return {
        passVisible: false,
        isMain: false,
        pass: {
          val1: '',
          val2: ''
        },
        passRules: {
          val1: [
            { required: true, validator: validatePass('passForm', 'pass', 'val2'), trigger: 'blur' }
          ],
          val2: [
            { required: true, validator: validateSecondPass('pass', 'val1'), trigger: 'blur' }
          ]
        },
        detailRules: {
          loginName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
            { validator: validateLoginName, trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '昵称不能为空', trigger: 'blur' },
            { min: 2, max: 10, message: '昵称长度2到10位', trigger: 'blur' }
          ],
          email: [
            { required: false, type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          password: [
            { required: true, validator: validatePass('detailForm', 'detail', 'second_password'), trigger: 'blur' }
          ],
          second_password: [
            { required: true, validator: validateSecondPass('detail', 'password'), trigger: 'blur' }
          ]
        },
        showUpload: false
      }
    },
    methods: {
      validate (form) {
        return new Promise((resolve, reject) => {
          this.$refs[form].validate((valid) => {
            if (valid) {
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      create() {
        const me = this
        me.validate('detailForm').then(() => {
          const temp = Object.assign({}, me.detail)
          delete temp._id
          delete temp.second_password
          me.$store.dispatch('CreateUser', temp).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }, () => {})
        }, () => {
        })
      },
      update() {
        const me = this
        me.validate('detailForm').then(() => {
          me.$store.dispatch('UpdateUserDetail', me.detail).then(() => {
            me.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }, () => {})
        }, () => {
        })
      },
      cancel () {
        this.$emit('cancel')
      },
      handleDelRelation ({ _id }) {
        this.detail.roles = this.detail.roles.filter((role) => {
          return role._id !== _id
        })
      },
      handleAddRelation (role) {
        this.detail.roles.push(role)
      },
      /*
       *  图片上传
       * */
      toggleShow () {
        this.showUpload = !this.showUpload
      },
      cropSuccess(imgDataUrl) {
        this.detail.avatar = imgDataUrl
      },
      cropUploadSuccess(jsonData) {
        /* TODO 删除api*/
        this.detail.avatar = 'http://localhost' + jsonData.avatar
      },
      cropUploadFail({ status }) {
        if (status === 4) {
          this.$msgbox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('FedLogOut').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          })
        }
      },
      showPass() {
        this.passVisible = true
        if (this.$refs.passForm) {
          this.$refs.passForm.resetFields()
        }
      },
      closePass () {
        this.passVisible = false
        if (this.$refs.passForm) {
          this.$refs.passForm.resetFields()
        }
      },
      updatePass () {
        this.validate('passForm').then(() => {
          this.$store.dispatch('UpdatePass', { password: this.pass.val1 }).then(() => {
            this.$notify({
              title: '成功',
              message: '密码修改成功',
              type: 'success',
              duration: 2000
            })
            this.closePass()
          })
        }, () => {})
      }
    },
    watch: {
      dialogFormVisible () {
        if (this.$refs.detailForm) {
          this.$refs.detailForm.resetFields()
        }
      }
    }
  }
</script>
