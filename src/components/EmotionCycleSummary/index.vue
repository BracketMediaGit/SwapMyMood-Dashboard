<template>
  <div class="ec-summary">
    <div v-if="loading" class="ec-summary__empty"><i class="el-icon-loading" /> Loading emotional cycle…</div>
    <div v-else-if="!groups.length" class="ec-summary__empty">Emotional cycle details unavailable.</div>
    <div v-for="g in groups" v-else :key="g.label" class="ec-summary__group">
      <p class="ec-summary__label">{{ g.label }}</p>
      <el-tag v-for="item in g.items" :key="item.id" size="medium" :type="g.type">{{ item.name }}</el-tag>
    </div>
  </div>
</template>

<script>
import emotionCycleService from '@/services/emotionCycle'

const SENSATION_LABELS = {
  head: 'Head, Face, Throat, Neck',
  chest: 'Chest, Heart, Breathing',
  abdomen: 'Abdomen',
  arm: 'Arms',
  leg: 'Legs',
  wholebody: 'Whole Body'
}

export default {
  name: 'EmotionCycleSummary',
  props: {
    id: { type: String, required: true }
  },
  data () {
    return { ec: null, loading: true }
  },
  computed: {
    groups () {
      if (!this.ec) return []
      const sensations = Object.keys(this.ec.sensations || {}).map(zone => ({
        label: SENSATION_LABELS[zone] || zone, items: this.ec.sensations[zone], type: ''
      }))
      return [
        { label: 'Triggers', items: this.ec.triggers, type: 'danger' },
        { label: 'Emotions', items: this.ec.emotions, type: 'warning' },
        ...sensations,
        { label: 'Thoughts', items: this.ec.thoughts, type: 'info' },
        { label: 'Behaviors', items: this.ec.behaviors, type: 'info' }
      ].filter(g => g.items && g.items.length)
    }
  },
  watch: {
    id: { immediate: true, handler: 'fetch' }
  },
  methods: {
    fetch () {
      this.loading = true
      this.ec = null
      emotionCycleService.getEmotionCycleById(this.id)
        .then(res => { this.ec = res })
        .catch(() => {}) // ponytail: fallback text covers 403/404 (e.g. linked account, unshared cycle)
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
