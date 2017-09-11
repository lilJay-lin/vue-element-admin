<template>
  <div :class="[containerClass]">
    <el-table :key='tableKey' :data="crpPermissions.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column width="110" align="center" label="权限名称">
        <template scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="权限编码">
        <template scope="scope">
          <span >{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="250px" align="center" label="描述">
        <template scope="scope">
          <span >{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="操作" width="150" >
        <template scope="scope">
          <el-button v-if="has(scope.row.code)" size="small" type="primary" @click="cancelCheck(scope.row)">取消选中</el-button>
          <el-button v-else size="small" @click="check(scope.row)">选中</el-button>
        </template>
      </el-table-column>
      
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    props: {
      containerClass: {
        type: String,
        default: ''
      },
      permissions: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_permission',
    data() {
      return {
        listLoading: true,
        detailLoading: true,
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['crpPermissions'])
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllPermissions').then(() => {
          this.listLoading = false
        }, () => {})
      },
      handleFilter() {
        this.getList()
      },
      handleDelRelation (permission) {
        const me = this
        me.$store.dispatch('DelPermissions').then(() => {
          me.temp.permissionList.splice(me.temp.permissionList.indexOf(permission), 1)
        })
      },
      check (row) {
        this.$emit('check', row)
      },
      cancelCheck (row) {
        this.$emit('cancel-check', row)
      },
      /*
       *  判断权限是否已经在传入的权限列表里面了
       * */
      has (code) {
        return this.permissions.some((permission) => {
          return permission.code === code
        })
      }
    }
  }
</script>
