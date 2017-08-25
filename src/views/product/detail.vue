<template>
  <el-dialog :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 400pxmargin-left:50px'>
      <el-form-item label="状态">
        <el-select class="filter-item" v-model="detail.status" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类别"  prop="type">
        <el-select v-model = "detail.type._id"
                   @change="changeType">
          <el-option
            v-for="item in types"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="厂家"  prop="factory">
        <el-select v-model = "detail.factory._id" filterable
                   @change="changeFactory">
          <el-option
            v-for="item in factories"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌"  prop="brand">
        <el-select v-model = "detail.brand._id" filterable
                   @change="changeBrand">
          <el-option
            v-for="item in brands"
            :key="item._id"
            :label="item.name"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号">
        <el-input  placeholder="请输入型号" v-model="detail.model">
        </el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.description">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <el-button v-else type="primary" @click="update">确 定</el-button>
    </div>
<!--    <el-dialog title="修改密码" :visible="typeVisible" :before-close="closeType" size="tiny">
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeType">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </div>
    </el-dialog>-->
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import { getAll as getAllBrands } from '../../api/brand'
import { getAll as getAllTypes } from '../../api/type'
const API = { getAllBrands, getAllTypes }
export default {
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
          type: {},
          brand: {},
          model: '',
          photos: '',
          description: '',
          status: '1',
          createdAt: '',
          updatedAt: ''
        }
      }
    }
  },
  data () {
    return {
      factories: [],
      brands: [],
      types: [],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      detailRules: {
/*        factory: [
          { required: true, message: '厂商不能为空', trigger: 'blur' }
        ],
        brand: [
          { required: true, message: '品牌不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类别不能为空', trigger: 'blur' }
        ]*/
      }
    }
  },
  created () {
    this.remote('', 'getAllBrands', 'factories')
    this.remote('', 'getAllTypes', 'types')
    this.remote('', 'getAllBrands', 'brands')
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
        me.$store.dispatch('CreateProduct', me.detail).then(() => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }, () => {})
      }, () => {})
    },
    update() {
      const me = this
      me.validate().then(() => {
        me.$store.dispatch('UpdateProductDetail', me.detail).then(() => {
          me.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }, () => {})
      }, () => {})
    },
    cancel () {
      this.$emit('cancel')
    },
    remote (query, req, key) {
      API[req]({ name: query, status: '1' }).then(({ data }) => {
        this[key] = data.records.filter(item => {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        })
      }, () => {})
    },
    change (key, id) {
      let keys = key + 's'
      if (key === 'factory') {
        keys = 'factories'
      }
      const data = (this[keys].filter((type) => {
        return type._id === id
      }))[0]
      this.detail[key] = data
    },
    changeType (id) {
      console.log(222222)
      this.change('type', id)
    },
    changeFactory (id) {
      this.change('factory', id)
    },
    changeBrand (id) {
      this.change('brand', id)
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
