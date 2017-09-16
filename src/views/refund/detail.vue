<template>
  <div>
    <div class="modal" v-show="dialogFormVisible"></div>
    <el-dialog  :modal="false" :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
      <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="130px" style='width: 320px;margin-left:50px'>
        <el-form-item label="代金券订单信息" >
          <span class="link-type" title="显示代金券订单信息" @click="showCashCouponOrder()">查看</span>
        </el-form-item>
        <el-form-item label="退款代金券信息" >
          <span  class="link-type" title="显示退款代金券信息" @click="showCashCoupon()">查看</span>
        </el-form-item>
        <el-form-item label="退款金额">
          <el-input v-model="detail.refund.refundAmount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="退款理由">
          <el-input v-model="detail.refund.reason" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="平台意见">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.refund.comment"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select class="filter-item"  v-model="detail.refund.status" placeholder="状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
        <template v-if="checkPermission(permissionConstant.refund_u) && dialogStatus === 'update'">
          <el-button type="primary" @click="update">确 定</el-button>
        </template>
      </div>
      <CashCouponOrder-Detail :dialog-status="'info'" @cancel="cancelCashCouponOrder()" :detail="cashCouponOrder" :status-options="statusOptions" :dialog-form-visible="cashCouponOrderVisible" ></CashCouponOrder-Detail>
      <CashCoupon-Detail :dialog-status="'info'" @cancel="cancelCashCoupon()" :detail="detail.cashCoupon" :status-options="statusOptions" :dialog-form-visible="cashCouponVisible" ></CashCoupon-Detail>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  import CashCouponOrderDetail from '../cashCouponOrder/detail.vue'
  import CashCouponDetail from '../cashCoupon/detail.vue'
  export default {
    components: {
      CashCouponOrderDetail,
      CashCouponDetail
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
            refund: {
              cashCouponOrderId: '',
              comment: '',
              evidence: '',
              id: '',
              reason: '',
              refundAmount: '',
              status: 0
            },
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
            }
          }
        }
      }
    },
    data () {
      return {
        cashCouponOrder: {
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
        },
        cashCouponVisible: false,
        cashCouponOrderVisible: false,
        collapseName: [],
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
          const temp = Object.assign({}, me.detail.refund)
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
          const temp = Object.assign({}, me.detail.refund)
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
      },
      showCashCoupon () {
        this.cashCouponVisible = true
      },
      cancelCashCoupon () {
        this.cashCouponVisible = false
      },
      showCashCouponOrder () {
        this.cashCouponOrderVisible = true
      },
      cancelCashCouponOrder () {
        this.cashCouponOrderVisible = false
      }
    },
    watch: {
      dialogFormVisible () {
        if (this.$refs.detailForm) {
          this.$refs.detailForm.resetFields()
          this.collapseName = []
        }
      },
      'detail.cashCouponOrder.id' (val) {
        if (val) {
          this.$store.dispatch('GetCashCouponOrderDetail', this.detail.cashCouponOrder.id).then((detail) => {
            detail.cashCoupon.expired = String(detail.cashCoupon.expired)
            detail.cashCoupon.hide = String(detail.cashCoupon.hide)
            detail.user.locked = String(detail.user.locked)
            this.cashCouponOrder = detail
          })
        }
      }
    }
  }
</script>
