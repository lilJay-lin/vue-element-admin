<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="广告名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="广告图片">
        <template v-if="dialogStatus=='create' || checkPermission(permissionConstant.advertisement_u) && dialogStatus === 'update'">
          <upload
            :width="720"
            :height="320"
            :action="image.action"
            @change="image.change"
            @success="uploadSuccess"
            @error="uploadError"
            :headers="uploadHeaders()"
            :disabled="image.loading">
            <el-button type="primary" :loading="image.loading" style="margin-bottom: 10px;display:block;">上传缩略图</el-button>
          </upload>
        </template>
        <img :src="detail.image" style="width: 220px;height: auto;border: 1px solid #bfcbd9" alt="">
      </el-form-item>
      <el-form-item label="广告链接" prop="link">
        <el-input v-model="detail.link" :maxlength="200"></el-input>
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
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述内容" v-model="detail.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-if="dialogStatus=='update' && checkPermission(permissionConstant.advertisement_u)">
        <el-button type="primary" @click="update">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import Upload from 'components/Upload'
  import UploadCallback from 'utils/uploadCb'
  import * as Validate from 'utils/validate'
  export default {
    components: {
      Upload
    },
    mixins: [new UploadCallback(function (data) {
      if (data.status === 1) {
        this.detail.image = data.result
      }
      this.image.loading = false
    }, function () {
      this.image.loading = false
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
            image: '',
            name: '',
            description: '',
            hide: 'false',
            priority: 0,
            link: ''
          }
        }
      }
    },
    data () {
      const me = this
      return {
        isMain: false,
        image: {
          action: process.env.BASE_API + '/mi/advertisementAction/uploadImage',
          loading: false,
          change () {
            me.image.loading = true
          }
        },
        textMap: {
          update: '编辑广告',
          create: '创建广告',
          info: '广告'
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '分类名称长度3到32位', trigger: 'blur' }
          ],
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优先权重只能为数字'), trigger: 'blur' }
          ],
          link: [
            { type: 'url', message: '广告链接格式错误' }
          ]
        }
      }
    },
    methods: {
      validate () {
        const me = this
        return new Promise((resolve, reject) => {
          if (me.image.loading) {
            me.$message.warning('正在上传图片缩略图，请稍后提交')
            reject()
            return
          }
          if (me.detail.image === null || me.detail.image === '') {
            me.$message.error('图片不能为空')
            reject()
            return
          }
          me.$refs.detailForm.validate((valid) => {
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
          me.$store.dispatch('CreateAdvertisement', temp).then(() => {
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
          me.$store.dispatch('UpdateAdvertisementDetail', temp).then(() => {
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
