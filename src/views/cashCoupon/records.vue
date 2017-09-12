<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="代金券名称" v-model="listQuery.keyword"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <template v-if="isMain">
        <el-button  v-if="checkPermission(permissionConstant.cashCoupon_c)" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        <el-button  v-if="checkPermission(permissionConstant.cashCoupon_d)" class="filter-item" style="margin-left: 10px" @click="handleBatchDelete" type="danger" icon="edit">批量删除</el-button>
      </template>
    </div>
    <el-table :key='tableKey' @selection-change="handleSelectionChange" :data="cashCoupon.records" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column width="130" align="center" label="代金券名称">
        <template scope="scope">
          <span :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="缩略图">
        <template scope="scope">
          <img :src="scope.row.preImage" alt="" style="width: 120px;height: auto;padding-top: 5px;">
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="价格">
        <template scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="优惠金额">
        <template scope="scope">
          <span>{{scope.row.discountAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110" align="center" label="过期时间">
        <template scope="scope">
          <span>{{scope.row.expiryDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="是否过期">
        <template scope="scope">
          <span v-if="scope.row.expired" style="color: #ff4949">是</span>
          <span v-else >否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="优先级">
        <template scope="scope">
          <span >{{scope.row.priority}}</span>
        </template>
      </el-table-column>
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="60">
          <template scope="scope">
            <el-tag :type="scope.row.hide ? 'primary' : 'danger'">{{scope.row.hide | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(permissionConstant.cashCoupon_d)" align="center" label="操作" width="150" >
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
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="cashCoupon.pageInfo.totalRow">
      </el-pagination>
    </div>
    <CashCoupon-Detail  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" @submit="submit()" @cancel="cancel()" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></CashCoupon-Detail>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CashCouponDetail from './detail.vue'
  const temp = {
    id: '',
    shopId: '',
    name: '',
    preImage: '',
    discountAmount: 0,
    expiryDate: '',
    expired: 'false',
    hide: 'false',
    priority: 0
  }
  export default {
    components: {
      CashCouponDetail
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
      cashCoupons: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_cashCoupon',
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
          keyword: undefined
        },
        temp: Object.assign({}, temp),
        statusOptions: [{ label: '有效', key: 'false' }, { label: '无效', key: 'true' }],
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['cashCoupon'])
    },
    created() {
      this.getList()
    },
    filters: {
      statusFilter(status) {
        return status === false ? '有效' : '无效'
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        this.$store.dispatch('GetAllCashCoupon', this.listQuery).then(() => {
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
            message: '请选择要删除的代金券',
            type: 'warning'
          })
          return
        }
        const ids = this.selections.map((selection) => {
          return selection.id
        })
        this.delete(ids, '确认批量删除代价券？')
      },
      handleModifyStatus(row) {
        this.delete([row.id], '确认删除代价券：' + row.name + '？')
      },
      delete (ids, msg) {
        this.$confirm(msg).then(() => {
          this.$store.dispatch('DelCashCoupon', { ids }).then(() => {
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
        this.$store.dispatch('GetCashCouponDetail', row.id).then((detail) => {
          this.temp = Object.assign({}, detail)
          this.temp.hide = String(this.temp.hide)
          this.temp.expired = String(this.temp.expired)
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
        return this.cashCoupons.some((cashCoupon) => {
          return cashCoupon.id === id
        })
      },
      handleSelectionChange(val) {
        this.selections = val
      }
    }
  }
</script>
