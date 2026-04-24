<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.firstName" placeholder="First Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lastName" placeholder="Last Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sortBy" class="filter-item filter-item--select">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <date-picker class="filter-item filter-item--date" @change="setDatePickerData" />
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
      :data="swap.swaps"
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
      <el-table-column label="Problem" prop="problem" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.problem ? row.problem.name : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Satisfied?" prop="satisfied" width="110px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <el-tag v-if="getSatisfied(row) === 'Yes'" type="success" size="small">Yes</el-tag>
          <el-tag v-else-if="getSatisfied(row) === 'No'" type="danger" size="small">No</el-tag>
          <el-tag v-else type="warning" size="small">Maybe</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Emotional Cycle" prop="emotionCycle" width="150px" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.emotionCycle" size="mini" type="success" @click="goToEcDetail(row.emotionCycle)">
            YES
          </el-button>
          <el-button v-else disabled type="danger" size="mini">
            NO
          </el-button>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getSwaps" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import swapService from '@/services/swap'
import statisticsService from '@/services/statistics'
import waves from '@/directive/waves' // waves directive
import { parseTime, parseDate, parseSession } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DatePicker from '@/components/DatePicker'

export default {
  name: 'Swaps',
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
        { label: 'Date Time Ascending', key: 'createdAt asc' },
        { label: 'Satisfaction Level Ascending (Yes -> No)', key: 'satisfactionLevelOrder asc' },
        { label: 'Satisfaction Level Descending (No -> Yes)', key: 'satisfactionLevelOrder desc' }
      ],
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'swap',
      'statistics'
    ])
  },
  created () {
    if (!this.statistics.swapsCount) {
      this.getStatistics()
    } else {
      this.total = this.statistics.swapsCount
    }
    if (!this.swap.swaps.length) this.getSwaps()
  },
  beforeRouteLeave (to, from, next) {
    if (this.activePagination || this.activeFilter) this['swap/SET_SWAPS']([])
    next()
  },
  methods: {
    ...mapMutations([
      'swap/SET_SWAPS',
      'statistics/SET_STATISTICS'
    ]),
    goToEcDetail (id) {
      this.$router.push(`/emotioncycle/detail/${id}`)
    },
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
      this.$router.push(`/swap/detail/${id}`)
    },
    getStatistics () {
      statisticsService.getStatistics()
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
        })
    },
    getSwaps (data) {
      if (data) {
        this.listQuery.start = data.start
        this.activePagination = true
      }
      this.listLoading = true
      swapService.querySwaps(this.listQuery)
        .then(swaps => {
          this['swap/SET_SWAPS'](swaps)
          if (this.activeFilter) {
            this.total = swaps.length
          } else {
            this.total = this.statistics.swapsCount
          }
          this.listLoading = false
        })
    },
    handleFilter () {
      this.activeFilter = true
      if (this.listQuery.firstName === '' && this.listQuery.lastName === '' && !this.listQuery.fromDate) this.activeFilter = false
      this.listQuery.page = 1
      this.listQuery.start = 0
      this.getSwaps()
    },
    clearFilter () {
      this.activeFilter = false
      this.listQuery.firstName = ''
      this.listQuery.lastName = ''
      this.listQuery.sortBy = 'createdAt desc'
      delete this.listQuery.fromDate
      delete this.listQuery.toDate
      this.$emit('clear', '')
      this.listQuery.page = 1
      this.listQuery.start = 0
      this.getSwaps()
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'createdAt') this.sortByDate(order)
      if (prop === 'satisfied') this.sortBySatisfied(order)
    },
    sortByDate (order) {
      if (order === 'ascending') {
        this.listQuery.sortBy = 'createdAt asc'
      } else {
        this.listQuery.sortBy = 'createdAt desc'
      }
      this.handleFilter()
    },
    sortBySatisfied (order) {
      if (order === 'ascending') {
        this.listQuery.sortBy = 'satisfactionLevelOrder asc'
      } else {
        this.listQuery.sortBy = 'satisfactionLevelOrder desc'
      }
      this.handleFilter()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Time', 'First Name', 'Last Name', 'Session', 'Problem', 'Satisfied?', 'Emotional Cycle', 'Alternatives', 'Are you Satisfied?', "Yes, I'm Satisfied", 'Notes']
        const filterVal = ['date', 'time', 'firstName', 'lastName', 'session', 'problem', 'satisfied', 'emotionCycle', 'alternatives', 'satisfactionLevel', 'satisfaction', 'notes']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'List SWAPS',
          wsname: 'SWAPS'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal) {
      return this.swap.swaps.map(v => filterVal.map(j => {
        if ((j === 'firstName' || j === 'lastName') && v.secret) return 'Private'
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'problem') return v.problem ? v.problem.name : ''
        if (j === 'satisfied') {
          if (this.getSatisfied(v) === 'Yes') return 'Yes'
          if (this.getSatisfied(v) === 'No') return 'No'
          return 'Maybe'
        }
        if (j === 'alternatives') return v.alternatives ? v.alternatives.map(a => a.name).join(', ') : ''
        if (j === 'satisfactionLevel') {
          if (v.satisfactionLevels) {
            const selected = v.satisfactionLevels.find(s => s.selected)
            return selected ? selected.name : ''
          }
          return ''
        }
        if (j === 'satisfaction') return v.satisfactions ? v.satisfactions.filter(s => s.selected).map(s => s.name).join(', ') : ''
        if (j === 'notes') return v.notes ? v.notes.map(n => n.name).join(', ') : ''
        if (j === 'emotionCycle') {
          if (v[j]) return 'YES'
          return 'NO'
        }
        return v[j]
      }))
    },
    getSatisfied (row) {
      if (row.satisfactionLevels && row.satisfactionLevels.length > 0) {
        const selected = row.satisfactionLevels.find(level => level.selected)
        if (selected) {
          const name = selected.name.toLowerCase()
          if (name.includes('yes') || name.includes('satisfied')) return 'Yes'
          if (name.includes('no') || name.includes('not')) return 'No'
          return 'Maybe'
        }
      }
      return 'Maybe'
    }
  }
}
</script>
