<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 153px" class="filter-item" placeholder="商品名称" v-model="listQuery.name"></el-input>
      <el-select  v-if="isMain"  @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.status" placeholder="状态">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key"></el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-popover
        ref="add"
        placement="top"
        width="250"
        v-model="dialogFormVisible">
        <el-form class="small-space" :model="temp" :rules="tempRules" ref="detailForm" label-position="left" label-width="50px" style='width: 200px'>
          <el-form-item label="名称"  prop="name">
            <el-input v-model="temp.name" @keyup.enter.native="submit" ref="type_name"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin: 0">
          <el-button size="small" type="text" @click="cancel">取消</el-button>
          <el-button size="small"type="primary"  @click="submit">确定</el-button>
        </div>
      </el-popover>
      <el-button v-popover:add  class="filter-item" @click="showPopover()" style="margin-left: 10px" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="editTypes.records" v-loading.body="listLoading" border fit highlight-current-row >
      <el-table-column align="center" label="产品类别名称">
        <template scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.name"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      
      <template  v-if="isMain" >
        <el-table-column class-name="status-col" label="状态" width="60">
          <template scope="scope">
            <el-tag :type="scope.row.status ? 'primary' : 'danger'">{{scope.row.status | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column  align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button  v-show="scope.row.status === '1' && !scope.row.edit" size="small" type="primary"  @click="scope.row.edit=true">编辑</el-button>
            <el-button v-show="scope.row.status === '1' && scope.row.edit"  type="success" @click='handleUpdate(scope.row)' size="small">完成</el-button>
            <el-button  v-if="scope.row.status === '1'" size="small" type="danger" @click="handleModifyStatus(scope.row,'0')">删除</el-button>
            <el-button  v-if="scope.row.status === '0'" size="small" type="success" @click="handleModifyStatus(scope.row,'1')">恢复</el-button>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column  align="center" label="操作" width="150" >
          <template scope="scope">
            <el-button size="small" @click="check(scope.row)">选中</el-button>
          </template>
        </el-table-column>
      </template>
    
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currentPage"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="editTypes.pageInfo.totalRow">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  const temp = {
    _id: '',
    name: ''
  }
  export default {
    props: {
      containerClass: {
        type: String,
        default: ''
      },
      isMain: {
        type: Boolean,
        default: true
      }
    },
    name: 'type',
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
        tempRules: {
          name: [
            { required: true, message: '名字不能为空', trigger: 'blur' }
          ]
        },
        statusOptions: [{ label: '有效', key: '1' }, { label: '无效', key: '0' }],
        dialogFormVisible: false,
        dialogStatus: '',
        tableKey: 0
      }
    },
    computed: {
      ...mapGetters(['types']),
      editTypes () {
        const types = Object.assign({}, this.types)
        types.records = types.records.map((type) => {
          this.$set(type, 'edit', false)
          return type
        })
        return types
      }
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
        this.$store.dispatch('GetAllTypes', this.listQuery).then(() => {
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
          promise = this.$confirm('确认删除类别：' + row.name + '？')
        }
        promise.then(() => {
          this.$store.dispatch('DelTypes', { ids: [row._id], data: { status } }).then(() => {
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
      handleDelRelation (type) {
        const me = this
        me.$store.dispatch('DelTypes').then(() => {
          me.temp.editTypes.splice(me.temp.editTypes.indexOf(type), 1)
        })
      },
      handleUpdate(row) {
        this.detailLoading = true
        const detail = Object.assign({}, row)
        delete detail.edit
        this.$store.dispatch('UpdateTypeDetail', detail).then(() => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          row.edit = false
        }, () => {})
      },
      submit () {
        this.$refs.detailForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch('CreateType', this.temp).then(() => {
              this.getList()
              this.cancel()
            }, () => {})
          }
        })
      },
      cancel () {
        this.dialogFormVisible = false
        this.temp = Object.assign({}, temp)
        this.$refs.detailForm.resetFields()
      },
      showPopover () {
        this.$refs.detailForm.resetFields()
      }
    }
  }
</script>
