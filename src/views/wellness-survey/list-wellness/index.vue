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
      :data="survey.surveys"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- @sort-change="sortChange" -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="First Name">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Name">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | parseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Time" align="center">
        <template slot-scope="{row}">
          <span>{{ new Date(row.createdAt) | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Session" align="center">
        <template slot-scope="{row}">
          <span>{{ row.session | parseSession }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="t in survey.template" :key="t.id" :label="t.name" :prop="t.name" align="center">
        <template slot-scope="{row}">
          <span>{{ getStatementValue(row.statements, t.name) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Overall Score" prop="score" align="center">
        <template slot-scope="{row}">
          <span>{{ Math.ceil(row.score) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getSurveys" />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import surveyService from '@/services/survey'
import statisticsService from '@/services/statistics'
import waves from '@/directive/waves'
import { parseTime, parseDate, parseSession } from '@/utils'
import Pagination from '@/components/Pagination'
import DatePicker from '@/components/DatePicker'

export default {
  name: 'WellnessSurvey',
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
        { label: 'Date Time Ascending', key: 'createdAt asc' },
        { label: 'Date Time Descending', key: 'createdAt desc' }
      ],
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'survey',
      'statistics'
    ])
  },
  created () {
    if (!this.statistics.surveysCount) {
      this.getStatistics()
    } else {
      this.total = this.statistics.surveysCount
    }
    if (!this.survey.template.length) this.$store.dispatch('survey/getData')
    if (!this.survey.surveys.length) this.getSurveys()
  },
  beforeRouteLeave (to, from, next) {
    if (this.activePagination || this.activeFilter) this['survey/SET_SURVEYS']([])
    next()
  },
  methods: {
    ...mapMutations([
      'survey/SET_SURVEYS',
      'statistics/SET_STATISTICS'
    ]),
    getStatementValue (statements, name) {
      const statement = statements.find(s => s.name === name)
      if (statement) return statement.value
      return ''
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
      this.$router.push(`/survey/detail/${id}`)
    },
    getStatistics () {
      statisticsService.getStatistics()
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
          this.total = res.surveysCount
        })
    },
    getSurveys (data) {
      if (data) {
        this.listQuery.start = data.start
        this.activePagination = true
      }
      this.listLoading = true
      surveyService.getSurveys(this.listQuery)
        .then(surveys => {
          this['survey/SET_SURVEYS'](surveys)
          if (this.activeFilter) {
            this.total = surveys.length
          } else {
            this.total = this.statistics.surveysCount
          }
          this.listLoading = false
        })
    },
    clearFilter () {
      this.activeFilter = false
      this.listQuery.firstName = ''
      this.listQuery.lastName = ''
      this.listQuery.sortBy = 'createdAt desc'
      delete this.listQuery.fromDate
      delete this.listQuery.toDate
      this.$emit('clear', '')
      this.getSurveys()
    },
    handleFilter () {
      this.activeFilter = true
      if (this.listQuery.firstName === '' && this.listQuery.lastName === '' && !this.listQuery.fromDate) this.activeFilter = false
      this.listQuery.page = 1
      this.getSurveys()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const questions = this.survey.template.map(q => q.name)
        const tHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', ...questions, 'Overall Score']
        const filterVal = ['id', 'firstName', 'lastName', 'date', 'time', 'session', ...questions, 'score']
        const data = this.formatJson(filterVal, questions)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'List Wellness Survey',
          wsname: 'Wellness Surveys'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal, questions) {
      return this.survey.surveys.map(v => filterVal.map(j => {
        if (j === 'id') return v.userId
        if ((j === 'firstName' || j === 'lastName') && v.secret) return 'Private'
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (questions.includes(j)) {
          return this.getStatementValue(v.statements, j)
        }
        return v[j]
      }))
    }
  }
}
</script>
