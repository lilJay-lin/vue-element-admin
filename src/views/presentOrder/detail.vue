<template>
  <div>
    <div class="modal" v-if="dialogFormVisible"></div>
    <el-dialog  :modal="false"  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" :size="dialogStatus === 'create' ? 'full' : 'small'">
      <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='margin:0 50px'>
        <el-form-item label="关联用户" v-if="dialogStatus === 'update'">
          <span class="link-type" @click="toggleUser(true)">{{detail.user.mobile}}</span>
        </el-form-item>
        <template v-if="checkPermission(permissionConstant.present_u) && dialogStatus === 'create'">
          <el-form-item label="关联用户" prop="mobile">
            <span>{{detail.user.mobile}}</span>
          </el-form-item>
          <el-form-item label="选择关联用户">
            <Register-Record :is-main="isMain" :registers="detail.user.id === '' ? [] : [{id: detail.user.id}]" @check="handleAddUser"
                             @cancel-check="handleDelUser"></Register-Record>
          </el-form-item>
        </template>
        <el-form-item label="礼品" v-if="dialogStatus === 'update'">
          <!--<span class="link-type" @click="togglePresent(true)">{{detail.present.name}}</span>-->
          <img style="width: 220px;cursor: pointer;" @click="togglePresent(true)" :src="detail.present.image"/>
        </el-form-item>
        <template v-if="checkPermission(permissionConstant.present_u) && dialogStatus === 'create'">
          <el-form-item label="关联礼品" prop="presentName">
            <span>{{detail.present.name}}</span>
          </el-form-item>
          <el-form-item label="选择关联礼品">
            <Present-Record :is-main="isMain" :presents="detail.present.id === '' ? [] : [{id: detail.present.id}]" @check="handleAddPresent"
                             @cancel-check="handleDelPresent"></Present-Record>
          </el-form-item>
        </template>
        <el-form-item label="编码">
          <el-input v-model="detail.presentOrder.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="filter-item"  v-model="detail.presentOrder.status" placeholder="状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <template v-if="dialogStatus=='update' && checkPermission(permissionConstant.presentOrder_u)">
          <el-button type="primary" @click="update">确 定</el-button>
        </template>
      </div>
      <Register-Detail  :title="'浏览'" :before-close="toggleUser" @cancel="toggleUser" :dialog-status="'info'" :detail="detail.user" :dialog-form-visible="userVisible" ></Register-Detail>
      <Present-Detail  :title="'浏览'" :before-close="togglePresent" @cancel="togglePresent" :dialog-status="'info'" :detail="detail.present" :dialog-form-visible="presentVisible" ></Present-Detail>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  import PresentDetail from '../present/detail.vue'
  import PresentRecord from '../present/records.vue'
  import RegisterDetail from '../register/detail.vue'
  import RegisterRecord from '../register/records.vue'
  export default {
    components: {
      PresentDetail,
      RegisterDetail,
      PresentRecord,
      RegisterRecord
    },
    props: {
      dialogStatus: {
        type: String,
        default: 'create'
      },
      statusOptions: {
        type: Array,
        default () {
          return []
        }
      },
      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default () {
          return {
            present: {
              id: '',
              name: '',
              image: '',
              address: '',
              stock: '',
              requirement: '',
              weight: 0,
              expiryDate: '',
              hide: ''
            },
            presentOrder: {
              id: '',
              presentId: '',
              userId: '',
              number: '',
              status: ''
            }
          }
        }
      }
    },
    data () {
      return {
        userVisible: false,
        presentVisible: false,
        isMain: false,
        textMap: {
          update: '编辑奖品订单',
          create: '创建奖品订单',
          info: '奖品订单'
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '分类名称长度3到32位', trigger: 'blur' }
          ],
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优先权重只能为数字'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validate () {
        return new Promise((resolve, reject) => {
          this.$refs.detailForm.validate((valid) => {
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
        me.validate().then(() => {
          const temp = Object.assign({}, me.detail.presentOrder)
          delete temp.id
          temp.userId = me.detail.user.id
          temp.presentId = me.detail.present.id
          me.$store.dispatch('CreatePresentOrder', temp).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submit')
          }, () => {})
        }, () => {})
      },
      update() {
        const me = this
        me.validate().then(() => {
          const temp = Object.assign({}, me.detail.presentOrder)
          me.$store.dispatch('UpdatePresentOrderDetail', temp).then(() => {
            me.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.$emit('submit')
          }, () => {})
        }, () => {})
      },
      cancel () {
        this.$emit('cancel')
      },
      toggleUser (status) {
        if (status === undefined) {
          status = false
        }
        this.userVisible = status
      },
      togglePresent (status) {
        if (status === undefined) {
          status = false
        }
        this.presentVisible = status
      },
      handleDelUser () {
        this.detail.user.id = ''
        this.detail.user.name = ''
      },
      handleAddUser ({ id, mobile }) {
        this.detail.user.id = id
        this.detail.user.mobile = mobile
      },
      handleDelPresent () {
        this.detail.present.id = ''
        this.detail.present.name = ''
      },
      handleAddPresent ({ id, name }) {
        this.detail.present.id = id
        this.detail.present.name = name
      }
    },
    watch: {
      dialogFormVisible () {
        if (this.$refs.detailForm) {
          this.$refs.detailForm.resetFields()
          this.userVisible = false
          this.presentVisible = false
          this.detail.user.id = ''
          this.detail.user.mobile = ''
          this.detail.present.id = ''
          this.detail.present.name = ''
        }
      }
    }
  }
</script>
