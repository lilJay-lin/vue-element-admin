<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="手机号码"  prop="mobile">
        <el-input v-model="detail.mobile"></el-input>
      </el-form-item>
      <el-form-item label="抽奖次数">
        <el-input type="number" min="0" v-model="detail.presentChance"></el-input>
      </el-form-item>
      <el-form-item label="是否分享">
        <el-tooltip :content="detail.shared ? '是' : '否'" placement="top">
          <el-switch v-model="detail.shared" on-color="#13ce66" off-color="#ff4949"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="filter-item" v-model="detail.locked" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-else>
        <el-button type="primary" v-if="checkPermission(permissionConstant.role_u)" @click="update">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import Permissions from '../permission/records.vue'
  import * as Validate from '../../utils/validate'
  export default {
    components: {
      Permissions
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
            id: '',
            name: '',
            mobile: '',
            locked: 'false',
            presentChance: 0,
            promotionalPartnerId: '',
            shared: false
          }
        }
      }
    },
    data () {
      return {
        isMain: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        detailRules: {
          mobile: [
            { required: true, validator: Validate.validateMobile, message: '手机号码不合法', trigger: 'blur' }
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
          const temp = Object.assign({}, me.detail)
          delete temp.id
          me.$store.dispatch('CreateRegister', temp).then(() => {
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
          const temp = Object.assign({}, me.detail)
          me.$store.dispatch('UpdateRegisterDetail', temp).then(() => {
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
