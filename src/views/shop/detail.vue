<template>
  <el-dialog  :modal="false" :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-collapse v-model="collapseName">
      <el-collapse-item title="商家详情" name="1">
        <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='margin-left:50px'>
          <el-form-item label="商户名称"  prop="name">
            <el-input v-model="detail.name"></el-input>
          </el-form-item>
          <el-form-item label="商标">
            <template v-if="dialogStatus=='create' || checkPermission(permissionConstant.shop_u) && dialogStatus === 'update'">
              <upload
                :width="300"
                :height="200"
                :action="logo.action"
                @change="logo.change"
                @success="logo.uploadSuccess"
                @error="logo.uploadError"
                :headers="uploadHeaders()"
                :disabled="logo.loading">
                <el-button type="primary" :loading="logo.loading" style="margin-bottom: 10px;">上传缩略图</el-button>
              </upload>
            </template>
            <img :src="detail.logo" style="width: 80px;height: auto;border: 1px solid #bfcbd9" alt="">
          </el-form-item>
          <el-form-item label="缩略图">
            <template v-if="dialogStatus=='create' || checkPermission(permissionConstant.shop_u) && dialogStatus === 'update'">
              <upload
                :width="720"
                :height="320"
                :action="preImage.action"
                @change="preImage.change"
                @success="preImage.uploadSuccess"
                @error="preImage.uploadError"
                :headers="uploadHeaders()"
                :disabled="preImage.loading">
                <el-button type="primary" :loading="preImage.loading" style="margin-bottom: 10px;">上传缩略图</el-button>
              </upload>
            </template>
            <img :src="detail.preImage" style="width: 220px;height: auto;border: 1px solid #bfcbd9" alt="">
          </el-form-item>
          <el-form-item label="地址">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.address"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.introduction"></el-input>
          </el-form-item>
          <el-form-item label="优惠次数" prop="totalCashCouponNumber">
            <el-input v-model="detail.totalCashCouponNumber" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="优化价格" prop="totalCashCouponPrice">
            <el-input v-model="detail.totalCashCouponPrice"></el-input>
          </el-form-item>
          <el-form-item label="优先权重" prop="priority">
            <el-input v-model="detail.priority" type="number" min="0"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select class="filter-item" v-model="detail.hide" placeholder="状态">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商店类别">
            <span v-if ="detail.shopClassificationList.length === 0">未设置类别</span>
            <el-tooltip v-else v-for="cls in detail.shopClassificationList" :key="cls.id" :content="cls.description" placement="top">
              <el-tag type="success" :closable="dialogStatus=='create' || checkPermission(permissionConstant.shop_u) && dialogStatus=='update'"
                      :close-transition="false" @close="handleDelRelation(cls)">
                {{cls.name}}
              </el-tag>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="选择商店类别" v-if="dialogStatus=='create' || checkPermission(permissionConstant.shop_u) && dialogStatus === 'update'">
            <Classification :is-main="isMain" :shopClassifications="detail.shopClassificationList" @check="handleAddRelation"
                            @cancel-check="handleDelRelation"></Classification>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" style="text-align: right;">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
          <template v-if="checkPermission(permissionConstant.shopClassification_u) && dialogStatus === 'update'">
            <el-button type="primary" @click="update">确 定</el-button>
          </template>
        </div>
      </el-collapse-item>
      <template v-if="checkPermission(permissionConstant.shop_r) && dialogStatus !=='create'">
        <el-collapse-item title="商家帐号" name="2">
          <shop-account :shop-id="detail.id"></shop-account>
        </el-collapse-item>
      </template>
      <template v-if="checkPermission(permissionConstant.shop_r) && dialogStatus !== 'create'">
        <el-collapse-item title="商家图集" name="3">
          <shop-introduction-image :shop-id="detail.id"></shop-introduction-image>
        </el-collapse-item>
      </template>
      <template v-if="checkPermission(permissionConstant.cashCoupon_r) && dialogStatus !=='create'">
        <el-collapse-item title="商家代金券" name="4">
          <CashCoupon :shop-id="detail.id"></CashCoupon>
        </el-collapse-item>
      </template>
    </el-collapse>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  import Classification from '../classification/records.vue'
  import CashCoupon from '../cashCoupon/records.vue'
  import ShopIntroductionImage from '../shopIntroductionImage/records.vue'
  import ShopAccount from '../shopAccount/records.vue'
  import Upload from 'components/Upload'
  import UploadCallback from 'utils/uploadCb'
  export default {
    mixins: [new UploadCallback(() => {}, () => {})],
    components: {
      Classification,
      CashCoupon,
      ShopIntroductionImage,
      ShopAccount,
      Upload
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
            address: '',
            hide: 'true',
            id: '',
            introduction: '',
            logo: '',
            name: '',
            preImage: '',
            priority: 0,
            shopClassificationList: [],
            totalCashCouponNumber: 0,
            totalCashCouponPrice: 0
          }
        }
      }
    },
    data () {
      const me = this
      return {
        collapseName: [],
        isMain: false,
        textMap: {
          update: '编辑商家',
          create: '创建商家',
          info: '商家商家'
        },
        preImage: {
          action: process.env.BASE_API + '/mi/shopAction/uploadPreImage',
          loading: false,
          change () {
            me.preImage.loading = true
          },
          uploadSuccess (res) {
            me.uploadSuccess(res)
            if (res.status === 1) {
              me.detail.preImage = res.result
            }
            me.preImage.loading = false
          },
          uploadError (type, data) {
            me.uploadError(type, data)
            me.preImage.loading = false
          }
        },
        logo: {
          action: process.env.BASE_API + '/mi/shopAction/uploadLogo',
          loading: false,
          change () {
            me.logo.loading = true
          },
          uploadSuccess (res) {
            me.uploadSuccess(res)
            if (res.status === 1) {
              me.detail.logo = res.result
            }
            me.logo.loading = false
          },
          uploadError (type, data) {
            me.uploadError(type, data)
            me.logo.loading = false
          }
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '商户名称长度3到32位', trigger: 'blur' }
          ],
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优惠次数只能为数字'), trigger: 'blur' }
          ],
          totalCashCouponNumber: [
            { validator: Validate.validateNumber('优先权重只能为数字'), trigger: 'blur' }
          ],
          totalCashCouponPrice: [
            { validator: Validate.validateFloatNumber('优先权重只能为数字'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validate () {
        const me = this
        return new Promise((resolve, reject) => {
          this.$refs.detailForm.validate((valid) => {
            if (me.preImage.loading || me.logo.loading) {
              me.$message.warning('正在上传图片' + (me.preImage ? '缩略图' : 'logo') + '，请稍后提交')
              reject()
              return
            }
            if (valid) {
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      filterData (temp) {
        temp.shopClassificationIds = ((temp.shopClassificationList || []).map(role => {
          return role.id
        })).join(',')
        delete temp.shopClassificationList
        return temp
      },
      create() {
        const me = this
        me.validate().then(() => {
          const temp = Object.assign({}, me.detail)
          delete temp.id
          me.$store.dispatch('CreateShop', me.filterData(temp)).then(() => {
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
          delete temp.shopAccount
          me.$store.dispatch('UpdateShopDetail', me.filterData(temp)).then(() => {
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
      handleDelRelation ({ id }) {
        this.detail.shopClassificationList = this.detail.shopClassificationList.filter((cls) => {
          return cls.id !== id
        })
      },
      handleAddRelation (cls) {
        this.detail.shopClassificationList.push(cls)
      }
    },
    watch: {
      dialogFormVisible () {
        if (this.$refs.detailForm) {
          this.$refs.detailForm.resetFields()
          this.collapseName = []
          this.preImage.loading = false
          this.logo.loading = false
        }
      }
    }
  }
</script>
