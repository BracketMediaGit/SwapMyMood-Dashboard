<template>
  <div v-if="!loading" class="app-container">
    <div class="filter-container">
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-row>
      <h2>Problem</h2>
      <el-tag>{{ swap.problem.name }}</el-tag>
    </el-row>
    <el-row v-if="swap.alternatives.length">
      <h2>Alternatives</h2>
      <el-tag v-for="alt in swap.alternatives" :key="alt.id">  {{ alt.name }} </el-tag>
    </el-row>
    <el-row>
      <h2>Are you Satisfied?</h2>
      <el-tag>  {{ satisfactionLevel }} </el-tag>
    </el-row>
    <el-row v-if="satisfaction.length">
      <h2>Yes, I'm Satisfied</h2>
      <el-tag v-for="s in satisfaction" :key="s.id"> {{ s.name }} </el-tag>
    </el-row>
    <el-row v-if="swap.notes.length">
      <h2>Notes</h2>
      <el-tag v-for="note in swap.notes" :key="note.id"> {{ note.name }} </el-tag>
    </el-row>
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
      loading: false
    }
  },
  computed: {
    satisfaction () {
      return this.swap.satisfactions.filter(s => s.selected)
    },
    satisfactionLevel () {
      return this.swap.satisfactionLevels.find(s => s.selected).name
    },
    emotionCycle () {
      if (this.swap.emotionCycle) return 'YES'
      return 'NO'
    }
  },
  created () {
    const id = this.$route.params.id
    this.getSwapById(id)
  },
  methods: {
    getSwapById (id) {
      this.loading = true
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
        const tHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Problem', 'Emotional Cycle', 'Alternatives', 'Are you Satisfied?', "Yes, I'm Satisfied", 'Notes']
        excel.export_json_to_excel({
          header: tHeader,
          data: [
            [
              this.swap.userId,
              this.swap.secret ? 'Private' : this.swap.firstName,
              this.swap.secret ? 'Private' : this.swap.lastName,
              parseDate(new Date(this.swap.createdAt)),
              parseTime(new Date(this.swap.createdAt)),
              parseSession(this.swap.session),
              this.swap.problem.name,
              this.emotionCycle,
              this.swap.alternatives.map(a => a.name),
              this.satisfactionLevel,
              this.satisfaction.map(s => s.name),
              this.swap.notes.map(n => n.name)
            ]
          ],
          filename: 'SWAPS Detail',
          wsname: 'SWAPS Detail'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.el-tag {
  margin: .1rem;
}
</style>
