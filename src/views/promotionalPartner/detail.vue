<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="推广链接"  v-if="dialogStatus !=='create'">
        <span style="width: 220px;display: inline-block;word-break: break-all;;">{{serverRootPath}}?promotionalPartnerId={{detail.id}}</span>
      </el-form-item>
      <el-form-item label="用户数">
        <el-input v-model="detail.totalUser" disabled></el-input>
      </el-form-item>
      <el-form-item label="收益金额">
        <el-input v-model="detail.totalPrice" disabled></el-input>
      </el-form-item>
      <el-form-item label="已提现金额" prop="totalPay">
        <el-input v-model="detail.totalPay"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.description">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-if="checkPermission(permissionConstant.promotionalPartner_u) && dialogStatus === 'update'">
        <el-button type="primary" @click="update">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  export default {
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
      serverRootPath: {
        type: String,
        default: './'
      },
      detail: {
        type: Object,
        default () {
          return {
            id: '',
            name: '',
            description: '',
            totalUser: 0,
            totalPrice: 0,
            totalPay: 0
          }
        }
      }
    },
    data () {
      return {
        isMain: false,
        textMap: {
          update: '编辑合作伙伴',
          create: '创建合作伙伴',
          info: '合作伙伴'
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '分类名称长度3到32位', trigger: 'blur' }
          ],
          totalPay: [
            { validator: Validate.validateFloatNumber('已提现金额只能为数字'), trigger: 'blur' }
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
          me.$store.dispatch('CreatePromotionalPartner', temp).then(() => {
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
          me.$store.dispatch('UpdatePromotionalPartnerDetail', temp).then(() => {
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
