<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="权限名称" v-model="listQuery.name"></el-input>
      <el-select  v-if="isMain"  @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="isMain" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="crpRoles.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
  
<!--      <el-table-column v-if="isMain" align="center" label="序号">
        <template scope="scope">
          <span>{{scope.row._id}}</span>
        </template>
      </el-table-column>-->
      
      <el-table-column width="110" align="center" label="权限名称">
        <template scope="scope">
          <span v-if="scope.row.status === '1'" :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
          <span v-if="scope.row.status === '0'" >{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="220px" align="center" label="描述">
        <template scope="scope">
          <span >{{scope.row.description}}</span>
        </template>
      </el-table-column>
  
      <el-table-column width="110" align="center" label="创建时间">
        <template scope="scope">
          <span >{{scope.row.createdAt}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="110" align="center" label="更新时间">
        <template scope="scope">
          <span >{{scope.row.updatedAt}}</span>
        </template>
      </el-table-column>
      
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="60">
          <template scope="scope">
            <el-tag :type="scope.row.status ? 'primary' : 'danger'">{{scope.row.status | statusFilter}}</el-tag>
          </template>
        </el-table-column>
  
        <el-table-column   v-if="isMain" align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button  v-if="scope.row.status === '1'" size="small" type="danger" @click="handleModifyStatus(scope.row,'0')">删除</el-button>
            <el-button  v-if="scope.row.status === '0'" size="small" type="success" @click="handleModifyStatus(scope.row,'1')">恢复</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column  align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button v-if="has(scope.row._id)" size="small" type="primary" @click="cancelCheck(scope.row)">取消选中</el-button>
            <el-button v-else size="small" @click="check(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </template>
      
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="crpRoles.pageInfo.totalRow">
      </el-pagination>
    </div>
    <Role-Detail @submit="submit()" @cancel="cancel()" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></Role-Detail>
  
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import RoleDetail from './detail.vue'
  const temp = {
    _id: '',
    name: '',
    description: '',
    status: '1',
    createdAt: '',
    updatedAt: '',
    permissions: []
  }
  export default {
    components: {
      RoleDetail
    },
    props: {
      containerClass: {
        type: String,
        default: ''
      },
      isMain: {
        type: Boolean,
        default: true
      },
      roles: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_role',
    data() {
      return {
        listLoading: true,
        detailLoading: true,
        listQuery: {
          page: 1,
          pageSize: 20,
          name: undefined,
          status: '1'
        },
        temp: Object.assign({}, temp),
        statusOptions: [{ label: '有效', key: '1' }, { label: '无效', key: '0' }],
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['crpRoles'])
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        return status === '1' ? '有效' : '失效'
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllRoles', this.listQuery).then(() => {
          this.listLoading = false
        }, () => {})
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleModifyStatus(row, status) {
        let promise = Promise.resolve()
        if (status === '0') {
          promise = this.$confirm('确认删除权限：' + row.name + '？')
        }
        promise.then(() => {
          this.$store.dispatch('DelRoles', { ids: [row._id], data: { status } }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        }, () => {})
      },
      handleCreate() {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleDelRelation (role) {
        const me = this
        me.$store.dispatch('DelRoles').then(() => {
          me.temp.roles.splice(me.temp.roles.indexOf(role), 1)
        })
      },
      handleUpdate(row) {
        this.detailLoading = true
        this.$store.dispatch('GetRoleDetail', row._id).then((detail) => {
          this.detailLoading = false
          this.temp = Object.assign({}, detail)
        })
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      submit () {
        this.dialogFormVisible = false
        this.getList()
        this.temp = Object.assign({}, temp)
      },
      cancel () {
        this.dialogFormVisible = false
        this.temp = Object.assign({}, temp)
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
      has (id) {
        return this.roles.some((role) => {
          return role._id === id
        })
      }
    }
  }
</script>
