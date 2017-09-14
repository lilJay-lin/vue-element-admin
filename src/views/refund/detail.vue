<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="编码" >
        <el-input v-model="detail.number" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="支付订单编码">
        <el-input v-model="detail.payOrderNumber" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="累计退款金额" prop="refundAmount">
        <el-input v-model="detail.refundAmount"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="detail.price"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="filter-item"  v-model="detail.status" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-else>
        <el-button type="primary" v-if="checkPermission(permissionConstant.refund_u)" @click="update">确 定</el-button>
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
      detail: {
        type: Object,
        default () {
          return {
            cashCouponOrderId: '',
            comment: '',
            evidence: '',
            id: '',
            reason: '',
            refundAmount: '',
            status: ''
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
          refundAmount: [
            { validator: Validate.validateFloatNumber('累计退款金额只能为数字'), trigger: 'blur' }
          ],
          price: [
            { validator: Validate.validateFloatNumber('价格只能为数字'), trigger: 'blur' }
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
          me.$store.dispatch('CreateRefund', temp).then(() => {
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
          me.$store.dispatch('UpdateRefundDetail', temp).then(() => {
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
