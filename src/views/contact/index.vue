<template>
  <div class="app-container" v-loading="loading">
    <el-form class="small-space" :model="detail" :rules="detailRules"  ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:100px;margin-top: 50px;'>
      <el-form-item label="显示联系号码" >
        <el-tooltip :content="detail.indexContactWayHide ? '显示' : '隐藏'" placement="top">
          <el-switch v-model="detail.indexContactWayHide" on-color="#13ce66" off-color="#ff4949"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="联系号码" prop="indexContactWayNumber">
        <el-input v-model="detail.indexContactWayNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import * as Validate from '../../utils/validate'
  export default {
    data () {
      return {
        loading: false,
        detail: {
          indexContactWayHide: false,
          indexContactWayNumber: ''
        },
        detailRules: {
          indexContactWayNumber: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { validator: Validate.validateMobile, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit () {
        const me = this
        me.$refs.detailForm.validate((valid) => {
          if (valid) {
            me.$store.dispatch('ContactMaintenanceStatusPost', me.detail).then(() => {
              me.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            }, () => {})
          }
        }, () => {})
      },
      getMaintenance () {
        const me = this
        me.loading = true
        me.$store.dispatch('ContactMaintenanceStatusGet').then(({ indexContactWayHide, indexContactWayNumber }) => {
          me.detail.indexContactWayHide = indexContactWayHide === 'true' || indexContactWayHide === true
          me.detail.indexContactWayNumber = indexContactWayNumber
          me.loading = false
        })
      }
    },
    created() {
      this.getMaintenance()
    },
    watch: {
      $route () {
        this.getMaintenance()
      }
    }
  }
</script>
