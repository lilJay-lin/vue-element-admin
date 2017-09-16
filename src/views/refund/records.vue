<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="退款订单名称" v-model="listQuery.keyword"></el-input>
      <el-select  v-if="isMain"  @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <template v-if="isMain">
        <el-button  v-if="checkPermission(permissionConstant.refund_c)" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        <el-button  v-if="checkPermission(permissionConstant.refund_d)" class="filter-item" style="margin-left: 10px" @click="handleBatchDelete" type="danger" icon="edit">批量删除</el-button>
      </template>
    </div>
    <el-table :key='tableKey' @selection-change="handleSelectionChange" :data="refund.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="isMain"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="订单ID" width="300">
        <template scope="scope">
          <span :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款金额" width="120">
        <template scope="scope">
          <span>{{scope.row.refundAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="退款理由">
        <template scope="scope">
          <span >{{scope.row.reason}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="平台意见">
        <template scope="scope">
          <span >{{scope.row.comment}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="退款凭证">
        <template scope="scope">
          <img :src="scope.row.evidence" alt="" style="width: 120px;height: auto;padding-top: 5px;">
        </template>
      </el-table-column>
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="140">
          <template scope="scope">
            <el-tag >{{scope.row.status | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(permissionConstant.refund_d)" align="center" label="操作" width="150" >
          <template scope="scope">
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
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="refund.pageInfo.totalRow">
      </el-pagination>
    </div>
    <Refund-Detail  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" @submit="submit()" @cancel="cancel()" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></Refund-Detail>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import RefundDetail from './detail.vue'
  const statusOptions = [
    { key: 0, label: '未使用待退款' },
    { key: 1, label: '未使用退款成功' },
    { key: 2, label: '未使用退款撤销' },
    { key: 3, label: '已使用待退款' },
    { key: 4, label: '已使用退款成功' },
    { key: 5, label: '已使用退款失败' },
    { key: 6, label: '已使用退款撤销' }
  ]
  const temp = {
    refund: {
      cashCouponOrderId: '',
      comment: '',
      evidence: '',
      id: '',
      reason: '',
      refundAmount: '',
      status: 0
    },
    cashCoupon: {
      id: '',
      shopId: '',
      name: '',
      preImage: '',
      discountAmount: 0,
      expiryDate: '',
      expired: 'false',
      hide: 'false',
      priority: 0
    },
    cashCouponOrder: {
      id: '',
      number: '',
      payOrderNumber: '',
      price: '',
      refundAmount: 0,
      status: 0,
      userId: ''
    }
  }
  export default {
    components: {
      RefundDetail
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
      refunds: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_refund',
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
          status: 0
        },
        temp: Object.assign({}, temp),
        statusOptions: statusOptions,
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['refund'])
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const option = statusOptions.filter((s) => {
          return s.key === status
        })
        return option[0].label
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllRefund', this.listQuery).then(() => {
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
            message: '请选择要删除的退款订单',
            type: 'warning'
          })
          return
        }
        const ids = this.selections.map((selection) => {
          return selection.id
        })
        this.delete(ids, '确认批量删除退款订单？')
      },
      handleModifyStatus(row) {
        this.delete([row.id], '确认删除退款订单：' + row.id + '？')
      },
      delete (ids, msg) {
        this.$confirm(msg).then(() => {
          this.$store.dispatch('DelRefund', { ids }).then(() => {
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
      handleUpdate(row) {
        this.$store.dispatch('GetRefundDetail', row.id).then((detail) => {
          detail.hide = String(detail.hide)
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
        return this.refunds.some((refund) => {
          return refund.id === id
        })
      },
      handleSelectionChange(val) {
        this.selections = val
      }
    }
  }
</script>
