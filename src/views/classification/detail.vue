<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="small">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="分类名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
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
      <template v-if="checkPermission(permissionConstant.shopClassification_u) && dialogStatus === 'update'">
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
      return {
        isMain: false,
        textMap: {
          update: '编辑商家分类',
          create: '创建商家分类',
          info: '商家分类'
        },
        detailRules: {
          name: [
            { required: true, min: 2, max: 32, message: '分类名称长度2到32位', trigger: 'blur' }
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
          me.$store.dispatch('CreateShopClassification', temp).then(() => {
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
          me.$store.dispatch('UpdateShopClassificationDetail', temp).then(() => {
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
