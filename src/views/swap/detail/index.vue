<template>
  <div v-if="!loading" class="app-container">

    <div class="filter-container">
      <el-button size="small" icon="el-icon-arrow-left" @click="$router.back()">Back</el-button>
      <el-button v-waves size="small" :loading="downloadLoading" class="filter-item" icon="el-icon-download" @click="handleDownload">Export</el-button>
    </div>

    <div class="detail-header">
      <div class="detail-header__name">
        {{ swap.secret ? 'Private User' : `${swap.firstName} ${swap.lastName}` }}
      </div>
      <div class="detail-header__meta">
        {{ new Date(swap.createdAt) | parseDate }} · {{ new Date(swap.createdAt) | parseTime }} · Session {{ swap.session }}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-card">
        <p class="sd-label">Problem</p>
        <el-tag size="medium" type="primary">{{ swap.problem ? swap.problem.name : '—' }}</el-tag>
      </div>

      <div v-if="swap.alternatives && swap.alternatives.length" class="detail-card">
        <p class="sd-label">Alternatives</p>
        <el-tag v-for="alt in swap.alternatives" :key="alt.id" size="medium">{{ alt.name }}</el-tag>
      </div>

      <div class="detail-card">
        <p class="sd-label">Satisfaction</p>
        <el-tag size="medium" :type="satisfiedType">{{ satisfactionLevel }}</el-tag>
      </div>

      <div v-if="satisfaction.length" class="detail-card">
        <p class="sd-label">I'm satisfied because</p>
        <el-tag v-for="s in satisfaction" :key="s.id" size="medium" type="success">{{ s.name }}</el-tag>
      </div>

      <div v-if="swap.notes && swap.notes.length" class="detail-card">
        <p class="sd-label">Notes</p>
        <el-tag v-for="note in swap.notes" :key="note.id" size="medium" type="info">{{ note.name }}</el-tag>
      </div>

      <div class="detail-card">
        <p class="sd-label">Emotional Cycle</p>
        <el-tag size="medium" :type="swap.emotionCycle ? 'success' : 'info'">
          {{ swap.emotionCycle ? 'Associated' : 'None' }}
        </el-tag>
      </div>
    </div>

  </div>
</template>

<script>
import swapService from '@/services/swap'
import waves from '@/directive/waves'
import { parseTime, parseDate, parseSession } from '@/utils'

export default {
  name: 'SwapDetail',
  directives: { waves },
  data () {
    return {
      swap: {},
      downloadLoading: false,
      loading: true
    }
  },
  computed: {
    satisfaction () {
      if (!this.swap.satisfactions) return []
      return this.swap.satisfactions.filter(s => s.selected)
    },
    satisfactionLevel () {
      if (!this.swap.satisfactionLevels || !this.swap.satisfactionLevels.length) return 'N/A'
      const selected = this.swap.satisfactionLevels.find(s => s.selected)
      return selected ? selected.name : 'N/A'
    },
    satisfiedType () {
      const n = this.satisfactionLevel.toLowerCase()
      if (n.includes('yes') || n.includes('satisfied')) return 'success'
      if (n.includes('no') || n.includes('not')) return 'danger'
      return 'warning'
    }
  },
  created () {
    this.getSwapById(this.$route.params.id)
  },
  methods: {
    getSwapById (id) {
      this.$loading()
      swapService.getSwapById(id)
        .then(res => {
          this.swap = res
          this.loading = false
          this.$loading().close()
        })
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Time', 'First Name', 'Last Name', 'Session', 'Problem', 'Satisfied?', 'Emotional Cycle', 'Alternatives', "Are you Satisfied?", "Yes, I'm Satisfied", 'Notes']
        excel.export_json_to_excel({
          header: tHeader,
          data: [[
            parseDate(new Date(this.swap.createdAt)),
            parseTime(new Date(this.swap.createdAt)),
            this.swap.secret ? 'Private' : this.swap.firstName,
            this.swap.secret ? 'Private' : this.swap.lastName,
            parseSession(this.swap.session),
            this.swap.problem ? this.swap.problem.name : '',
            this.satisfactionLevel,
            this.swap.emotionCycle ? 'YES' : 'NO',
            this.swap.alternatives ? this.swap.alternatives.map(a => a.name).join(', ') : '',
            this.satisfactionLevel,
            this.satisfaction.map(s => s.name).join(', '),
            this.swap.notes ? this.swap.notes.map(n => n.name).join(', ') : ''
          ]],
          filename: 'SWAP Detail',
          wsname: 'SWAP Detail'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.detail-header {
  padding: 20px 0 24px;

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: #1a202c;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  &__meta {
    font-size: 13px;
    color: #8a94a6;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.detail-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  .el-tag {
    margin: 4px 6px 4px 0;
  }
}
</style>
