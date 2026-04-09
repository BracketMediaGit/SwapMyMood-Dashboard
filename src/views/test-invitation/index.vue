<template>
  <!-- ========================================================================== -->
  <!-- TESTING ONLY - DELETE THIS ENTIRE FILE WHEN MOBILE APP IS READY -->
  <!-- ========================================================================== -->
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h2>
          <el-tag type="warning">TESTING ONLY</el-tag>
          Invitation Flow Testing
        </h2>
        <p style="color: #909399; font-size: 14px; margin-top: 10px;">
          This page simulates the mobile app invitation feature.
        </p>
      </div>

      <el-form ref="form" :model="form" label-width="200px" style="max-width: 600px;">
        <el-form-item label="Select User (Inviter)">
          <el-select
            v-model="form.selectedUserId"
            placeholder="Select a user to simulate login"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="`${user.firstName} ${user.lastName} (${user.email})`"
              :value="user.id"
            />
          </el-select>
          <span style="font-size: 12px; color: #909399;">
            This simulates logging in as this user from the mobile app
          </span>
        </el-form-item>

        <el-form-item label="Recipient Email">
          <el-input
            v-model="form.recipientEmail"
            placeholder="Enter email to invite"
            type="email"
          />
          <span style="font-size: 12px; color: #909399;">
            The invitation link will be sent to this email
          </span>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!form.selectedUserId || !form.recipientEmail"
            @click="sendInvitation"
          >
            Send Invitation
          </el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>

      <el-divider v-if="successMessage" />

      <div v-if="successMessage" class="invitation-result">
        <el-alert
          title="Invitation Sent Successfully!"
          type="success"
          :closable="false"
          style="margin-bottom: 20px;"
        >
          <p>{{ successMessage }}</p>
          <p v-if="!emailSent" style="margin-top: 10px; color: #e6a23c;">
            <strong>Note:</strong> Email may not have been sent. Use the link below for testing.
          </p>
        </el-alert>

        <el-alert
          v-if="invitationLink"
          title="Invitation Link (for testing)"
          type="info"
          :closable="false"
        >
          <p>Copy this link and share it with the recipient:</p>
          <el-input
            v-model="invitationLink"
            readonly
            style="margin-top: 10px;"
          >
            <el-button slot="append" icon="el-icon-document-copy" @click="copyLink">
              Copy
            </el-button>
          </el-input>
          <p style="margin-top: 10px; font-size: 12px; color: #909399;">
            Open this link in an incognito window to test the invitation flow.
          </p>
        </el-alert>
      </div>
    </el-card>
  </div>
  <!-- ========================================================================== -->
  <!-- END TESTING CODE -->
  <!-- ========================================================================== -->
</template>

<script>
// ============================================================================
// TESTING ONLY - DELETE THIS ENTIRE FILE WHEN MOBILE APP IS READY
// ============================================================================
import userService from '@/services/user'
import linkedAccountsService from '@/services/linkedAccounts'

export default {
  name: 'TestInvitation',
  data () {
    return {
      users: [],
      form: {
        selectedUserId: '',
        recipientEmail: ''
      },
      loading: false,
      successMessage: '',
      invitationLink: '',
      emailSent: false
    }
  },
  created () {
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      const params = {
        sortBy: 'firstName asc',
        limit: 1000,
        start: 0
      }

      userService.queryUsers(params)
        .then(users => {
          // Filter only regular users (not root or linkedAccount)
          this.users = users.filter(u => u.role && u.role.name === 'user')
        })
        .catch((error) => {
          console.error('Error loading users:', error)
          this.$message.error('Failed to load users')
        })
    },
    async sendInvitation () {
      this.loading = true
      this.successMessage = ''
      this.invitationLink = ''

      try {
        const result = await linkedAccountsService.sendInvitation(
          this.form.recipientEmail,
          this.form.selectedUserId
        )

        const selectedUser = this.users.find(u => u.id === this.form.selectedUserId)
        const userName = selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'the user'

        this.successMessage = `Invitation from ${userName} has been sent to ${this.form.recipientEmail}.`
        this.invitationLink = result.inviteLink || ''
        this.emailSent = result.emailSent || false

        if (result.emailSent) {
          this.$message.success('Invitation email sent successfully!')
        } else {
          this.$message.warning('Invitation created, but email may not have been sent. Check email configuration.')
        }
      } catch (error) {
        console.error('Invitation error:', error)
        this.$message.error('Failed to send invitation. Check console for details.')
      } finally {
        this.loading = false
      }
    },
    resetForm () {
      this.form = {
        selectedUserId: '',
        recipientEmail: ''
      }
      this.successMessage = ''
      this.invitationLink = ''
    },
    copyLink () {
      navigator.clipboard.writeText(this.invitationLink)
      this.$message.success('Invitation link copied to clipboard!')
    }
  }
}
// ============================================================================
// END TESTING CODE
// ============================================================================
</script>

<style scoped>
/* TESTING ONLY - DELETE THIS ENTIRE FILE WHEN MOBILE APP IS READY */
.invitation-result {
  margin-top: 20px;
}

.box-card {
  max-width: 800px;
  margin: 0 auto;
}
</style>
