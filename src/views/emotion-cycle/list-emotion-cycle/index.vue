<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.firstName" placeholder="First Name" style="width: 15%;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lastName" placeholder="Last Name" style="width: 15%;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sortBy" style="width: 15%" class="filter-item">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <date-picker class="filter-item" style="width: 20%;" @change="setDatePickerData" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves class="filter-item" type="danger" icon="el-icon-close" @click="clearFilter">
        Clear
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="emotionCycle.emotionCycles"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column label="Date" width="150px" align="center" prop="createdAt" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | parseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" width="120px" align="center" prop="createdAt" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="First Name" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Name" min-width="120px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Session" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.session | parseSession }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="goToDetails(row.id)">
            VIEW DETAILS
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getEmotionCycles" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import emotionCycleService from '@/services/emotionCycle'
import statisticsService from '@/services/statistics'
import waves from '@/directive/waves' // waves directive
import { parseTime, parseDate, parseSession } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DatePicker from '@/components/DatePicker'

export default {
  name: 'EmotionCycles',
  components: { Pagination, DatePicker },
  directives: { waves },
  data () {
    return {
      activeFilter: false,
      activePagination: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      listQuery: {
        firstName: '',
        lastName: '',
        start: 0,
        page: 1,
        limit: 20,
        sortBy: 'createdAt desc'
      },
      sortOptions: [
        { label: 'Date Time Descending', key: 'createdAt desc' },
        { label: 'Date Time Ascending', key: 'createdAt asc' }
      ],
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'emotionCycle',
      'statistics'
    ])
  },
  created () {
    if (!this.statistics.emotionCyclesCount) {
      this.getStatistics()
    } else {
      this.total = this.statistics.emotionCyclesCount
    }
    if (!this.emotionCycle.emotionCycles.length) this.getEmotionCycles()
  },
  beforeRouteLeave (to, from, next) {
    if (this.activePagination || this.activeFilter) this['emotionCycle/SET_EC']([])
    next()
  },
  methods: {
    ...mapMutations([
      'emotionCycle/SET_EC',
      'statistics/SET_STATISTICS'
    ]),
    setDatePickerData (data) {
      if (data) {
        if (data[0].getTime() === data[1].getTime()) {
          this.listQuery.fromDate = data[0].getTime()
          this.listQuery.toDate = data[1].setHours(23, 59, 59)
        } else {
          this.listQuery.fromDate = data[0].getTime()
          this.listQuery.toDate = data[1].getTime()
        }
      } else {
        delete this.listQuery.fromDate
        delete this.listQuery.toDate
      }
    },
    goToDetails (id) {
      this.$router.push(`/emotioncycle/detail/${id}`)
    },
    getStatistics () {
      statisticsService.getStatistics()
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
        })
    },
    getEmotionCycles (data) {
      if (data) {
        this.listQuery.start = data.start
        this.activePagination = true
      }
      this.listLoading = true
      emotionCycleService.getEmotionCycles(this.listQuery)
        .then(ec => {
          this['emotionCycle/SET_EC'](ec)
          if (this.activeFilter) {
            this.total = ec.length
          } else {
            this.total = this.statistics.emotionCyclesCount
          }
          this.listLoading = false
        })
    },
    handleFilter () {
      this.activeFilter = true
      if (this.listQuery.firstName === '' && this.listQuery.lastName === '' && !this.listQuery.fromDate) this.activeFilter = false
      this.listQuery.page = 1
      this.getEmotionCycles()
    },
    clearFilter () {
      this.activeFilter = false
      this.listQuery.firstName = ''
      this.listQuery.lastName = ''
      this.listQuery.sortBy = 'createdAt desc'
      delete this.listQuery.fromDate
      delete this.listQuery.toDate
      this.$emit('clear', '')
      this.getEmotionCycles()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Time', 'First Name', 'Last Name', 'Session', 'Triggers', 'Emotions', 'Head, Face, Throat, Neck Sensations', 'Chest, Heart, Breathing Sensations', 'Abdomen Sensations', 'Arm Sensations', 'Leg Sensations', 'Whole Body Sensations', 'Thoughts', 'Behaviors']
        const filterVal = ['date', 'time', 'firstName', 'lastName', 'session', 'trigger', 'emotion', 'head', 'chest', 'abdomen', 'arm', 'leg', 'wholebody', 'thought', 'behavior']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'List Emotional Cycles',
          wsname: 'Emotional Cycles'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal) {
      return this.emotionCycle.emotionCycles.map(v => filterVal.map(j => {
        if ((j === 'firstName' || j === 'lastName') && v.secret) return 'Private'
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'trigger') return this.formatEcJson(v.triggers)
        if (j === 'emotion') return this.formatEcJson(v.emotions)
        if (j === 'head') return this.formatEcJson(v.sensations && v.sensations.head)
        if (j === 'chest') return this.formatEcJson(v.sensations && v.sensations.chest)
        if (j === 'abdomen') return this.formatEcJson(v.sensations && v.sensations.abdomen)
        if (j === 'arm') return this.formatEcJson(v.sensations && v.sensations.arm)
        if (j === 'leg') return this.formatEcJson(v.sensations && v.sensations.leg)
        if (j === 'wholebody') return this.formatEcJson(v.sensations && v.sensations.wholebody)
        if (j === 'thought') return this.formatEcJson(v.thoughts)
        if (j === 'behavior') return this.formatEcJson(v.behaviors)
        return v[j]
      }))
    },
    formatEcJson (filterVal) {
      if (filterVal && filterVal.length) return filterVal.map(v => v.name).join(', ')
      return ''
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'createdAt') {
        this.listQuery.sortBy = `${prop} ${order === 'ascending' ? 'asc' : 'desc'}`
        this.getEmotionCycles()
      }
    }
  }
}
</script>
