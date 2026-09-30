<template>
  <div class="ec-summary">
    <div v-if="loading" class="ec-summary__empty"><i class="el-icon-loading" /> Loading SWAPS…</div>
    <div v-else-if="!groups.length" class="ec-summary__empty">SWAPS details unavailable.</div>
    <div v-for="g in groups" v-else :key="g.label" class="ec-summary__group">
      <p class="ec-summary__label">{{ g.label }}</p>
      <el-tag v-for="item in g.items" :key="item.id || item.name" size="medium" :type="g.type">{{ item.name }}</el-tag>
    </div>
  </div>
</template>

<script>
import swapService from '@/services/swap'

export default {
  name: 'SwapSummary',
  props: {
    id: { type: String, required: true }
  },
  data () {
    return { swap: null, loading: true }
  },
  computed: {
    groups () {
      if (!this.swap) return []
      const level = (this.swap.satisfactionLevels || []).find(s => s.selected)
      return [
        { label: 'Problem', items: this.swap.problem ? [this.swap.problem] : [], type: 'primary' },
        { label: 'Alternatives', items: this.swap.alternatives, type: '' },
        { label: 'Satisfaction', items: level ? [level] : [], type: 'warning' },
        { label: "I'm satisfied because", items: (this.swap.satisfactions || []).filter(s => s.selected), type: 'success' },
        { label: 'Notes', items: this.swap.notes, type: 'info' }
      ].filter(g => g.items && g.items.length)
    }
  },
  watch: {
    id: { immediate: true, handler: 'fetch' }
  },
  methods: {
    fetch () {
      this.loading = true
      this.swap = null
      swapService.getSwapById(this.id)
        .then(res => { this.swap = res })
        .catch(() => {}) // ponytail: fallback text covers 403/404 (e.g. linked account, unshared swap)
        .finally(() => { this.loading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.ec-summary {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid #f0f2f5;

  &__group + &__group { margin-top: 12px; }

  &__label {
    font-size: 12px;
    font-weight: 600;
    color: #4a5568;
    margin: 0 0 4px;
  }

  &__empty {
    font-size: 13px;
    color: #8a94a6;
  }

  .el-tag { margin: 4px 6px 4px 0; }
}
</style>
