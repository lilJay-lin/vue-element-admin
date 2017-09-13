<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="代金券名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <upload
          :action="preImage.action"
          @change="preImage.change"
          @success="uploadSuccess"
          @error="uploadError"
          :headers="uploadHeaders()"
          :disabled="preImage.loading">
          <el-button type="primary" :loading="preImage.loading" style="margin-bottom: 10px;">上传缩略图</el-button>
        </upload>
        <img :src="detail.preImage" style="width: 200px;height: auto;border: 1px solid #bfcbd9" alt="">
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="detail.price" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="优惠金额" prop="discountAmount">
        <el-input v-model="detail.discountAmount" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="过期时间">
        <el-date-picker v-model="detail.expiryDate" :clearable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="detail.priority" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="是否过期">
        <el-select class="filter-item"  v-model="detail.expired" placeholder="状态">
          <el-option v-for="item in expireOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="filter-item"  v-model="detail.hide" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-else>
        <el-button type="primary" v-if="checkPermission(permissionConstant.cashCoupon_u)" @click="update">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import Upload from 'components/Upload'
  import UploadCallback from 'utils/uploadCb'
  import * as Validate from 'utils/validate'
  import { parseTime } from 'utils/index'
  export default {
    components: {
      Upload
    },
    mixins: [new UploadCallback(function (data) {
      if (data.status === 1) {
        this.detail.preImage = data.result
      }
      this.preImage.loading = false
    }, function () {
      this.preImage.loading = false
    })],
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
            shopId: '',
            name: '',
            preImage: '',
            price: 0,
            discountAmount: 0,
            expiryDate: '',
            expired: 'false',
            hide: 'false',
            priority: 0
          }
        }
      }
    },
    data () {
      const me = this
      return {
        expireOptions: [{ label: '否', key: 'false' }, { label: '是', key: 'true' }],
        preImage: {
          action: process.env.BASE_API + '/mi/cashCouponAction/uploadImage',
          loading: false,
          change () {
            me.preImage.loading = true
          }
        },
        isMain: false,
        showUpload: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '代金券名称长度3到32位', trigger: 'blur' }
          ],
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优先级只能为数字'), trigger: 'blur' }
          ],
          price: [
            { validator: Validate.validateNumber('价格只能为数字'), trigger: 'blur' }
          ],
          discountAmount: [
            { validator: Validate.validateNumber('优惠金额只能为数字'), trigger: 'blur' }
          ],
          expireDate: [
            { require: true, message: '过期时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validate () {
        const me = this
        return new Promise((resolve, reject) => {
          if (me.preImage.loading) {
            me.$message.warning('正在上传图片缩略图，请稍后提交')
            reject()
            return
          }
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
          temp.expiryDate = parseTime(temp.expiryDate)
          me.$store.dispatch('CreateCashCoupon', temp).then(() => {
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
          temp.expiryDate = parseTime(temp.expiryDate)
          me.$store.dispatch('UpdateCashCouponDetail', temp).then(() => {
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
          this.preImage.loading = false
        }
      }
    }
  }
</script>
