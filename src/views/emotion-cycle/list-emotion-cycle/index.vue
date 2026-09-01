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
      :data="emotionCycle.emotionCycles"
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
      <el-table-column label="Session Length" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.session | parseSession }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Triggers" min-width="160px">
        <template slot-scope="{row}">
          <span>{{ formatEcJson(row.triggers) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="SWAPS" prop="swap" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.swap" type="success" size="small">Yes</el-tag>
          <el-tag v-else type="info" size="small">No</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getEmotionCycles" />

    <!-- EC Detail Drawer -->
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      size="500px"
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
        <div v-if="drawerData.triggers && drawerData.triggers.length" class="sd-section">
          <p class="sd-label">Triggers</p>
          <el-tag v-for="t in drawerData.triggers" :key="t.id" size="medium" type="danger">{{ t.name }}</el-tag>
        </div>

        <div v-if="drawerData.emotions && drawerData.emotions.length" class="sd-section">
          <p class="sd-label">Emotions</p>
          <el-tag v-for="e in drawerData.emotions" :key="e.id" size="medium" type="warning">{{ e.name }}</el-tag>
        </div>

        <template v-if="drawerData.sensations">
          <div v-for="(items, zone) in drawerData.sensations" v-if="items && items.length" :key="zone" class="sd-section">
            <p class="sd-label">{{ zone | sensationLabel }}</p>
            <el-tag v-for="s in items" :key="s.id" size="medium">{{ s.name }}</el-tag>
          </div>
        </template>

        <div v-if="drawerData.thoughts && drawerData.thoughts.length" class="sd-section">
          <p class="sd-label">Thoughts</p>
          <el-tag v-for="t in drawerData.thoughts" :key="t.id" size="medium" type="info">{{ t.name }}</el-tag>
        </div>

        <div v-if="drawerData.behaviors && drawerData.behaviors.length" class="sd-section">
          <p class="sd-label">Behaviors</p>
          <el-tag v-for="b in drawerData.behaviors" :key="b.id" size="medium" type="info">{{ b.name }}</el-tag>
        </div>
      </div>
    </el-drawer>
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
      downloadLoading: false,
      drawerVisible: false,
      drawerLoading: false,
      drawerData: null,
      drawerItemId: null
    }
  },
  filters: {
    sensationLabel (zone) {
      const map = {
        head: 'Head, Face, Throat, Neck',
        chest: 'Chest, Heart, Breathing',
        abdomen: 'Abdomen',
        arm: 'Arms',
        leg: 'Legs',
        wholebody: 'Whole Body'
      }
      return map[zone] || zone
    }
  },
  computed: {
    ...mapGetters(['emotionCycle', 'statistics']),
    drawerTitle () {
      if (!this.drawerData) return 'Emotional Cycle'
      return this.drawerData.secret ? 'Private' : `${this.drawerData.firstName} ${this.drawerData.lastName}`
    }
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
    openDrawer (row) {
      this.drawerItemId = row.id
      this.drawerVisible = true
      this.drawerLoading = true
      this.drawerData = null
      emotionCycleService.getEmotionCycleById(row.id)
        .then(res => { this.drawerData = res })
        .finally(() => { this.drawerLoading = false })
    },
    closeDrawer () {
      this.drawerVisible = false
      this.drawerData = null
      this.drawerItemId = null
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
      this.listQuery.start = 0
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
      this.listQuery.page = 1
      this.listQuery.start = 0
      this.getEmotionCycles()
    },
    handleDownload () {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Time', 'First Name', 'Last Name', 'Session Length', 'Triggers', 'SWAPS', 'Emotions', 'Sensations', 'Thoughts', 'Behaviors']
        const filterVal = ['date', 'time', 'firstName', 'lastName', 'session', 'trigger', 'swap', 'emotion', 'sensations', 'thought', 'behavior']
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
        if (j === 'swap') return v.swap ? 'YES' : 'NO'
        if (j === 'emotion') return this.formatEcJson(v.emotions)
        if (j === 'sensations') return this.formatSensations(v.sensations)
        if (j === 'thought') return this.formatEcJson(v.thoughts)
        if (j === 'behavior') return this.formatEcJson(v.behaviors)
        return v[j]
      }))
    },
    formatEcJson (filterVal) {
      if (filterVal && filterVal.length) return filterVal.map(v => v.name).join(', ')
      return ''
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
    sortChange (data) {
      const { prop, order } = data
      if (prop === 'createdAt') {
        this.listQuery.sortBy = `${prop} ${order === 'ascending' ? 'asc' : 'desc'}`
        this.listQuery.page = 1
        this.listQuery.start = 0
        this.getEmotionCycles()
      }
    }
  }
}
</script>

