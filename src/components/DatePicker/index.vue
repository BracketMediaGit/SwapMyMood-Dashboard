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
    // Same contract as the old daterange: [start, end] when both are set, null when not.
    // End is pushed to 23:59:59.999 so the end day itself is included.
    emitChange () {
      if (this.start && this.end) {
        const end = new Date(this.end)
        end.setHours(23, 59, 59, 999)
        this.$emit('change', [this.start, end])
      } else {
        this.$emit('change', null)
      }
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
