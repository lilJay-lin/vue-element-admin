<template>
  <el-dialog :modal-append-to-body="false" :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="图片">
        <template v-if="dialogStatus=='create' || checkPermission(permissionConstant.shop_u) && dialogStatus=='update'">
          <upload
            :action="contentUrl.action"
            @change="contentUrl.change"
            @success="uploadSuccess"
            @error="uploadError"
            :headers="uploadHeaders()"
            :disabled="contentUrl.loading">
            <el-button type="primary" :loading="contentUrl.loading" style="margin-bottom: 10px;">上传图片</el-button>
          </upload>
        </template>
        <img :src="detail.contentUrl" style="width: 200px;height: auto;border: 1px solid #bfcbd9" alt="">
      </el-form-item>
      <el-form-item label="优先权重" prop="priority">
        <el-input v-model="detail.priority" type="number" min="0"></el-input>
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
      <template v-if="dialogStatus=='update' && checkPermission(permissionConstant.shop_u)">
        <el-button type="primary" @click="update">确 定</el-button>
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
        this.detail.contentUrl = data.result
      }
      this.contentUrl.loading = false
    }, function () {
      this.contentUrl.loading = false
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
            contentUrl: '',
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
        contentUrl: {
          action: process.env.BASE_API + '/mi/cashCouponAction/uploadImage',
          loading: false,
          change () {
            me.contentUrl.loading = true
          }
        },
        isMain: false,
        showUpload: false,
        textMap: {
          update: '编辑商家简介图片',
          create: '创建商家简介图片',
          info: '商家简介图片'
        },
        detailRules: {
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优先权重只能为数字'), trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      validate () {
        const me = this
        return new Promise((resolve, reject) => {
          if (me.contentUrl.loading) {
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
          me.$store.dispatch('CreateShopIntroductionImage', temp).then(() => {
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
          me.$store.dispatch('UpdateShopIntroductionImageDetail', temp).then(() => {
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
          this.contentUrl.loading = false
        }
      }
    }
  }
</script>
