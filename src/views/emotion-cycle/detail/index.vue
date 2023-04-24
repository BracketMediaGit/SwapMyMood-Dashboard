<template>
  <div v-if="!loading" class="app-container">
    <div class="filter-container">
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-row>
      <h2>Triggers</h2>
      <el-tag v-for="t in emotionCycle.triggers" :key="t.id">  {{ t.name }} </el-tag>
    </el-row>
    <el-row>
      <h2>Emotions</h2>
      <el-tag v-for="e in emotionCycle.emotions" :key="e.id">  {{ e.name }} </el-tag>
    </el-row>
    <el-row>
      <h2>Sensations</h2>
      <template v-for="(sensations, key) in emotionCycle.sensations">
        <h3 :key="key">{{ key | sensationsName | uppercaseFirst }}</h3>
        <el-tag v-for="s in sensations" :key="s.id">  {{ s.name }} </el-tag>
      </template>
    </el-row>
    <el-row>
      <h2>Thoughts</h2>
      <el-tag v-for="t in emotionCycle.thoughts" :key="t.id">  {{ t.name }} </el-tag>
    </el-row>
    <el-row>
      <h2>Behaviors</h2>
      <el-tag v-for="b in emotionCycle.behaviors" :key="b.id">  {{ b.name }} </el-tag>
    </el-row>
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
    sensationsName (name) {
      if (name === 'head') return 'Head, Face, Throat, Neck'
      if (name === 'chest') return 'Chest, Heart, Breathing'
      if (name === 'wholebody') return 'Whole Body'
      return name
    }
  },
  data () {
    return {
      emotionCycle: {},
      downloadLoading: false,
      loading: false
    }
  },
  computed: {

  },
  created () {
    const id = this.$route.params.id
    this.getEmotionCycleById(id)
  },
  methods: {
    getEmotionCycleById (id) {
      this.loading = true
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
        const tHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Triggers', 'Emotions', 'Head, Face, Throat, Neck Sensations', 'Chest, Heart, Breathing Sensations', 'Abdomen Sensations', 'Arm Sensations', 'Leg Sensations', 'Whole Body Sensations', 'Thoughts', 'Behaviors']
        excel.export_json_to_excel({
          header: tHeader,
          data: [
            [
              this.emotionCycle.userId,
              this.emotionCycle.secret ? 'Private' : this.emotionCycle.firstName,
              this.emotionCycle.secret ? 'Private' : this.emotionCycle.lastName,
              parseDate(new Date(this.emotionCycle.createdAt)),
              parseTime(new Date(this.emotionCycle.createdAt)),
              parseSession(this.emotionCycle.session),
              this.formatJson(this.emotionCycle.triggers),
              this.formatJson(this.emotionCycle.emotions),
              this.formatJson(this.emotionCycle.sensations.head),
              this.formatJson(this.emotionCycle.sensations.chest),
              this.formatJson(this.emotionCycle.sensations.abdomen),
              this.formatJson(this.emotionCycle.sensations.arm),
              this.formatJson(this.emotionCycle.sensations.leg),
              this.formatJson(this.emotionCycle.sensations.wholebody),
              this.formatJson(this.emotionCycle.thoughts),
              this.formatJson(this.emotionCycle.behaviors)
            ]
          ],
          filename: 'Emotion Cycle Detail',
          wsname: 'Emotion Cycle Detail'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal) {
      if (filterVal && filterVal.length) return filterVal.map(v => v.name)
      return ''
    }
  }
}
</script>

<style lang="scss">
.el-tag {
  margin: .1rem;
}
</style>
