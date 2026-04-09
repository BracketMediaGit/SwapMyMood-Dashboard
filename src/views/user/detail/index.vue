<template>
  <div v-loading="loading" class="app-container">
    <div class="filter-container">
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
      <el-button v-if="isLinkedAccount" class="filter-item" type="danger" icon="el-icon-connection" @click="handleUnlink">
        Unlink Account
      </el-button>
    </div>

    <el-row>
      <h1>SWAPS</h1>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="swaps"
        border
        fit
        highlight-current-row
        height="15rem"
      >
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
        <el-table-column label="Problem" prop="problem" align="center">
          <template slot-scope="{row}">
            <span>{{ row.problem ? row.problem.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Emotional Cycle" prop="emotionCycle" align="center">
          <template slot-scope="{row}">
            <el-button v-if="row.emotionCycle" size="mini" type="success" @click="goToEcDetail(row.emotionCycle.id)">
              YES
            </el-button>
            <el-button v-else disabled type="danger" size="mini">
              NO
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="goToSwapDetails(row.id)">
              VIEW DETAILS
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row>
      <h1>EMOTIONAL CYCLES</h1>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="emotionCycles"
        border
        fit
        highlight-current-row
        height="15rem"
      >
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
        <el-table-column label="Action" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="goToEcDetail(row.id)">
              VIEW DETAILS
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userService from '@/services/user'
import waves from '@/directive/waves'
import { parseTime, parseDate, parseSession } from '@/utils'
import DatePicker from '@/components/DatePicker'

export default {
  name: 'UserDetail',
  components: { DatePicker },
  directives: { waves },
  data () {
    return {
      swaps: [],
      emotionCycles: [],
      firstName: '',
      lastName: '',
      secret: false,
      activeFilter: false,
      activePagination: false,
      tableKey: 0,
      total: 0,
      listLoading: false,
      listQuery: {
        start: 0,
        page: 1,
        limit: 20,
        sortBy: 'desc'
      },
      sortOptions: [
        { label: 'Date Time Ascending', key: 'asc' },
        { label: 'Date Time Descending', key: 'desc' }
      ],
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'detail',
      'survey',
      'roles'
    ]),
    isLinkedAccount () {
      return this.roles.includes('linkedAccount')
    }
  },
  created () {
    if (!this.survey.template.length) this.$store.dispatch('survey/getData')
    this.getData()
  },
  methods: {
    getStatementValue (statements, name) {
      const statement = statements.find(s => s.name === name)
      if (statement) return statement.value
      return ''
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
    goToSwapDetails (id) {
      this.$router.push(`/swap/detail/${id}`)
    },
    getData () {
      this.loading = true
      const id = this.$route.params.id
      userService.getUserDetailsById(id)
        .then(res => {
          console.log(res)
          this.firstName = res.firstName
          this.lastName = res.lastName
          this.secret = res.secret
          this.swaps = res.swaps
          this.emotionCycles = res.emotionCycles
          this.$store.dispatch('detail/setData', { swaps: res.swaps, emotionCycles: res.emotionCycles })
          this.loading = false
        })
    },
    clearFilter () {
      this.loading = true
      delete this.listQuery.fromDate
      delete this.listQuery.toDate
      this.$emit('clear', '')
      this.swaps = this.detail.swaps
      this.emotionCycles = this.detail.emotionCycles
      this.loading = false
    },
    handleFilter () {
      this.loading = true
      let swaps = []
      let emotionCycles = []

      swaps = this.sortChange(this.detail.swaps, this.listQuery.sortBy)
      emotionCycles = this.sortChange(this.detail.emotionCycles, this.listQuery.sortBy)

      if (this.listQuery.fromDate && this.listQuery.toDate) {
        swaps = this.filterByDate(swaps)
        emotionCycles = this.filterByDate(emotionCycles)
      }

      this.swaps = swaps
      this.emotionCycles = emotionCycles
      this.loading = false
    },
    filterByDate (data) {
      return data.filter(e => {
        return (new Date(e.createdAt).getTime() >= this.listQuery.fromDate && new Date(e.createdAt).getTime() <= this.listQuery.toDate)
      })
    },
    sortChange (data, order) {
      if (order === 'desc') {
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else {
        return data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      }
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const swapHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Problem', 'Alternatives', 'Are you Satisfied?', "Yes, I'm Satisfied", 'Notes', 'Emotional Cycle']
        const emotionCycleHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Triggers', 'Emotions', 'Head, Face, Throat, Neck Sensations', 'Chest, Heart, Breathing Sensations', 'Abdomen Sensations', 'Arm Sensations', 'Leg Sensations', 'Whole Body Sensations', 'Thoughts', 'Behaviors']
        const filterSwapVal = ['id', 'firstName', 'lastName', 'date', 'time', 'session', 'problem', 'alternatives', 'satisfactionLevel', 'satisfaction', 'notes', 'emotionCycle']
        const filterEcVal = ['id', 'firstName', 'lastName', 'date', 'time', 'session', 'trigger', 'emotion', 'head', 'chest', 'abdomen', 'arm', 'leg', 'wholebody', 'thought', 'behavior']
        const swaps = this.formatSwapJson(filterSwapVal)
        const ecs = this.formatEc(filterEcVal)
        excel.export_multiple_json_to_excel({
          header: [swapHeader, emotionCycleHeader],
          data: [
            swaps,
            ecs
          ],
          filename: 'User Detail',
          wsname: ['SWAPS', 'Emotional Cycles']
        })
        this.downloadLoading = false
      })
    },
    formatSwapJson (filterVal) {
      return this.swaps.map(v => filterVal.map(j => {
        if (j === 'id') return this.$route.params.id
        if ((j === 'firstName' || j === 'lastName') && this.secret) return 'Private'
        if (j === 'firstName') return this.firstName
        if (j === 'lastName') return this.lastName
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'problem') return v.problem.name
        if (j === 'alternatives') return v.alternatives.map(a => a.name)
        if (j === 'satisfactionLevel') return v.satisfactionLevels.find(s => s.selected).name
        if (j === 'satisfaction') return v.satisfactions.filter(s => s.selected).map(s => s.name)
        if (j === 'notes') return v.notes.map(n => n.name)
        if (j === 'emotionCycle') {
          if (v[j]) return 'YES'
          return 'NO'
        }
        return v[j]
      }))
    },
    formatEc (filterVal) {
      return this.emotionCycles.map(v => filterVal.map(j => {
        if (j === 'id') return this.$route.params.id
        if ((j === 'firstName' || j === 'lastName') && this.secret) return 'Private'
        if (j === 'firstName') return this.firstName
        if (j === 'lastName') return this.lastName
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'trigger') return this.formatEcJson(v.triggers)
        if (j === 'emotion') return this.formatEcJson(v.emotions)
        if (j === 'head') return this.formatEcJson(v.sensations.head)
        if (j === 'chest') return this.formatEcJson(v.sensations.chest)
        if (j === 'abdomen') return this.formatEcJson(v.sensations.abdomen)
        if (j === 'arm') return this.formatEcJson(v.sensations.arm)
        if (j === 'leg') return this.formatEcJson(v.sensations.leg)
        if (j === 'wholebody') return this.formatEcJson(v.sensations.wholebody)
        if (j === 'thought') return this.formatEcJson(v.thoughts)
        if (j === 'behavior') return this.formatEcJson(v.behaviors)
      }))
    },
    formatEcJson (filterVal) {
      if (filterVal && filterVal.length) return filterVal.map(v => v.name)
      return ''
    },
    handleUnlink () {
      this.$confirm('Are you sure you want to unlink this account? This action cannot be undone.', 'Warning', {
        confirmButtonText: 'Yes, Unlink',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$loading()
        const linkedAccountsService = require('@/services/linkedAccounts').default
        const userId = this.$route.params.id
        userService.getUserDetailsById(userId)
          .then(user => {
            if (user.linkedAccountId) {
              linkedAccountsService.unlinkAccount(user.linkedAccountId)
                .then(() => {
                  this.$message({
                    type: 'success',
                    message: 'Account unlinked successfully'
                  })
                  this.$router.push('/user/index')
                  this.$loading().close()
                })
                .catch(() => {
                  this.$loading().close()
                })
            } else {
              this.$message({
                type: 'error',
                message: 'Could not find linked account information'
              })
              this.$loading().close()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Unlink cancelled'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
