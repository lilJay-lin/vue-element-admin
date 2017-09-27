<template>
  <div v-loading="detailLoading"  style="min-height:400px;padding: 30px 20px 30px 0">
    <detail v-if="!detailLoading" :cancel-visible="false" width="820" :detail="temp" dialog-status="info" :status-options="statusOptions"></detail>
  </div>
</template>
<script type="text/ecmascript-6">
import Detail from '../admin/detail.vue'
const temp = {
  id: '',
  name: '',
  mobile: '',
  password: '',
  second_password: '',
  locked: 'false',
  permissionList: [],
  roleList: []
}
export default {
  components: {
    Detail
  },
  data () {
    return {
      detailLoading: true,
      temp: Object.assign({}, temp),
      statusOptions: [{ label: '有效', key: 'false', value: 'false' }, { label: '冻结', key: 'true', value: 'true' }],
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.detailLoading = true
      this.$store.dispatch('GetInfo').then((result) => {
        this.detailLoading = false
        this.temp = Object.assign({}, result)
        this.temp.roleList = []
        this.temp.locked = String(this.temp.locked)
      })
    }
  }
}
</script>
