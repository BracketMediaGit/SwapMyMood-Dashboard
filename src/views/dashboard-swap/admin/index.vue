<template>
  <div class="dashboard-editor-container">
    <date-picker v-on="$listeners" />
    <panel-group />
    <el-row v-if="!loading" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import DatePicker from './components/DatePicker'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    DatePicker
  },
  props: {
    loading: {
      type: Boolean
    }
  },
  data () {
    return {}
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
