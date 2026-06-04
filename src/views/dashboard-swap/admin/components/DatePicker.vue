<template>
  <div class="filter-bar">
    <span class="filter-label">Filter by date</span>
    <el-date-picker
      v-model="value"
      class="datepicker"
      type="daterange"
      size="small"
      align="right"
      unlink-panels
      start-placeholder="Start date"
      end-placeholder="End date"
      :picker-options="pickerOptions"
      v-on="$listeners"
    />
    <el-button size="small" type="primary" @click="filter">Filter</el-button>
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
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #8a94a6;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

.datepicker {
  width: 260px !important;
}
</style>
