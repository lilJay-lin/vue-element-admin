<template>
  <div v-loading="detailLoading"  style="min-height:400px;padding: 30px 20px 30px 0">
    <detail v-if="!detailLoading" :cancel-visible="false" width="820" :detail="temp" dialog-status="update" :status-options="statusOptions"></detail>
  </div>
</template>
<script type="text/ecmascript-6">
import Detail from '../user/detail.vue'
const temp = {
  _id: '',
  userName: '',
  loginName: '',
  email: '',
  status: '1',
  avatar: '',
  introduction: '',
  roles: [],
  createdAt: '',
  updatedAt: ''
}
export default {
  components: {
    Detail
  },
  data () {
    return {
      detailLoading: true,
      temp: Object.assign({}, temp),
      statusOptions: [{ label: '有效', key: '1' }, { label: '无效', key: '0' }]
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      this.detailLoading = true
      this.$store.dispatch('GetInfo').then(({ data: { user } }) => {
        this.detailLoading = false
        this.temp = Object.assign({}, user)
      })
    }
  }
}
</script>
