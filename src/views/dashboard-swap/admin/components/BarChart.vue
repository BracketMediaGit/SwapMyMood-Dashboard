<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { mapGetters } from 'vuex'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    ...mapGetters([
      'statistics'
    ])
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el)

      const colors = ['#409EFF', '#67C23A', '#E65D6E', '#d4900a', '#30B08F']
      const labels = ['Users', 'SWAPS', 'Emotional Cycles', 'Users w/ Linked', 'Total Linked']
      const values = [
        this.statistics.usersCount || 0,
        this.statistics.swapsCount || 0,
        this.statistics.emotionCyclesCount || 0,
        this.statistics.usersWithLinkedAccountsCount || 0,
        this.statistics.totalLinkedAccountsCount || 0
      ]

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: '#fff',
          borderColor: '#e4e7ed',
          borderWidth: 1,
          textStyle: { color: '#374151', fontFamily: 'Inter, sans-serif', fontSize: 12 },
          formatter: params => `<b>${params[0].name}</b><br/>${params[0].value.toLocaleString()}`
        },
        grid: {
          top: 16,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: labels,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: '#e4e7ed' } },
          axisLabel: { color: '#64748b', fontFamily: 'Inter, sans-serif', fontSize: 11 }
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#f1f5f9' } },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { color: '#64748b', fontFamily: 'Inter, sans-serif', fontSize: 11 }
        }],
        series: [{
          name: 'Total',
          type: 'bar',
          barMaxWidth: 56,
          barCategoryGap: '40%',
          data: values.map((value, i) => ({
            value,
            itemStyle: {
              color: colors[i],
              borderRadius: [6, 6, 0, 0],
              opacity: 0.9
            },
            emphasis: {
              itemStyle: { opacity: 1 }
            }
          })),
          animationDuration: 1200,
          animationEasing: 'cubicOut'
        }]
      })
    }
  }
}
</script>
