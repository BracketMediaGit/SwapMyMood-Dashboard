<template>
  <!-- Two separate fields instead of el-date-picker daterange, which users found confusing (86bcbqmht) -->
  <div class="date-range">
    <el-date-picker
      v-model="start"
      type="date"
      size="small"
      format="MM/dd/yyyy"
      placeholder="Start date"
      aria-label="Start date"
      :default-value="end || undefined"
      :picker-options="startOptions"
      @change="emitChange"
    />
    <span class="date-range__sep">to</span>
    <el-date-picker
      v-model="end"
      type="date"
      size="small"
      format="MM/dd/yyyy"
      placeholder="End date"
      aria-label="End date"
      :default-value="start || undefined"
      :picker-options="endOptions"
      @change="emitChange"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      start: null,
      end: null
    }
  },
  computed: {
    startOptions () {
      return { disabledDate: d => !!this.end && d > this.end }
    },
    endOptions () {
      return { disabledDate: d => !!this.start && d < this.start }
    }
  },
  created () {
    this.$parent.$on('clear', this.setValue)
  },
  methods: {
    // Same contract as the old daterange: [start, end], or null when both are empty.
    // Only start → "from" (until end of today); only end → "until" (from the beginning).
    // End is pushed to 23:59:59.999 so the end day itself is included.
    emitChange () {
      if (!this.start && !this.end) return this.$emit('change', null)
      // Not new Date(0): some views check `if (fromDate && toDate)` and 0 is falsy
      const start = this.start || new Date(2000, 0, 1)
      const end = new Date(this.end || Date.now())
      end.setHours(23, 59, 59, 999)
      this.$emit('change', [start, end])
    },
    setValue () {
      this.start = null
      this.end = null
    }
  }
}
</script>

<style lang="scss" scoped>
.date-range {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .el-date-editor.el-input {
    flex: 1;
    width: auto;
    min-width: 0;
  }

  &__sep {
    font-size: 12px;
    color: #8a94a6;
  }
}
</style>
