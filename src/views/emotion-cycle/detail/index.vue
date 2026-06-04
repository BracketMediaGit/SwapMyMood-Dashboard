<template>
  <div v-if="!loading" class="app-container">

    <div class="filter-container">
      <el-button size="small" icon="el-icon-arrow-left" @click="$router.back()">Back</el-button>
      <el-button v-waves size="small" :loading="downloadLoading" class="filter-item" icon="el-icon-download" @click="handleDownload">Export</el-button>
    </div>

    <div class="detail-header">
      <div class="detail-header__name">
        {{ emotionCycle.secret ? 'Private User' : `${emotionCycle.firstName} ${emotionCycle.lastName}` }}
      </div>
      <div class="detail-header__meta">
        {{ new Date(emotionCycle.createdAt) | parseDate }} · {{ new Date(emotionCycle.createdAt) | parseTime }} · Session {{ emotionCycle.session }}
      </div>
    </div>

    <div class="detail-grid">
      <div v-if="emotionCycle.triggers && emotionCycle.triggers.length" class="detail-card">
        <p class="sd-label">Triggers</p>
        <el-tag v-for="t in emotionCycle.triggers" :key="t.id" size="medium" type="danger">{{ t.name }}</el-tag>
      </div>

      <div v-if="emotionCycle.emotions && emotionCycle.emotions.length" class="detail-card">
        <p class="sd-label">Emotions</p>
        <el-tag v-for="e in emotionCycle.emotions" :key="e.id" size="medium" type="warning">{{ e.name }}</el-tag>
      </div>

      <template v-if="emotionCycle.sensations">
        <div v-for="(items, zone) in emotionCycle.sensations" v-if="items && items.length" :key="zone" class="detail-card">
          <p class="sd-label">{{ zone | sensationLabel }}</p>
          <el-tag v-for="s in items" :key="s.id" size="medium">{{ s.name }}</el-tag>
        </div>
      </template>

      <div v-if="emotionCycle.thoughts && emotionCycle.thoughts.length" class="detail-card">
        <p class="sd-label">Thoughts</p>
        <el-tag v-for="t in emotionCycle.thoughts" :key="t.id" size="medium" type="info">{{ t.name }}</el-tag>
      </div>

      <div v-if="emotionCycle.behaviors && emotionCycle.behaviors.length" class="detail-card">
        <p class="sd-label">Behaviors</p>
        <el-tag v-for="b in emotionCycle.behaviors" :key="b.id" size="medium" type="info">{{ b.name }}</el-tag>
      </div>
    </div>

  </div>
</template>

<script>
import emotionCycleService from '@/services/emotionCycle'
import waves from '@/directive/waves'
import { parseTime, parseDate, parseSession } from '@/utils'

export default {
  name: 'EmotionCycleDetail',
  directives: { waves },
  filters: {
    sensationLabel (zone) {
      const map = {
        head: 'Head, Face, Throat, Neck',
        chest: 'Chest, Heart, Breathing',
        abdomen: 'Abdomen',
        arm: 'Arms',
        leg: 'Legs',
        wholebody: 'Whole Body'
      }
      return map[zone] || zone
    }
  },
  data () {
    return {
      emotionCycle: {},
      downloadLoading: false,
      loading: true
    }
  },
  created () {
    this.getEmotionCycleById(this.$route.params.id)
  },
  methods: {
    getEmotionCycleById (id) {
      this.$loading()
      emotionCycleService.getEmotionCycleById(id)
        .then(res => {
          this.emotionCycle = res
          this.loading = false
          this.$loading().close()
        })
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Time', 'First Name', 'Last Name', 'Session', 'Triggers', 'Emotions', 'Head/Face/Throat/Neck', 'Chest/Heart/Breathing', 'Abdomen', 'Arms', 'Legs', 'Whole Body', 'Thoughts', 'Behaviors']
        const fmt = arr => arr && arr.length ? arr.map(v => v.name).join(', ') : ''
        const s = this.emotionCycle.sensations || {}
        excel.export_json_to_excel({
          header: tHeader,
          data: [[
            parseDate(new Date(this.emotionCycle.createdAt)),
            parseTime(new Date(this.emotionCycle.createdAt)),
            this.emotionCycle.secret ? 'Private' : this.emotionCycle.firstName,
            this.emotionCycle.secret ? 'Private' : this.emotionCycle.lastName,
            parseSession(this.emotionCycle.session),
            fmt(this.emotionCycle.triggers),
            fmt(this.emotionCycle.emotions),
            fmt(s.head), fmt(s.chest), fmt(s.abdomen), fmt(s.arm), fmt(s.leg), fmt(s.wholebody),
            fmt(this.emotionCycle.thoughts),
            fmt(this.emotionCycle.behaviors)
          ]],
          filename: 'Emotional Cycle Detail',
          wsname: 'Emotional Cycle Detail'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>
