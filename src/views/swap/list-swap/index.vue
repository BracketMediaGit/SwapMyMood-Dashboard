<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.firstName" size="small" placeholder="First Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lastName" size="small" placeholder="Last Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sortBy" size="small" class="filter-item filter-item--select">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <date-picker class="filter-item filter-item--date" @change="setDatePickerData" />
      <el-button v-waves size="small" class="filter-item" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button v-waves size="small" class="filter-item" icon="el-icon-close" @click="clearFilter">Clear</el-button>
      <el-button v-waves size="small" :loading="downloadLoading" class="filter-item" icon="el-icon-download" @click="handleDownload">Export</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="swap.swaps"
      fit
      highlight-current-row
      class="clickable-table"
      @row-click="openDrawer"
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
          <span>{{ row.secret ? 'Private' : row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Name" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.secret ? 'Private' : row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Session" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.session | parseSession }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Problem" prop="problem" min-width="120px">
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
      <el-table-column label="Emotional Cycle" prop="emotionCycle" width="140px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.emotionCycle" type="success" size="small">Yes</el-tag>
          <el-tag v-else type="info" size="small">No</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getSwaps" />

    <!-- Swap Detail Drawer -->
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      size="460px"
      :before-close="closeDrawer"
      :show-close="true"
    >
      <div slot="title" class="sd-header">
        <div class="sd-header__info">
          <span class="sd-header__name">{{ drawerTitle }}</span>
          <span v-if="drawerData" class="sd-header__meta">
            {{ new Date(drawerData.createdAt) | parseDate }} · {{ new Date(drawerData.createdAt) | parseTime }} · Session {{ drawerData.session }}
          </span>
        </div>
        <el-button v-if="drawerItemId" size="mini" plain icon="el-icon-top-right" @click="goToDetails(drawerItemId)">Full page</el-button>
      </div>

      <div v-if="drawerLoading" class="sd-loading">
        <i class="el-icon-loading" />
      </div>
      <div v-else-if="drawerData" class="sd-body">
        <div class="sd-section">
          <p class="sd-label">Problem</p>
          <el-tag size="medium" type="primary">{{ drawerData.problem ? drawerData.problem.name : '—' }}</el-tag>
        </div>

        <div v-if="drawerData.alternatives && drawerData.alternatives.length" class="sd-section">
          <p class="sd-label">Alternatives</p>
          <el-tag v-for="a in drawerData.alternatives" :key="a.id" size="medium">{{ a.name }}</el-tag>
        </div>

        <div class="sd-section">
          <p class="sd-label">Satisfaction</p>
          <el-tag size="medium" :type="drawerSatisfied === 'Yes' ? 'success' : drawerSatisfied === 'No' ? 'danger' : 'warning'">
            {{ drawerSatisfactionLevel }}
          </el-tag>
        </div>

        <div v-if="drawerSatisfactions.length" class="sd-section">
          <p class="sd-label">I'm satisfied because</p>
          <el-tag v-for="s in drawerSatisfactions" :key="s.id" size="medium" type="success">{{ s.name }}</el-tag>
        </div>

        <div v-if="drawerData.notes && drawerData.notes.length" class="sd-section">
          <p class="sd-label">Notes</p>
          <el-tag v-for="n in drawerData.notes" :key="n.id" size="medium" type="info">{{ n.name }}</el-tag>
        </div>

        <div v-if="drawerData.emotionCycle" class="sd-section">
          <p class="sd-label">Emotional Cycle</p>
          <el-tag size="medium" type="success">Has associated emotional cycle</el-tag>
        </div>
      </div>
    </el-drawer>
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
      downloadLoading: false,
      drawerVisible: false,
      drawerLoading: false,
      drawerData: null,
      drawerItemId: null
    }
  },
  computed: {
    ...mapGetters(['swap', 'statistics']),
    drawerTitle () {
      if (!this.drawerData) return 'SWAP'
      return this.drawerData.secret ? 'Private' : `${this.drawerData.firstName} ${this.drawerData.lastName}`
    },
    drawerSatisfied () {
      if (!this.drawerData) return ''
      if (!this.drawerData.satisfactionLevels) return 'Maybe'
      const s = this.drawerData.satisfactionLevels.find(l => l.selected)
      if (!s) return 'Maybe'
      const n = s.name.toLowerCase()
      if (n.includes('yes') || n.includes('satisfied')) return 'Yes'
      if (n.includes('no') || n.includes('not')) return 'No'
      return 'Maybe'
    },
    drawerSatisfactionLevel () {
      if (!this.drawerData || !this.drawerData.satisfactionLevels) return 'N/A'
      const s = this.drawerData.satisfactionLevels.find(l => l.selected)
      return s ? s.name : 'N/A'
    },
    drawerSatisfactions () {
      if (!this.drawerData || !this.drawerData.satisfactions) return []
      return this.drawerData.satisfactions.filter(s => s.selected)
    }
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
    openDrawer (row) {
      this.drawerItemId = row.id
      this.drawerVisible = true
      this.drawerLoading = true
      this.drawerData = null
      swapService.getSwapById(row.id)
        .then(res => { this.drawerData = res })
        .finally(() => { this.drawerLoading = false })
    },
    closeDrawer () {
      this.drawerVisible = false
      this.drawerData = null
      this.drawerItemId = null
    },
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

