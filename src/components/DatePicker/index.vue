<template>
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
  created () {
    this.$parent.$on('clear', this.setValue)
  },
  methods: {
    setValue (value) {
      this.value = value
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
