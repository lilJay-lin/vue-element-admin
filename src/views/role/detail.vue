<template>
  <el-dialog :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 900px;margin-left:50px'>
      <el-form-item label="状态">
        <el-select class="filter-item" v-model="detail.status" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.description">
        </el-input>
      </el-form-item>
      <el-form-item label="关联权限">
        <el-tooltip  v-for="permission in detail.permissions" :key="permission._id" :content="permission.description" placement="top">
          <el-tag type="success" :closable="true"
                  :close-transition="false" @close="handleDelRelation(permission)">
            {{permission.name}}
          </el-tag>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择关联权限">
        <Permissions :is-main = "isMain" :permissions="detail.permissions" @check="handleAddRelation" @cancel-check="handleDelRelation"></Permissions>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <el-button v-else type="primary" @click="update">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import Permissions from '../permission/records.vue'
export default {
  components: {
    Permissions
  },
  props: {
    dialogStatus: {
      type: String,
      default: 'create'
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    statusOptions: {
      type: Array,
      default () {
        return []
      }
    },
    detail: {
      type: Object,
      default () {
        return {
          _id: '',
          name: '',
          description: '',
          status: '1',
          createdAt: '',
          updatedAt: '',
          permissions: []
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
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名称长度2到10位', trigger: 'blur' }
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
        me.$store.dispatch('CreateRole', me.detail).then(() => {
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
        me.$store.dispatch('UpdateRoleDetail', me.detail).then(() => {
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
    handleDelRelation ({ _id }) {
      this.detail.permissions = this.detail.permissions.filter((permission) => {
        return permission._id !== _id
      })
    },
    handleAddRelation (permission) {
      this.detail.permissions.push(permission)
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
