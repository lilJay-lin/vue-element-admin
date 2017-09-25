<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="订单编码" v-model="listQuery.keyword"></el-input>
      <el-select  v-if="isMain"  @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option :key="'all'" :label="'全部'" :value="''"></el-option>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <template v-if="isMain">
<!--
        <el-button  v-if="checkPermission(permissionConstant.presentOrder_c)" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
-->
        <el-button  v-if="checkPermission(permissionConstant.presentOrder_d)" class="filter-item" style="margin-left: 10px" @click="handleBatchDelete" type="danger" icon="edit">批量删除</el-button>
      </template>
    </div>
    <el-table :key='tableKey' @selection-change="handleSelectionChange" :data="presentOrder.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="isMain"
        type="selection"
        width="55">
      </el-table-column>
<!--      <el-table-column align="center" label="抽奖订单ID">
        <template scope="scope">
          <span :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.id}}</span>
        </template>
      </el-table-column>-->
      <el-table-column align="center" label="礼品ID">
        <template scope="scope">
          <span >{{scope.row.presentId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户ID">
        <template scope="scope">
          <span >{{scope.row.userId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单编码">
        <template scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="60">
        <template scope="scope">
          <el-tag :type="scope.row.status ?  'danger' : 'primary'">{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <template  v-if="isMain" >
        <el-table-column v-if="checkPermission(permissionConstant.presentOrder_d)" align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button  size="small" type="primary" @click="handleUpdate(scope.row)">详情</el-button>
            <el-button  size="small" type="danger" @click="handleModifyStatus(scope.row, true)">删除</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column  align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button v-if="has(scope.row.id)" size="small" type="primary" @click="cancelCheck(scope.row)">取消选中</el-button>
            <el-button v-else size="small" @click="check(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </template>
      
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="presentOrder.pageInfo.totalRow">
      </el-pagination>
    </div>
    <PresentOrder-Detail  :title="textMap[dialogStatus]" :before-close="cancel" @submit="submit()" @cancel="cancel" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></PresentOrder-Detail>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PresentOrderDetail from './detail.vue'
  const temp = {
    present: {
      id: '',
      name: '',
      image: '',
      address: '',
      stock: '',
      requirement: '',
      weight: 0,
      expiryDate: '',
      hide: ''
    },
    presentOrder: {
      id: '',
      presentId: '',
      userId: '',
      number: '',
      status: 0
    },
    user: {
      id: '',
      name: '',
      mobile: '',
      locked: 'false',
      presentChance: 0,
      promotionalPartnerId: '',
      shared: false
    }
  }
  export default {
    components: {
      PresentOrderDetail
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
      presentOrders: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_presentOrder',
    data() {
      return {
        selections: [], /* 选中 */
        listLoading: true,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        listQuery: {
          targetPage: 1,
          pageSize: 10,
          keyword: undefined,
          status: ''
        },
        temp: Object.assign({}, temp),
        statusOptions: [{ label: '待取', key: '0', value: 0 }, { label: '已取', key: '1', value: 1 }],
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['presentOrder'])
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        return status === 0 ? '待取' : '已取'
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllPresentOrder', this.listQuery).then(() => {
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
        this.listQuery.targetPage = val
        this.getList()
      },
      handleBatchDelete () {
        if (this.selections.length === 0) {
          this.$message({
            message: '请选择要删除的分类',
            type: 'warning'
          })
          return
        }
        const ids = this.selections.map((selection) => {
          return selection.id
        })
        this.delete(ids, '确认批量删除抽奖订单？')
      },
      handleModifyStatus(row) {
        this.delete([row.id], '确认删除订单：' + row.id + '？')
      },
      delete (ids, msg) {
        this.$confirm(msg).then(() => {
          this.$store.dispatch('DelPresentOrder', { ids }).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        }, () => {})
      },
      handleCreate() {
        this.temp = Object.assign({}, temp)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        this.$store.dispatch('GetPresentOrderDetail', row.id).then((detail) => {
          detail.present.expiryDate = String(detail.present.expiryDate)
          detail.present.hide = String(detail.present.hide)
          detail.presentOrder.status = String(detail.presentOrder.status)
          detail.user.locked = String(detail.user.locked)
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
        return this.presentOrders.some((presentOrder) => {
          return presentOrder.id === id
        })
      },
      handleSelectionChange(val) {
        this.selections = val
      }
    }
  }
</script>
