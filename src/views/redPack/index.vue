<template>
  <div class="app-container" v-loading="loading">
    <el-form class="small-space"  ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:100px;margin-top: 50px;'>
      <el-form-item label="显示抽奖" >
        <el-tooltip :content="redPackHide ? '显示' : '隐藏'" placement="top">
          <el-switch v-model="redPackHide" on-color="#13ce66" off-color="#ff4949"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        redPackHide: false
      }
    },
    methods: {
      onSubmit () {
        const me = this
        me.$store.dispatch('MaintenanceStatusPost', me.redPackHide).then(() => {
          me.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      getMaintenance () {
        const me = this
        me.loading = true
        me.$store.dispatch('MaintenanceStatusGet').then((status) => {
          me.redPackHide = status === 'true' || status === true
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
