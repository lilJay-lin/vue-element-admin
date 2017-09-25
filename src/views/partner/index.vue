<template>
  <div class="app-container" v-loading="loading">
    <el-form class="small-space" :model="detail" :rules="partner" ref="detailForm" label-position="left" label-width="100px" style='width: 320px;margin-left:100px;margin-top: 50px;'>
      <el-form-item label="费率" prop="rate">
        <el-input v-model="detail.rate"></el-input>
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
      const validate = (rule, value, callback) => {
        const val = window.parseInt(value, 10)
        if (!(/^[\d]+$/.test(value) && val > 0 && val < 100)) {
          callback(new Error('只能是1-99的数字'))
        } else {
          callback()
        }
      }
      return {
        detail: {
          rate: 1,
          counting: false
        },
        loading: false,
        partner: {
          rate: [
            { validator: validate, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit () {
        const me = this
        me.$refs.detailForm.validate((valid) => {
          if (valid) {
            me.$store.dispatch('PartnerMaintenanceStatusPost', me.detail.rate).then(() => {
              me.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      getMaintenance () {
        const me = this
        me.loading = true
        me.$store.dispatch('PartnerMaintenanceStatusGet').then(({ rate, counting }) => {
          me.detail.rate = rate
          me.detail.counting = counting === 'true' || counting === true
          me.loading = false
        })
      },
      handleCounting () {
        this.$store.dispatch('CountPartner').then(() => {
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
