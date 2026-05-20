<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!-- Terms & Conditions -->
      <el-col :span="24" style="margin-bottom: 30px;">
        <el-card>
          <div slot="header" class="card-header">
            <span>Terms &amp; Conditions</span>
            <span v-if="terms.updatedAt" class="updated-at">Last updated: {{ terms.updatedAt | formatDate }}</span>
          </div>
          <el-input
            v-model="terms.content"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="Enter Terms & Conditions content..."
            :disabled="terms.loading"
          />
          <div class="save-row">
            <el-button
              type="primary"
              :loading="terms.saving"
              :disabled="terms.loading"
              @click="saveTerms"
            >
              Save Terms &amp; Conditions
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- Privacy Policy -->
      <el-col :span="24">
        <el-card>
          <div slot="header" class="card-header">
            <span>Privacy Policy</span>
            <span v-if="privacy.updatedAt" class="updated-at">Last updated: {{ privacy.updatedAt | formatDate }}</span>
          </div>
          <el-input
            v-model="privacy.content"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="Enter Privacy Policy content..."
            :disabled="privacy.loading"
          />
          <div class="save-row">
            <el-button
              type="primary"
              :loading="privacy.saving"
              :disabled="privacy.loading"
              @click="savePrivacy"
            >
              Save Privacy Policy
            </el-button>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import legalService from '@/services/legal'

export default {
  name: 'Legal',
  filters: {
    formatDate (ms) {
      if (!ms) return ''
      return new Date(ms).toLocaleString()
    }
  },
  data () {
    return {
      terms: { content: '', updatedAt: null, loading: false, saving: false },
      privacy: { content: '', updatedAt: null, loading: false, saving: false }
    }
  },
  created () {
    this.loadTerms()
    this.loadPrivacy()
  },
  methods: {
    loadTerms () {
      this.terms.loading = true
      legalService.getTerms()
        .then(res => {
          this.terms.content = res.content || ''
          this.terms.updatedAt = res.updatedAt || null
        })
        .catch(() => {})
        .finally(() => { this.terms.loading = false })
    },
    loadPrivacy () {
      this.privacy.loading = true
      legalService.getPrivacy()
        .then(res => {
          this.privacy.content = res.content || ''
          this.privacy.updatedAt = res.updatedAt || null
        })
        .catch(() => {})
        .finally(() => { this.privacy.loading = false })
    },
    saveTerms () {
      this.terms.saving = true
      legalService.updateTerms(this.terms.content)
        .then(res => {
          this.terms.updatedAt = res.updatedAt || null
          Message.success('Terms & Conditions saved')
        })
        .catch(err => {
          Message.error((err && err.detail) || 'Error saving Terms & Conditions')
        })
        .finally(() => { this.terms.saving = false })
    },
    savePrivacy () {
      this.privacy.saving = true
      legalService.updatePrivacy(this.privacy.content)
        .then(res => {
          this.privacy.updatedAt = res.updatedAt || null
          Message.success('Privacy Policy saved')
        })
        .catch(err => {
          Message.error((err && err.detail) || 'Error saving Privacy Policy')
        })
        .finally(() => { this.privacy.saving = false })
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.updated-at {
  font-size: 12px;
  color: #909399;
}
.save-row {
  margin-top: 16px;
  text-align: right;
}
</style>
