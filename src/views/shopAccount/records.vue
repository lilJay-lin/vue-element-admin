<template>
  <div :class="[containerClass]">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px" class="filter-item" placeholder="商家帐号名称" v-model="listQuery.keyword"></el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <template v-if="isMain">
        <el-button  v-if="checkPermission(permissionConstant.shop_c)" class="filter-item" style="margin-left: 10px" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        <el-button  v-if="checkPermission(permissionConstant.shop_d)" class="filter-item" style="margin-left: 10px" @click="handleBatchDelete" type="danger" icon="edit">批量删除</el-button>
      </template>
    </div>
    <el-table :key='tableKey' @selection-change="handleSelectionChange" :data="shopAccount.records" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column v-if="isMain"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column width="130" align="center" label="帐号名称">
        <template scope="scope">
          <span :class="{'link-type': isMain}" @click="handleUpdate(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="120" align="center" label="抽奖机会">
        <template scope="scope">
          <span>{{scope.row.moneyChance}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="帐号余额">
        <template scope="scope">
          <span>{{scope.row.totalMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="60">
          <template scope="scope">
            <el-tag :type="scope.row.locked ?  'danger' : 'primary'">{{scope.row.locked | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(permissionConstant.shop_d)" align="center" label="操作" width="150" >
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
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="shopAccount.pageInfo.totalRow">
      </el-pagination>
    </div>
    <ShopAccount-Detail :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" @submit="submit()" @cancel="cancel" :dialog-status="dialogStatus" :detail="temp" :status-options="statusOptions" :dialog-form-visible="dialogFormVisible" ></ShopAccount-Detail>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ShopAccountDetail from './detail.vue'
  const temp = {
    description: '',
    id: '',
    locked: 'false',
    moneyChance: 0,
    second_password: '',
    name: '',
    password: '',
    shopId: '',
    totalMoney: 0
  }
  export default {
    components: {
      ShopAccountDetail
    },
    props: {
      shopId: {
        type: String,
        default: ''
      },
      containerClass: {
        type: String,
        default: ''
      },
      isMain: {
        type: Boolean,
        default: true
      },
      shopAccounts: {
        type: Array,
        default () {
          return []
        }
      }
    },
    name: 'crp_shopAccount',
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
          shopId: ''
        },
        temp: Object.assign({}, temp),
        statusOptions: [{ label: '有效', key: 'false' }, { label: '冻结', key: 'true' }],
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['shopAccount'])
    },
    filters: {
      statusFilter(status) {
        return status === false ? '有效' : '冻结'
      }
    },
    methods: {
      getList() {
        if (this.shopId === '') {
          return
        }
        this.listQuery.shopId = this.shopId
        this.listLoading = true
        this.$store.dispatch('GetAllShopAccount', this.listQuery).then(() => {
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
          this.$store.dispatch('DelShopAccount', { ids }).then(() => {
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
        this.temp.shopId = this.shopId
      },
      handleUpdate(row) {
        this.$store.dispatch('GetShopAccountDetail', row.id).then((detail) => {
          this.temp = Object.assign({ password: '', second_password: '' }, detail)
          this.temp.locked = String(this.temp.locked)
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
        return this.shopAccounts.some((shopAccount) => {
          return shopAccount.id === id
        })
      },
      handleSelectionChange(val) {
        this.selections = val
      }
    },
    watch: {
      shopId () {
        this.getList()
      }
    }
  }
</script>
