<template>
  <div class="container">
    <span>FILTER BY DATE</span>
    <el-date-picker
      v-model="value"
      class="datepicker"
      type="daterange"
      align="right"
      unlink-panels
      start-placeholder="Start date"
      end-placeholder="End date"
      :picker-options="pickerOptions"
      v-on="$listeners"
    />
    <el-button type="primary" @click="filter">FILTER</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: [{
          text: 'Last week',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last month',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 3 months',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: ''
    }
  },
  methods: {
    filter () {
      this.$emit('filter', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.datepicker {
  margin: 1rem;
}
</style>
