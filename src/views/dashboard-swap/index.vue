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
      'statistics'
    ])
  },
  created () {
    if (!this.statistics.usersCount) this.getStatistics()
  },
  beforeRouteLeave (to, from, next) {
    if (this.filter) this['statistics/SET_STATISTICS']({})
    next()
  },
  methods: {
    ...mapMutations([
      'statistics/SET_STATISTICS'
    ]),
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
