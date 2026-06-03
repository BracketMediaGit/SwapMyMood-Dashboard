<template>
  <div class="dashboard-container">
    <admin-dashboard :loading="loading" @change="clearData" @filter="filterData" />
  </div>
</template>

<script>
// import { Loading } from 'element-ui'
import { mapMutations, mapGetters } from 'vuex'
import statisticsService from '@/services/statistics'
import linkedAccountsService from '@/services/linkedAccounts'
import adminDashboard from './admin'

export default {
  name: 'Dashboard',
  components: { adminDashboard },
  data () {
    return {
      filter: false,
      loading: false,
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'statistics',
      'monthlyStats'
    ])
  },
  created () {
    if (!this.statistics.usersCount) this.getStatistics()
    if (this.monthlyStats.length < 12) this.getMonthlyStats()
  },
  beforeRouteLeave (to, from, next) {
    if (this.filter) this['statistics/SET_STATISTICS']({})
    next()
  },
  methods: {
    ...mapMutations([
      'statistics/SET_STATISTICS',
      'statistics/SET_MONTHLY_STATS'
    ]),
    getMonthlyStats () {
      const numMonths = 12
      const now = new Date()
      const months = []
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const from = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
        const to = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime()
        const raw = d.toLocaleString('en-US', { month: 'long' })
        const label = raw.charAt(0).toUpperCase() + raw.slice(1)
        months.push({ label, from, to })
      }
      Promise.all(
        months.map(m =>
          Promise.all([
            statisticsService.getStatisticsByDate({ fromDate: m.from, toDate: m.to }),
            linkedAccountsService.getLinkingMetrics({ fromDate: m.from, toDate: m.to })
          ]).then(([stats, linking]) => ({
            month: m.label,
            users: stats.usersCount || 0,
            linkedAccounts: linking.totalLinkedAccountsCount || 0,
            swaps: stats.swapsCount || 0,
            emotionCycles: stats.emotionCyclesCount || 0
          }))
        )
      ).then(data => {
        this['statistics/SET_MONTHLY_STATS'](data)
      }).catch(() => {})
    },
    getStatistics () {
      this.$loading()
      this.loading = true
      Promise.all([
        statisticsService.getStatistics(),
        linkedAccountsService.getLinkingMetrics()
      ])
        .then(([stats, linkingMetrics]) => {
          this['statistics/SET_STATISTICS']({
            ...stats,
            ...linkingMetrics
          })
          this.loading = false
          this.$loading().close()
        })
        .catch(() => {
          this.loading = false
          this.$loading().close()
        })
    },
    filterData (data) {
      this.$loading()
      this.filter = true
      this.loading = true
      const fromDate = data[0].getTime()
      let toDate = data[1].getTime()
      if (fromDate === toDate) toDate = data[1].setHours(23, 59, 59)
      
      Promise.all([
        statisticsService.getStatisticsByDate({ fromDate, toDate }),
        linkedAccountsService.getLinkingMetrics({ fromDate, toDate })
      ])
        .then(([stats, linkingMetrics]) => {
          this['statistics/SET_STATISTICS']({
            ...stats,
            ...linkingMetrics
          })
          this.loading = false
          this.$loading().close()
        })
        .catch(() => {
          this.loading = false
          this.$loading().close()
        })
    },
    clearData (data) {
      if (!data) return this.getStatistics()
    }
  }
}
</script>
