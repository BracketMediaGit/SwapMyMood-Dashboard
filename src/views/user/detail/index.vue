<template>
  <div v-loading="loading" class="app-container">

    <div class="filter-container">
      <el-select v-model="listQuery.sortBy" size="small" class="filter-item filter-item--select">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <date-picker class="filter-item filter-item--date" @change="setDatePickerData" />
      <el-button v-waves size="small" class="filter-item" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button v-waves size="small" class="filter-item" icon="el-icon-close" @click="clearFilter">Clear</el-button>
      <el-button v-waves size="small" :loading="downloadLoading" class="filter-item" icon="el-icon-download" @click="handleDownload">Export</el-button>
      <el-button v-if="isLinkedAccount" size="small" class="filter-item" type="danger" plain icon="el-icon-connection" @click="handleUnlink">Unlink</el-button>
      <el-button v-if="!secret" size="small" class="filter-item" plain icon="el-icon-lock" @click="showResetDialog = true">Reset Password</el-button>
      <el-button v-if="isRoot" size="small" class="filter-item" type="danger" plain icon="el-icon-delete" @click="handleDeleteAccount">Delete Account</el-button>
    </div>

    <!-- Reset Password Dialog -->
    <el-dialog title="Reset Password" :visible.sync="showResetDialog" width="380px">
      <p style="margin:0 0 8px;color:#606266;font-size:13px;">Send a password reset email to:</p>
      <p style="margin:0;font-weight:600;font-size:14px;color:#1a202c;">{{ displayEmail || 'this user' }}</p>
      <span slot="footer">
        <el-button size="small" @click="showResetDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="resetLoading" @click="handleResetPassword">Send Email</el-button>
      </span>
    </el-dialog>

    <div class="user-header">
      <div class="user-header__name">
        {{ secret ? 'Private User' : `${firstName} ${lastName}` }}
        <el-tag v-if="!isLinkedAccount && hasActiveLinks" type="success" size="small" style="margin-left:10px;vertical-align:middle;">
          Linked
        </el-tag>
      </div>
      <div v-if="displayEmail" class="user-header__email">{{ displayEmail }}</div>
    </div>

    <div class="section-block">
      <div class="section-label">Swaps</div>
      <div class="table-responsive">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="swaps"
          fit
          highlight-current-row
          class="clickable-table"
          max-height="400"
          @row-click="row => goToSwapDetails(row.id)"
        >
          <el-table-column label="Date" align="center" min-width="95">
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
          <el-table-column label="Emotional Cycle" prop="emotionCycle" align="center" width="140">
            <template slot-scope="{row}">
              <el-tag v-if="row.emotionCycle" type="success" size="small" style="cursor:pointer" @click.native.stop="goToEcDetail(row.emotionCycle.id)">Yes</el-tag>
              <el-tag v-else type="info" size="small">No</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="section-block">
      <div class="section-label">Emotional Cycles</div>
      <div class="table-responsive">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="emotionCycles"
          fit
          highlight-current-row
          class="clickable-table"
          max-height="400"
          @row-click="row => goToEcDetail(row.id)"
        >
          <el-table-column label="Date" align="center" min-width="95">
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
        </el-table>
      </div>
    </div>

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
      email: '',
      secret: false,
      hasActiveLinks: false,
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
      downloadLoading: false,
      showResetDialog: false,
      resetLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'detail',
      'survey',
      'roles',
      'users'
    ]),
    isLinkedAccount () {
      return this.roles.includes('linkedAccount')
    },
    isRoot () {
      return this.roles.includes('root')
    },
    displayEmail () {
      if (this.secret) return ''
      if (this.email) return this.email
      const id = this.$route.params.id
      const found = this.users.find(u => u.id === id)
      return found ? found.email || '' : ''
    }
  },
  created () {
    if (!this.isLinkedAccount && !this.survey.template.length) this.$store.dispatch('survey/getData')
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
          this.email = res.email || ''
          this.secret = res.secret
          this.hasActiveLinks = res.hasActiveLinks || false
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
      const id = this.$route.params.id
      Promise.all([
        import('@/vendor/Export2Excel'),
        userService.getUserDetailsById(id)
      ]).then(([excel, freshData]) => {
        const swapHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Problem', 'Alternatives', 'Are you Satisfied?', "Yes, I'm Satisfied", 'Notes', 'Emotional Cycle']
        const emotionCycleHeader = ['Id', 'First Name', 'Last Name', 'Date', 'Time', 'Session', 'Triggers', 'Emotions', 'Sensations', 'Thoughts', 'Behaviors']
        const filterSwapVal = ['id', 'firstName', 'lastName', 'date', 'time', 'session', 'problem', 'alternatives', 'satisfactionLevel', 'satisfaction', 'notes', 'emotionCycle']
        const filterEcVal = ['id', 'firstName', 'lastName', 'date', 'time', 'session', 'trigger', 'emotion', 'sensations', 'thought', 'behavior']
        const swaps = this.formatSwapJson(filterSwapVal, freshData.swaps)
        const ecs = this.formatEc(filterEcVal, freshData.emotionCycles)
        excel.export_multiple_json_to_excel({
          header: [swapHeader, emotionCycleHeader],
          data: [swaps, ecs],
          filename: 'User Detail',
          wsname: ['SWAPS', 'Emotional Cycles']
        })
      }).finally(() => {
        this.downloadLoading = false
      })
    },
    formatSwapJson (filterVal, swaps) {
      return (swaps || this.swaps).map(v => filterVal.map(j => {
        if (j === 'id') return this.$route.params.id
        if ((j === 'firstName' || j === 'lastName') && this.secret) return 'Private'
        if (j === 'firstName') return this.firstName
        if (j === 'lastName') return this.lastName
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'problem') return v.problem ? v.problem.name : ''
        if (j === 'alternatives') return (v.alternatives || []).filter(a => a).map(a => a.name)
        if (j === 'satisfactionLevel') {
          // Un SWAP incompleto no tiene ningún satisfactionLevel seleccionado: celda vacía, no error.
          const selected = (v.satisfactionLevels || []).find(s => s && s.selected)
          return selected ? selected.name : ''
        }
        if (j === 'satisfaction') return (v.satisfactions || []).filter(s => s && s.selected).map(s => s.name)
        if (j === 'notes') return (v.notes || []).filter(n => n).map(n => n.name)
        if (j === 'emotionCycle') {
          if (v[j]) return 'YES'
          return 'NO'
        }
        return v[j]
      }))
    },
    formatEc (filterVal, emotionCycles) {
      return (emotionCycles || this.emotionCycles).map(v => filterVal.map(j => {
        if (j === 'id') return this.$route.params.id
        if ((j === 'firstName' || j === 'lastName') && this.secret) return 'Private'
        if (j === 'firstName') return this.firstName
        if (j === 'lastName') return this.lastName
        if (j === 'date') return parseDate(new Date(v.createdAt))
        if (j === 'time') return parseTime(new Date(v.createdAt))
        if (j === 'session') return parseSession(v.session)
        if (j === 'trigger') return this.formatEcJson(v.triggers)
        if (j === 'emotion') return this.formatEcJson(v.emotions)
        if (j === 'sensations') return this.formatSensations(v.sensations)
        if (j === 'thought') return this.formatEcJson(v.thoughts)
        if (j === 'behavior') return this.formatEcJson(v.behaviors)
      }))
    },
    formatSensations (sensations) {
      if (!sensations) return ''
      const zoneLabels = { head: 'head', face: 'face', chest: 'chest', abdomen: 'abdomen', arm: 'arm', leg: 'leg', wholebody: 'whole body' }
      // Recorre las zonas conocidas en orden y después cualquier otra que traiga el dato,
      // para no perder sensaciones de zonas viejas que ya no usa la app.
      const zones = [...Object.keys(zoneLabels), ...Object.keys(sensations).filter(z => !(z in zoneLabels))]
      const items = []
      zones.forEach(zone => {
        const zoneItems = sensations[zone]
        if (zoneItems && zoneItems.length) {
          zoneItems.forEach(s => items.push(`${String(s.name).trim()} (${zoneLabels[zone] || zone})`))
        }
      })
      return items.join(', ')
    },
    formatEcJson (filterVal) {
      if (filterVal && filterVal.length) return filterVal.map(v => v.name)
      return ''
    },
    handleResetPassword () {
      const email = this.displayEmail
      if (!email) {
        this.$message.error('No email available for this user')
        return
      }
      this.resetLoading = true
      userService.resetPassword(email)
        .then(() => {
          this.$message.success('Password reset email sent')
          this.showResetDialog = false
        })
        .catch(err => {
          this.$message.error((err && err.detail) || 'Error sending reset email')
        })
        .finally(() => {
          this.resetLoading = false
        })
    },
    handleDeleteAccount () {
      const name = this.secret ? 'this user' : `${this.firstName} ${this.lastName}`
      this.$confirm(
        `This action is irreversible. All data for ${name} will be permanently deleted, including their Firebase Auth account and all Firestore documents. Continue?`,
        'Delete Account',
        {
          confirmButtonText: 'Yes, Delete Permanently',
          cancelButtonText: 'Cancel',
          type: 'error'
        }
      ).then(() => {
        const id = this.$route.params.id
        return userService.deleteUser(id)
      }).then(() => {
        this.$message.success('Account permanently deleted')
        this.$router.push('/user/index')
      }).catch(err => {
        if (err === 'cancel') return
        this.$message.error((err && err.detail) || 'Error deleting account')
      })
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
.user-header {
  padding: 20px 0 16px;

  &__name {
    font-size: 20px;
    font-weight: 700;
    color: #1a202c;
    line-height: 1.3;
  }

  &__email {
    font-size: 13px;
    color: #8a94a6;
    margin-top: 4px;
  }
}

.section-block {
  margin-bottom: 24px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #8a94a6;
  margin-bottom: 10px;
}
</style>
