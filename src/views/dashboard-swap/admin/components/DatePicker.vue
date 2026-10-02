<template>
  <div class="filter-bar">
    <span class="filter-label">Filter by date</span>
    <date-range class="datepicker" @change="onChange" />
    <el-button size="small" type="primary" @click="filter">Filter</el-button>
  </div>
</template>

<script>
import DateRange from '@/components/DatePicker'

export default {
  components: { DateRange },
  data () {
    return {
      value: null
    }
  },
  methods: {
    onChange (value) {
      this.value = value
      this.$emit('change', value)
    },
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
  width: 320px;
}
</style>
