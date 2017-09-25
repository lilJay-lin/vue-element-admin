<template>
  <div class="app-container" v-loading="loading">
    <el-form class="small-space" :model="detail"ref="detailForm" label-position="left" label-width="200px" style='width: 520px;margin-left:100px;margin-top: 50px;'>
      <el-form-item label="显示全网累计优惠金额" >
        <el-tooltip :content="detail.cashCouponOrderHide ? '显示' : '隐藏'" placement="top">
          <el-switch v-model="detail.cashCouponOrderHide" on-color="#13ce66" off-color="#ff4949"></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="true" v-if="detail.counting">统计中</el-button>
        <el-button type="primary" v-else @click="handleCounting">马上统计</el-button>
        <el-button type="primary" @click="onSubmit">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        detail: {
          cashCouponOrderHide: false,
          counting: false
        },
        loading: false
      }
    },
    methods: {
      onSubmit () {
        const me = this
        me.$store.dispatch('CashCouponOrderMaintenanceStatusPost', me.detail.cashCouponOrderHide).then(() => {
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
        me.$store.dispatch('CashCouponOrderMaintenanceStatusGet').then(({ cashCouponOrderHide, counting }) => {
          me.detail.cashCouponOrderHide = cashCouponOrderHide === 'true' || cashCouponOrderHide === true
          me.detail.counting = counting === 'true' || counting === true
          me.loading = false
        })
      },
      handleCounting () {
        this.$store.dispatch('CountCashCouponOrder').then(() => {
          this.detail.counting = true
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
