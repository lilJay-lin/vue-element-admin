<template>
  <div>
    <div class="modal" v-if="dialogFormVisible"></div>
    <el-dialog  :modal="false" :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
      <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
        <el-form-item label="编码" >
          <el-input v-model="detail.cashCouponOrder.number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发起订单用户" >
          <span class="link-type" @click="toggleUser(true)">查看</span>
        </el-form-item>
        <el-form-item label="关联代金券" >
          <span class="link-type" @click="toggleCashCoupon(true)">查看</span>
        </el-form-item>
        <el-form-item label="支付订单编码">
          <el-input v-model="detail.cashCouponOrder.payOrderNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="累计退款金额" prop="refundAmount">
          <el-input v-model="detail.cashCouponOrder.refundAmount"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="detail.cashCouponOrder.price"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="filter-item"  v-model="detail.cashCouponOrder.status" placeholder="状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <template v-if="checkPermission(permissionConstant.cashCouponOrder_u) && dialogStatus === 'update'">
          <el-button type="primary" @click="update">确 定</el-button>
        </template>
      </div>
      <Register-Detail  :title="'浏览'" :before-close="toggleUser" @cancel="toggleUser" :dialog-status="'info'" :detail="detail.user" :dialog-form-visible="userVisible" ></Register-Detail>
      <CashCoupon-Detail  :title="'浏览'" :before-close="toggleCashCoupon" @cancel="toggleCashCoupon" :dialog-status="'info'" :detail="detail.cashCoupon" :dialog-form-visible="cashCouponVisible" ></CashCoupon-Detail>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  import RegisterDetail from '../register/detail.vue'
  import CashCouponDetail from '../cashCoupon/detail.vue'
  export default {
    components: {
      CashCouponDetail,
      RegisterDetail
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
            cashCoupon: {
              id: '',
              shopId: '',
              name: '',
              preImage: '',
              discountAmount: 0,
              expiryDate: '',
              expired: 'false',
              hide: 'false',
              priority: 0
            },
            cashCouponOrder: {
              id: '',
              number: '',
              payOrderNumber: '',
              price: '',
              refundAmount: 0,
              status: 0,
              userId: ''
            },
            user: {
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
      }
    },
    data () {
      return {
        userVisible: false,
        cashCouponVisible: false,
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
          const temp = Object.assign({}, me.detail.cashCouponOrder)
          delete temp.id
          me.$store.dispatch('CreateCashCouponOrder', temp).then(() => {
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
          const temp = Object.assign({}, me.detail.cashCouponOrder)
          delete temp.cashCoupon
          me.$store.dispatch('UpdateCashCouponOrderDetail', temp).then(() => {
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
      toggleCashCoupon (status) {
        if (status === undefined) {
          status = false
        }
        this.cashCouponVisible = status
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
