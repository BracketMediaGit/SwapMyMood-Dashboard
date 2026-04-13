<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.firstName" placeholder="First Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lastName" placeholder="Last Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.sortBy" style="width: 15%" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
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
      :data="users"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="First Name" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.firstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Last Name" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.secret ? 'Private' : row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isLinkedAccount" label="Has Linked Account" width="170px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.hasActiveLinks" type="success" size="small">
            <svg-icon icon-class="link" style="margin-right: 4px;" />
            Linked
          </el-tag>
          <el-tag v-else type="info" size="small">No</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="SWAP" prop="swap" width="110px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.swapsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Emotional Cycles" prop="emotionCycle" width="150px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.emotionCyclesCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="goToDetails(row.id)">
            VIEW USER
          </el-button>
          <el-button v-if="isLinkedAccount" type="danger" size="mini" @click="handleUnlink(row.id, row.linkedAccountId)">
            UNLINK
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUsers" />

  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import userService from '@/services/user'
import statisticsService from '@/services/statistics'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Users',
  components: { Pagination },
  directives: { waves },
  data () {
    return {
      activePagination: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        start: 0,
        page: 1,
        limit: 20,
        firstName: '',
        lastName: '',
        sortBy: 'swapsCount asc'
      },
      sortOptions: [
        { label: 'SWAPS Ascending', key: 'swapsCount asc' },
        { label: 'SWAPS Descending', key: 'swapsCount desc' },
        { label: 'Emotional Cycles Ascending', key: 'emotionCyclesCount asc' },
        { label: 'Emotional Cycles Descending', key: 'emotionCyclesCount desc' }
      ],
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'users',
      'statistics',
      'roles'
    ]),
    isLinkedAccount () {
      return this.roles.includes('linkedAccount')
    }
  },
  created () {
    if (!this.isLinkedAccount) { // only root must see statistics
      if (!this.statistics.usersCount) {
        this.getStatistics()
      } else {
        this.total = this.statistics.usersCount
      }
    }
    if (!this.users.length) this.getUsers()
  },
  beforeRouteLeave (to, from, next) {
    if (this.activePagination) this['user/SET_USERS']([])
    next()
  },
  methods: {
    ...mapMutations([
      'user/SET_USERS',
      'statistics/SET_STATISTICS'
    ]),
    goToDetails (id) {
      this.$router.push(`/user/detail/${id}`)
    },
    getStatistics () {
      statisticsService.getStatistics()
        .then(res => {
          this['statistics/SET_STATISTICS'](res)
          this.total = res.usersCount
        })
    },
    getUsers (data) {
      if (data) {
        this.listQuery.start = data.start
        this.activePagination = data.activePagination
      }
      this.listLoading = true
      userService.queryUsers(this.listQuery)
        .then(users => {
          this['user/SET_USERS'](users)
          this.listLoading = false
        })
    },
    clearFilter () {
      this.listQuery.firstName = ''
      this.listQuery.lastName = ''
      this.listQuery.sortBy = 'swapsCount asc'
      this.getUsers()
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getUsers()
    },
    handleModifyStatus (row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'swap') this.sortBySwap(order)
      if (prop === 'emotionCycle') this.sortByEmotionCycle(order)
    },
    sortBySwap (order) {
      if (order === 'ascending') {
        this.listQuery.sortBy = 'swapsCount asc'
      } else {
        this.listQuery.sortBy = 'swapsCount desc'
      }
      this.handleFilter()
    },
    sortByEmotionCycle (order) {
      if (order === 'ascending') {
        this.listQuery.sortBy = 'emotionCyclesCount asc'
      } else {
        this.listQuery.sortBy = 'emotionCyclesCount desc'
      }
      this.handleFilter()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['First Name', 'Last Name', 'Has Linked Account', 'Swaps', 'Emotion Cycles']
        const filterVal = ['firstName', 'lastName', 'hasActiveLinks', 'swapsCount', 'emotionCyclesCount']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'List Users',
          wsname: 'Users'
        })
        this.downloadLoading = false
      })
    },
    formatJson (filterVal) {
      return this.users.map(v => filterVal.map(j => {
        if (j === 'firstName' && v.secret) return 'Secret'
        if (j === 'lastName' && v.secret) return 'Secret'
        if (j === 'hasActiveLinks') return v.hasActiveLinks ? 'Yes' : 'No'
        return v[j]
      }))
    },
    getSortClass (key) {
      return this.listQuery.sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleUnlink (userId, linkedAccountId) {
      this.$confirm('Are you sure you want to unlink this account? This action cannot be undone.', 'Warning', {
        confirmButtonText: 'Yes, Unlink',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$loading()
        const linkedAccountsService = require('@/services/linkedAccounts').default
        linkedAccountsService.unlinkAccount(linkedAccountId)
          .then(() => {
            this.$message({
              type: 'success',
              message: 'Account unlinked successfully'
            })
            this.getUsers()
            this.$loading().close()
          })
          .catch(() => {
            this.$loading().close()
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
