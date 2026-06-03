<template>
  <div class="dashboard-editor-container">
    <date-picker v-on="$listeners" />
    <panel-group />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:16px;">
        <span style="font-weight:bold;color:#304156;font-size:14px;">Monthly Activity</span>
        <el-radio-group v-model="chartPeriod" size="mini">
          <el-radio-button :label="3">3M</el-radio-button>
          <el-radio-button :label="6">6M</el-radio-button>
          <el-radio-button :label="12">12M</el-radio-button>
        </el-radio-group>
      </div>
      <line-chart height="350px" :period="chartPeriod" />
    </el-row>
    <el-row v-if="!loading" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div style="padding:0 0 16px;font-weight:bold;color:#304156;font-size:14px;">Overall Totals</div>
      <bar-chart />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import LineChart from './components/LineChart'
import DatePicker from './components/DatePicker'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    LineChart,
    DatePicker
  },
  props: {
    loading: {
      type: Boolean
    }
  },
  data () {
    return {
      chartPeriod: 12
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
