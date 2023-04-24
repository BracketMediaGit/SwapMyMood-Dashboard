<template>
  <div class="dashboard-container">
    <admin-dashboard :loading="loading" @change="clearData" @filter="filterData" />
  </div>
</template>

<script>
// import { Loading } from 'element-ui'
import { mapMutations, mapGetters } from 'vuex'
import statisticsService from '@/services/statistics'
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
      statisticsService.getStatistics()
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
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
      statisticsService.getStatisticsByDate({ fromDate, toDate })
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
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
