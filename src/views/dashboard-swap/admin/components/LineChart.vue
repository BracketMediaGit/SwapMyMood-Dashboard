<template>
  <div :class="className" :style="{height:height,width:width}" ref="chart" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons')
import resize from './mixins/resize'
import { mapGetters } from 'vuex'

export default {
  mixins: [resize],
  props: {
    className: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '350px' },
    period: { type: Number, default: 12 }
  },
  data () {
    return { chart: null }
  },
  computed: {
    ...mapGetters(['monthlyStats']),
    visibleData () {
      if (!this.monthlyStats || !this.monthlyStats.length) return []
      return this.monthlyStats.slice(-this.period)
    }
  },
  watch: {
    visibleData (val) {
      if (val && val.length && this.chart) this.setOptions(val)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.chart = echarts.init(this.$refs.chart, 'macarons')
      if (this.visibleData.length) this.setOptions(this.visibleData)
    })
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    setOptions (data) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          padding: [5, 10]
        },
        legend: {
          data: ['Users', 'Linked Accounts', 'SWAPS', 'Emotional Cycles']
        },
        grid: {
          left: 10,
          right: 30,
          bottom: 20,
          top: 40,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(d => d.month),
          boundaryGap: false,
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          axisTick: { show: false }
        },
        series: [
          {
            name: 'Users',
            type: 'line',
            smooth: true,
            data: data.map(d => d.users),
            itemStyle: { normal: { color: '#409EFF', lineStyle: { color: '#409EFF', width: 2 } } },
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'Linked Accounts',
            type: 'line',
            smooth: true,
            data: data.map(d => d.linkedAccounts),
            itemStyle: { normal: { color: '#67C23A', lineStyle: { color: '#67C23A', width: 2 } } },
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'SWAPS',
            type: 'line',
            smooth: true,
            data: data.map(d => d.swaps),
            itemStyle: { normal: { color: '#FEC171', lineStyle: { color: '#FEC171', width: 2 } } },
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'Emotional Cycles',
            type: 'line',
            smooth: true,
            data: data.map(d => d.emotionCycles),
            itemStyle: { normal: { color: '#F56C6C', lineStyle: { color: '#F56C6C', width: 2 } } },
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
