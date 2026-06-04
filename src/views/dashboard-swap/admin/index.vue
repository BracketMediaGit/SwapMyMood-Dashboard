<template>
  <div class="dashboard-container">
    <date-picker v-on="$listeners" />
    <panel-group />

    <div class="chart-card">
      <div class="chart-card__header">
        <span class="chart-card__title">Monthly Activity</span>
        <el-radio-group v-model="chartPeriod" size="mini" :disabled="!monthlyStats.length">
          <el-radio-button :label="3">3M</el-radio-button>
          <el-radio-button :label="6">6M</el-radio-button>
          <el-radio-button :label="12">12M</el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="!monthlyStats.length" class="chart-placeholder">
        <div class="chart-placeholder__spinner" />
        <span>Loading monthly data…</span>
      </div>
      <line-chart v-else height="350px" :period="chartPeriod" />
    </div>

    <div v-if="!loading" class="chart-card">
      <div class="chart-card__header">
        <span class="chart-card__title">Overall Totals</span>
      </div>
      <bar-chart />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import DatePicker from './components/DatePicker'

export default {
  name: 'DashboardAdmin',
  components: { PanelGroup, BarChart, LineChart, DatePicker },
  props: {
    loading: { type: Boolean }
  },
  data () {
    return { chartPeriod: 12 }
  },
  computed: {
    ...mapGetters(['monthlyStats'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #304156;
  }
}

.chart-placeholder {
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #8a94a6;
  font-size: 13px;

  &__spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e4e7ed;
    border-top-color: #FEC171;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
