<script src="../../../../xmb/database/redis_database.js"></script>
<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="订单编码" v-model="listQuery.keyword"></el-input>
      <el-select  v-if="isMain"  @change='handleFilter' style="width: 160px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option :key="'all'" :label="'全部'" :value="''"></el-option>
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <template v-if="isMain">
<!--
        <el-button  v-if="checkPermission(permissionConstant.cashCouponOrder_c)" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
-->
        <el-button  v-if="checkPermission(permissionConstant.cashCouponOrder_d)" class="filter-item" style="margin-left: 10px" @click="handleBatchDelete" type="danger" icon="edit">批量删除</el-button>
      </template>
    </div>
    <el-table :key='tableKey' @selection-change="handleSelectionChange" :data="cashCouponOrder.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="isMain"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column  align="center" label="订单编码">
        <template scope="scope">
          <span  :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="支付编码" width="280">
        <template scope="scope">
          <span>{{scope.row.payOrderNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="累计退款金额">
        <template scope="scope">
          <span >{{scope.row.refundAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="价格">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="140">
          <template scope="scope">
            <el-tag >{{scope.row.status | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(permissionConstant.cashCouponOrder_d)" align="center" label="操作" width="150" >
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
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="cashCouponOrder.pageInfo.totalRow">
      </el-pagination>
    </div>
    <CashCouponOrder-Detail  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" @submit="submit()" @cancel="cancel()" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></CashCouponOrder-Detail>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CashCouponOrderDetail from './detail.vue'
  const statusOptions = [
    { value: 0, key: '0', label: '被选中（购物车）' },
    { value: 1, key: '1', label: '已购买未使用' },
    { value: 2, key: '2', label: '已使用' },
    { value: 3, key: '3', label: '未使用待退款' },
    { value: 4, key: '4', label: '已使用待退款' },
    { value: 5, key: '5', label: '未使用已退款' },
    { value: 6, key: '6', label: '已使用已退款' }
  ]
  const temp = {
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
      price: 0,
      refundAmount: 0,
      status: 0,
      userId: ''
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
      CashCouponOrderDetail
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
      cashCouponOrders: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_cashCouponOrder',
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
        statusOptions,
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['cashCouponOrder'])
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        const option = statusOptions.filter((s) => {
          return s.value === status
        })
        return option[0].label
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllCashCouponOrder', this.listQuery).then(() => {
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
            message: '请选择要删除的订单',
            type: 'warning'
          })
          return
        }
        const ids = this.selections.map((selection) => {
          return selection.id
        })
        this.delete(ids, '确认批量删除订单？')
      },
      handleModifyStatus(row) {
        this.delete([row.id], '确认删除订单：' + row.number + '？')
      },
      delete (ids, msg) {
        this.$confirm(msg).then(() => {
          this.$store.dispatch('DelCashCouponOrder', { ids }).then(() => {
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
        this.$store.dispatch('GetCashCouponOrderDetail', row.id).then((detail) => {
          detail.cashCoupon.expired = String(detail.cashCoupon.expired)
          detail.cashCoupon.hide = String(detail.cashCoupon.hide)
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
        return this.cashCouponOrders.some((cashCouponOrder) => {
          return cashCouponOrder.id === id
        })
      },
      handleSelectionChange(val) {
        this.selections = val
      }
    }
  }
</script>
