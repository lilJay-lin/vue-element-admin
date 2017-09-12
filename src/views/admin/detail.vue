<template>
  <div>
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left"
             label-width="100px" style='margin-left:50px'>
      <el-form-item label="管理员名称" prop="name">
        <el-input :disabled="dialogStatus === 'info'" v-model="detail.name"></el-input>
      </el-form-item>
      <template v-if="dialogStatus === 'create'">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="detail.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="second_password">
          <el-input type="password" v-model="detail.second_password"></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="密码">
          <el-button type="primary" size="small" @click="showPass">修改密码</el-button>
        </el-form-item>
      </template>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="detail.mobile"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="filter-item" :disabled="dialogStatus === 'info'" v-model="detail.locked" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联角色">
        <span v-if ="detail.roleList.length === 0">无关联角色</span>
        <el-tooltip v-else v-for="role in detail.roleList" :key="role.id" :content="role.description" placement="top">
          <el-tag type="success" :closable="checkPermission(permissionConstant.admin_u)"
                  :close-transition="false" @close="handleDelRelation(role)">
            {{role.name}}
          </el-tag>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择关联角色" v-if="checkPermission(permissionConstant.admin_u) && dialogStatus !== 'info'">
        <Permissions :is-main="isMain" :roles="detail.roleList" @check="handleAddRelation"
                     @cancel-check="handleDelRelation"></Permissions>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" style="text-align: right;">
      <el-button @click="cancel" v-if="cancelVisible">取 消</el-button>
      <el-button v-if="dialogStatus === 'create'" type="primary" @click="create">确 定</el-button>
      <template v-if="dialogStatus === 'update' && checkPermission(permissionConstant.admin_u)">
        <el-button type="primary" @click="update">确 定</el-button>
      </template>
      <template v-if="dialogStatus === 'info'">
        <el-button type="primary" @click="updateSelf">确 定</el-button>
      </template>
    </div>
    <el-dialog :modal="false" title="修改密码" :visible="passVisible" :before-close="closePass" size="tiny">
      <el-form class="small-space" :model="pass" :rules="passRules" ref="passForm" label-position="left" label-width="100px">
        <el-form-item label="密码" prop="val1" style="margin-bottom: 30px;">
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
  import Upload from 'components/ImageUpload2'
  import * as Validate from '../../utils/validate'
  export default {
    components: {
      Permissions,
      Upload
    },
    props: {
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
            id: '',
            name: '',
            mobile: '',
            password: '',
            second_password: '',
            locked: false,
            permissionList: [],
            roleList: []
          }
        }
      }
    },
    data () {
      const NAME_MESSAGE = '管理员名称开头必须是字母或下划线，其它为数字、字母和下划线组成'
      const validateLoginName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('管理员名称不能为空'))
        } else if (value.length < 3 || value.length > 32) {
          callback(new Error('管理员名称长度3到32位'))
        } else if (!/^[a-zA-Z_][a-zA-Z0-9_]{3,31}$/.test(value)) {
          callback(new Error(NAME_MESSAGE));
        } else {
          callback();
        }
      }
      const validatePass = (form, data, key) => {
        return (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'))
          } else if (value.length < 6 || value.length > 32) {
            callback(new Error('密码长度6到32位'))
          } else if (!/^[a-zA-Z0-9!@#\\$%\\^&\\*\\(\\)]{6,32}$/.test(value)) {
            callback(new Error('密码只能由大小写字母、数字和特殊字符(!@#$%^&*())组成'));
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
          } else if (value.length < 6 || value.length > 32) {
            callback(new Error('密码长度6到32位'))
          } else if (!/^[a-zA-Z0-9!@#\\$%\\^&\\*\\(\\)]{6,32}$/.test(value)) {
            callback(new Error('密码只能由大小写字母、数字和特殊字符(!@#$%^&*())组成'));
          } else {
            callback()
          }
        }
      }
      return {
        publicKey: '',
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
          name: [
            { validator: validateLoginName, trigger: 'blur' }
          ],
          mobile: [
            { required: false, validator: Validate.validateMobile, message: '手机号码不合法', trigger: 'blur' }
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
      encryptPass (password) {
        const me = this
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(me.publicKey)
        return encrypt.encrypt(password)
      },
      filterData (temp) {
        temp.roleIds = ((temp.roleList || []).map(role => {
          return role.id
        })).join(',')
        temp.password = this.encryptPass(temp.password)
        delete temp.second_password
        delete temp.permissionList
        delete temp.roleList
        return temp
      },
      create() {
        const me = this
        me.validate('detailForm').then(() => {
          let temp = Object.assign({}, me.detail)
          delete temp.id
          temp = me.filterData(temp)
          me.$store.dispatch('CreateUser', temp).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submit')
          }, () => {})
        }, () => {
        })
      },
      update() {
        const me = this
        me.validate('detailForm').then(() => {
          let temp = Object.assign({}, me.detail)
          temp = me.filterData(temp)
          me.$store.dispatch('UpdateUserDetail', temp).then(() => {
            me.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submit')
          }, () => {})
        }, () => {
        })
      },
      updateSelf() {
        const me = this
        me.validate('detailForm').then(() => {
          let temp = Object.assign({}, me.detail)
          temp = me.filterData(temp)
          delete temp.name
          delete temp.locked
          delete temp.roleIds
          me.$store.dispatch('UpdateSelf', temp).then(() => {
            me.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submit')
          }, () => {})
        }, () => {
        })
      },
      cancel () {
        this.$emit('cancel')
      },
      handleDelRelation ({ id }) {
        this.detail.roleList = this.detail.roleList.filter((role) => {
          return role.id !== id
        })
      },
      handleAddRelation (role) {
        this.detail.roleList.push(role)
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
        this.detail.password = this.pass.val1
        this.closePass()
      },
      initCaptcha () {
        const me = this
        me.$store.dispatch('GetPublicKey').then((key) => {
          me.publicKey = key
        })
      }
    },
    created() {
      this.initCaptcha()
    },
    watch: {
      $route () {
        this.captchaObj = null
        this.initCaptcha()
      },
      dialogFormVisible () {
        if (this.$refs.detailForm) {
          this.$refs.detailForm.resetFields()
        }
      }
    }
  }
</script>
