<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.firstName" size="small" placeholder="First Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.lastName" size="small" placeholder="Last Name" class="filter-item filter-item--input" @keyup.enter.native="handleFilter" />
      <el-select v-if="activeTab === 'users'" v-model="listQuery.sortBy" size="small" class="filter-item filter-item--select" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves size="small" class="filter-item" icon="el-icon-search" @click="handleFilter">Search</el-button>
      <el-button v-waves size="small" class="filter-item" icon="el-icon-close" @click="clearFilter">Clear</el-button>
      <el-button v-if="activeTab === 'users'" v-waves size="small" class="filter-item" icon="el-icon-download" :loading="downloadLoading" @click="handleDownload">Export</el-button>
      <div class="filter-actions">
        <el-button v-if="activeTab === 'users'" size="small" type="success" icon="el-icon-user" @click="showCreateUserDialog = true">Create User</el-button>
        <el-button v-if="isRoot && activeTab === 'admins'" size="small" type="danger" icon="el-icon-key" @click="showCreateDialog = true">Create Admin</el-button>
      </div>
    </div>

    <!-- Create User Dialog -->
    <el-dialog title="Create User" :visible.sync="showCreateUserDialog" width="420px" @closed="resetCreateUserForm">
      <el-form ref="createUserForm" :model="createUserForm" :rules="createRules" label-position="top" size="small">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="createUserForm.firstName" placeholder="First Name" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="createUserForm.lastName" placeholder="Last Name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="createUserForm.email" placeholder="email@example.com" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="createUserForm.password" type="password" placeholder="Password" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="showCreateUserDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="createUserLoading" @click="handleCreateUser">Create</el-button>
      </span>
    </el-dialog>

    <!-- Create Admin Dialog -->
    <el-dialog title="Create Admin User" :visible.sync="showCreateDialog" width="420px" @closed="resetCreateForm">
      <el-form ref="createForm" :model="createForm" :rules="createRules" label-position="top" size="small">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="createForm.firstName" placeholder="First Name" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="createForm.lastName" placeholder="Last Name" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="createForm.email" placeholder="email@example.com" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="createForm.password" type="password" placeholder="Password" show-password />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" @click="showCreateDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="createLoading" @click="handleCreateAdmin">Create</el-button>
      </span>
    </el-dialog>

    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="Users" name="users">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="users"
          fit
          highlight-current-row
          class="clickable-table"
          style="width: 100%;"
          @row-click="row => goToDetails(row.id)"
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
          <el-table-column label="Email" min-width="200px">
            <template slot-scope="{row}">
              <span>{{ row.secret ? '—' : row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="isRoot" label="Role" width="140px" align="center">
            <template slot-scope="{row}">
              <el-tag v-if="row.role && row.role.name === 'root'" type="danger" size="small">Root</el-tag>
              <el-tag v-else-if="row.role && row.role.name === 'linkedAccount'" type="warning" size="small">Linked Account</el-tag>
              <el-tag v-else type="primary" size="small">App User</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="!isLinkedAccount" label="Has Linked Account" width="170px" align="center">
            <template slot-scope="{row}">
              <template v-if="row.role && row.role.name === 'linkedAccount'">
                <span>N/A</span>
              </template>
              <template v-else>
                <el-tag v-if="row.hasActiveLinks" type="success" size="small">
                  <svg-icon icon-class="link" style="margin-right: 4px;" />
                  Linked
                </el-tag>
                <el-tag v-else type="info" size="small">No</el-tag>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="SWAP" prop="swap" width="180px" align="center" sortable="custom">
            <template slot-scope="{row}">
              <template v-if="row.role && row.role.name === 'linkedAccount'">
                <span>N/A</span>
              </template>
              <template v-else-if="isLinkedAccount">
                <span>{{ row.swapsCount }} ({{ row.sharedSwapsCount }} shared)</span>
              </template>
              <template v-else>
                <span>{{ row.swapsCount }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Emotional Cycles" prop="emotionCycle" width="220px" align="center" sortable="custom">
            <template slot-scope="{row}">
              <template v-if="row.role && row.role.name === 'linkedAccount'">
                <span>N/A</span>
              </template>
              <template v-else-if="isLinkedAccount">
                <span>{{ row.emotionCyclesCount }} ({{ row.sharedEmotionCyclesCount }} shared)</span>
              </template>
              <template v-else>
                <span>{{ row.emotionCyclesCount }}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column v-if="isLinkedAccount" label="Action" align="center" width="120" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="danger" size="mini" @click.stop="handleUnlink(row.id, row.linkedAccountId)">Unlink</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUsers" />
      </el-tab-pane>

      <el-tab-pane v-if="isRoot" label="Admins" name="admins">
        <el-table
          v-loading="adminLoading"
          :data="adminList"
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="First Name" min-width="150px">
            <template slot-scope="{row}">{{ row.firstName }}</template>
          </el-table-column>
          <el-table-column label="Last Name" min-width="150px">
            <template slot-scope="{row}">{{ row.lastName }}</template>
          </el-table-column>
          <el-table-column label="Email" min-width="200px">
            <template slot-scope="{row}">{{ row.email }}</template>
          </el-table-column>
          <el-table-column label="Actions" align="center" width="220">
            <template slot-scope="{row}">
              <el-button size="mini" icon="el-icon-lock" @click="openResetAdmin(row)">Reset Password</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDeleteAdmin(row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- Reset Admin Password Dialog -->
    <el-dialog title="Reset Password" :visible.sync="showResetAdminDialog" width="380px">
      <p style="margin:0 0 8px;color:#606266;font-size:13px;">Send a password reset email to:</p>
      <p style="margin:0;font-weight:600;font-size:14px;color:#1a202c;">{{ resetAdminEmail }}</p>
      <span slot="footer">
        <el-button size="small" @click="showResetAdminDialog = false">Cancel</el-button>
        <el-button size="small" type="primary" :loading="resetAdminLoading" @click="handleResetAdmin">Send Email</el-button>
      </span>
    </el-dialog>

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
      activeTab: 'users',
      adminList: [],
      adminLoading: false,
      showResetAdminDialog: false,
      resetAdminEmail: '',
      resetAdminLoading: false,
      downloadLoading: false,
      showCreateUserDialog: false,
      createUserLoading: false,
      createUserForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      showCreateDialog: false,
      createLoading: false,
      createForm: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      createRules: {
        firstName: [{ required: true, message: 'Required', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Required', trigger: 'blur' }],
        email: [
          { required: true, message: 'Required', trigger: 'blur' },
          { type: 'email', message: 'Invalid email', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Required', trigger: 'blur' },
          { min: 6, message: 'Min 6 characters', trigger: 'blur' }
        ]
      }
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
    },
    isRoot () {
      return this.roles.includes('root')
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
      this.listQuery.page = 1
      this.listQuery.start = 0
      this.getUsers()
    },
    handleFilter () {
      this.listQuery.page = 1
      this.listQuery.start = 0
      if (this.activeTab === 'admins') {
        this.getAdmins()
      } else {
        this.getUsers()
      }
    },
    handleTabChange (tab) {
      if (tab.name === 'admins' && !this.adminList.length) this.getAdmins()
    },
    getAdmins () {
      this.adminLoading = true
      const params = { role: 'root' }
      if (this.listQuery.firstName) params.firstName = this.listQuery.firstName
      if (this.listQuery.lastName) params.lastName = this.listQuery.lastName
      userService.queryUsers(params)
        .then(admins => { this.adminList = admins })
        .catch(err => { this.$message.error((err && err.detail) || 'Error loading admins') })
        .finally(() => { this.adminLoading = false })
    },
    openResetAdmin (row) {
      this.resetAdminEmail = row.email
      this.showResetAdminDialog = true
    },
    handleResetAdmin () {
      this.resetAdminLoading = true
      userService.resetPassword(this.resetAdminEmail)
        .then(() => {
          this.$message.success('Password reset email sent')
          this.showResetAdminDialog = false
        })
        .catch(err => {
          this.$message.error((err && err.detail) || 'Error sending reset email')
        })
        .finally(() => { this.resetAdminLoading = false })
    },
    handleDeleteAdmin (row) {
      const name = `${row.firstName} ${row.lastName}`
      this.$confirm(
        `This will permanently delete the admin account for ${name}. Continue?`,
        'Delete Admin',
        { confirmButtonText: 'Yes, Delete', cancelButtonText: 'Cancel', type: 'error' }
      ).then(() => {
        return userService.deleteUser(row.id)
      }).then(() => {
        this.$message.success('Admin deleted')
        this.adminList = this.adminList.filter(a => a.id !== row.id)
      }).catch(err => {
        if (err === 'cancel') return
        this.$message.error((err && err.detail) || 'Error deleting admin')
      })
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
      Promise.all([
        import('@/vendor/Export2Excel'),
        userService.queryUsers({ ...this.listQuery, start: 0, limit: 10000 })
      ]).then(([excel, allUsers]) => {
        const tHeader = ['First Name', 'Last Name', 'Email', 'Has Linked Account', 'Swaps', 'Emotion Cycles']
        const filterVal = ['firstName', 'lastName', 'email', 'hasActiveLinks', 'swapsCount', 'emotionCyclesCount']
        const data = this.formatJson(filterVal, allUsers)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'List Users',
          wsname: 'Users'
        })
      }).finally(() => {
        this.downloadLoading = false
      })
    },
    formatJson (filterVal, users) {
      return (users || this.users).map(v => filterVal.map(j => {
        if (j === 'firstName' && v.secret) return 'Secret'
        if (j === 'lastName' && v.secret) return 'Secret'
        if (j === 'email' && v.secret) return '—'
        if (j === 'hasActiveLinks') return v.hasActiveLinks ? 'Yes' : 'No'
        return v[j]
      }))
    },
    getSortClass (key) {
      return this.listQuery.sort === `+${key}` ? 'ascending' : 'descending'
    },
    resetCreateUserForm () {
      this.createUserForm = { firstName: '', lastName: '', email: '', password: '' }
      this.$refs.createUserForm && this.$refs.createUserForm.resetFields()
    },
    handleCreateUser () {
      this.$refs.createUserForm.validate(valid => {
        if (!valid) return
        this.createUserLoading = true
        userService.createRegularUser(this.createUserForm)
          .then(() => {
            this.$message.success('User created successfully')
            this.showCreateUserDialog = false
            this.getUsers()
          })
          .catch(err => {
            this.$message.error((err && err.detail) || 'Error creating user')
          })
          .finally(() => {
            this.createUserLoading = false
          })
      })
    },
    resetCreateForm () {
      this.createForm = { firstName: '', lastName: '', email: '', password: '' }
      this.$refs.createForm && this.$refs.createForm.resetFields()
    },
    handleCreateAdmin () {
      this.$refs.createForm.validate(valid => {
        if (!valid) return
        this.createLoading = true
        userService.createUser(this.createForm)
          .then(() => {
            this.$message.success('Admin user created successfully')
            this.showCreateDialog = false
            this.activeTab = 'admins'
            this.getAdmins()
          })
          .catch(err => {
            this.$message.error((err && err.detail) || 'Error creating user')
          })
          .finally(() => {
            this.createLoading = false
          })
      })
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

<style scoped>
.filter-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
</style>
