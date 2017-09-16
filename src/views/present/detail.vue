<template>
  <div>
    <div class="modal" style="z-index: 1200" v-if="dialogFormVisible"></div>
    <el-dialog :modal = "false"  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
      <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
        <el-form-item label="礼品名称"  prop="name">
          <el-input v-model="detail.name"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <template v-if="dialogStatus=='create' || checkPermission(permissionConstant.present_u) && dialogStatus === 'update'">
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
        <el-form-item label="地址" prop="priority">
          <el-input v-model="detail.address"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="detail.weight" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="需求" prop="requirement">
          <el-input v-model="detail.requirement" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="detail.stock" type="number" min="0"></el-input>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker v-model="detail.expiryDate" :clearable="false" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
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
        <template v-if="dialogStatus=='update' && checkPermission(permissionConstant.present_u)">
          <el-button type="primary" @click="update">确 定</el-button>
        </template>
      </div>
    </el-dialog>
  </div>
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
            hide: '',
            image: '',
            address: '',
            expiryDate: '',
            requirement: 0,
            stock: 0,
            weight: 0
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
            { required: true, min: 3, max: 32, message: '奖品名称长度3到32位', trigger: 'blur' }
          ],
          requirement: [
            { validator: Validate.validateNumber('需求只能为数字'), trigger: 'blur' }
          ],
          stock: [
            { validator: Validate.validateNumber('库存只能为数字'), trigger: 'blur' }
          ],
          weight: [
            { validator: Validate.validateNumber('权重只能为数字'), trigger: 'blur' }
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
