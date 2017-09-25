<template>
  <el-dialog :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 900px;margin-left:50px'>
      <el-form-item label="角色名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.description"></el-input>
      </el-form-item>
      <el-form-item label="关联权限">
        <span v-if ="detail.permissionList.length === 0">无关联角色</span>
        <el-tooltip v-else v-for="permission in detail.permissionList" :key="permission.id" :content="permission.description" placement="top">
          <el-tag type="success" :closable="dialogStatus=='create' || checkPermission(permissionConstant.role_u) && dialogStatus === 'update'"
                  :close-transition="false" @close="handleDelRelation(permission)">
            {{permission.name}}
          </el-tag>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择关联权限" v-if="dialogStatus=='create' || checkPermission(permissionConstant.role_u) && dialogStatus === 'update'">
        <Permissions :permissions="detail.permissionList" @check="handleAddRelation" @cancel-check="handleDelRelation"></Permissions>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template  v-if="dialogStatus=='update' && checkPermission(permissionConstant.role_u)">
        <el-button type="primary" @click="update">确 定</el-button>
      </template>
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
    detail: {
      type: Object,
      default () {
        return {
          id: '',
          name: '',
          description: '',
          permissionList: [],
          permissionListStr: ''
        }
      }
    }
  },
  data () {
    return {
      isMain: false,
      textMap: {
        update: '编辑角色',
        create: '创建角色',
        info: '角色'
      },
      detailRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名称长度3到10位', trigger: 'blur' }
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
    filterData (temp) {
      temp.permissionListStr = (temp.permissionList.map((permissoin) => {
        return permissoin.code
      })).join(',')
      delete temp.permissionList
      return temp
    },
    create() {
      const me = this
      me.validate().then(() => {
        let temp = Object.assign({}, me.detail)
        delete temp.id
        temp = me.filterData(temp)
        me.$store.dispatch('CreateRole', temp).then(() => {
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
        let temp = Object.assign({}, me.detail)
        temp = me.filterData(temp)
        me.$store.dispatch('UpdateRoleDetail', temp).then(() => {
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
    handleDelRelation ({ code }) {
      this.detail.permissionList = this.detail.permissionList.filter((permission) => {
        return permission.code !== code
      })
    },
    handleAddRelation (permission) {
      this.detail.permissionList.push(permission)
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
