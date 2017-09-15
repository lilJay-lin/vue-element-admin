<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="分类名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <template v-if="checkPermission(permissionConstant.present_u) && dialogStatus !== 'info'">
          <upload
            :action="image.action"
            @change="image.change"
            @success="uploadSuccess"
            @error="uploadError"
            :headers="uploadHeaders()"
            :disabled="image.loading">
            <el-button type="primary" :loading="image.loading" style="margin-bottom: 10px;">上传缩略图</el-button>
          </upload>
        </template>
        <img :src="detail.image" style="width: 200px;height: auto;border: 1px solid #bfcbd9" alt="">
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
      <template v-else>
        <el-button type="primary" v-if="checkPermission(permissionConstant.present_u)" @click="update">确 定</el-button>
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
            name: '',
            description: '',
            hide: 'false',
            priority: 0
          }
        }
      }
    },
    data () {
      const me = this
      return {
        isMain: false,
        image: {
          action: process.env.BASE_API + '/mi/presentAction/uploadImage',
          loading: false,
          change () {
            me.image.loading = true
          }
        },
        textMap: {
          update: '编辑',
          create: '创建'
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
        const me = this
        return new Promise((resolve, reject) => {
          if (me.image.loading) {
            me.$message.warning('正在上传图片缩略图，请稍后提交')
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
          me.$store.dispatch('CreatePresent', temp).then(() => {
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
          me.$store.dispatch('UpdatePresentDetail', temp).then(() => {
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
