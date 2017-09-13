<template>
  <el-dialog  :title="textMap[dialogStatus]" :visible="dialogFormVisible" :before-close="cancel" size="full">
    <el-form class="small-space" :model="detail" :rules="detailRules" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:50px'>
      <el-form-item label="商户名称"  prop="name">
        <el-input v-model="detail.name"></el-input>
      </el-form-item>
      <el-form-item label="商标">
        <img :src="detail.logo" style="width: 80px;height: auto;border: 1px solid #bfcbd9" alt="">
      </el-form-item>
      <el-form-item label="缩略图">
        <img :src="detail.preImage" style="width: 200px;height: auto;border: 1px solid #bfcbd9" alt="">
      </el-form-item>
      <el-form-item label="地址">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.address"></el-input>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="detail.introduction"></el-input>
      </el-form-item>
      <el-form-item label="优惠次数" prop="priority">
        <el-input v-model="detail.totalCashCouponNumber" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="优化价格" prop="priority">
        <el-input v-model="detail.totalCashCouponPrice" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-input v-model="detail.priority" type="number" min="0"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select class="filter-item" v-model="detail.hide" placeholder="状态">
          <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
      <template v-else>
        <el-button type="primary" v-if="checkPermission(permissionConstant.shopClassification_u)" @click="update">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
  import * as Validate from 'utils/validate'
  export default {
    props: {
      dialogStatus: {
        type: String,
        default: 'create'
      },
      statusOptions: {
        type: Array,
        default () {
          return []
        }
      },
      dialogFormVisible: {
        type: Boolean,
        default: false
      },
      detail: {
        type: Object,
        default () {
          return {
            address: '',
            cashCouponList: null,
            hide: 'true',
            id: '',
            introduction: '',
            logo: '',
            name: '',
            preImage: '',
            priority: 0,
            shopClassificationList: null,
            shopIntroductionImageList: null,
            totalCashCouponNumber: 0,
            totalCashCouponPrice: 0
          }
        }
      }
    },
    data () {
      return {
        isMain: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        detailRules: {
          name: [
            { required: true, min: 3, max: 32, message: '商户名称长度3到32位', trigger: 'blur' }
          ],
          priority: [
            { validator: Validate.validatePriority, trigger: 'blur' },
            { validator: Validate.validateNumber('优先级只能为数字'), trigger: 'blur' }
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
      create() {
        const me = this
        me.validate().then(() => {
          const temp = Object.assign({}, me.detail)
          delete temp.id
          me.$store.dispatch('CreateShop', temp).then(() => {
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
          const temp = Object.assign({}, me.detail)
          me.$store.dispatch('UpdateShopDetail', temp).then(() => {
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
