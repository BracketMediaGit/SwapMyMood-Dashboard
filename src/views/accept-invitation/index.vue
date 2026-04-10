<template>
  <div class="accept-invitation-container">
    <el-card v-loading="loading" class="invitation-card">
      <div v-if="error" class="error-message">
        <i class="el-icon-warning" />
        <h3>{{ error }}</h3>
        <el-button type="primary" @click="$router.push('/login')">Go to Login</el-button>
      </div>

      <div v-else-if="validationResult && !loading" class="invitation-content">
        <h2>Invitation to SwapMyMood</h2>
        <p>You have been invited to view data from a SwapMyMood user.</p>

        <div v-if="validationResult.recipientUserExists" class="user-exists">
          <p>An account with email <strong>{{ validationResult.recipientEmail }}</strong> already exists.</p>
          <p>Please log in to accept this invitation.</p>
          <el-button type="primary" @click="goToLogin">Log In</el-button>
        </div>

        <div v-else class="register-form">
          <p>Please create your account to accept this invitation.</p>
          <p>Email: <strong>{{ validationResult.recipientEmail }}</strong></p>
          <!--todo check if can reuse register form from create user view -->
          <el-form ref="registerForm" :model="registerData" :rules="rules" label-position="left" label-width="140px">
            <el-form-item label="First Name" prop="firstname">
              <el-input
                v-model="registerData.firstname"
                placeholder="Enter first name"
              />
            </el-form-item>

            <el-form-item label="Last Name" prop="lastname">
              <el-input
                v-model="registerData.lastname"
                placeholder="Enter last name"
              />
            </el-form-item>

            <el-form-item label="Password" prop="password">
              <el-input
                v-model="registerData.password"
                type="password"
                placeholder="Enter password"
                show-password
              />
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
              <el-input
                v-model="registerData.confirmPassword"
                type="password"
                placeholder="Confirm password"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="registering" @click="handleRegister">
                Create Account & Accept Invitation
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import linkedAccountsService from '@/services/linkedAccounts'

export default {
  name: 'AcceptInvitation',
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerData.password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }

    return {
      loading: true,
      registering: false,
      error: null,
      token: null,
      validationResult: null,
      registerData: {
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        firstname: [
          { required: true, message: 'First name is required', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: 'Last name is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.token = this.$route.query.token
    if (!this.token) {
      this.error = 'Invalid invitation link. No token provided.'
      this.loading = false
      return
    }

    this.validateToken()
  },
  methods: {
    validateToken () {
      this.loading = true
      linkedAccountsService.validateInvitation(this.token)
        .then(result => {
          this.validationResult = result
          this.loading = false
        })
        .catch(err => {
          this.error = err.detail || 'Invalid or expired invitation link.'
          this.loading = false
        })
    },

    goToLogin () {
      // Pass invitationId and email to login page
      this.$router.push({
        path: '/login',
        query: {
          invitationId: this.validationResult.invitationId,
          email: this.validationResult.recipientEmail
        }
      })
    },

    handleRegister () {
      this.$refs.registerForm.validate(valid => {
        if (!valid) return

        this.registering = true

        // Register user with linkedAccount role
        const newUser = {
          firstname: this.registerData.firstname,
          lastname: this.registerData.lastname,
          email: this.validationResult.recipientEmail,
          password: this.registerData.password,
          role: this.validationResult.recipientRole
        }

        // Call user creation endpoint
        const userService = require('@/services/user').default
        userService.createUser(newUser)
          .then(() => {
            // After successful registration, log in
            return this.$store.dispatch('user/login', {
              email: this.validationResult.recipientEmail,
              password: this.registerData.password
            })
          })
          .then(() => {
            // Accept the invitation using invitationId
            return linkedAccountsService.acceptInvitation(this.validationResult.invitationId)
          })
          .then(() => {
            this.$message.success('Account created and invitation accepted successfully!')
            setTimeout(() => {
              this.$router.push('/user/index')
            }, 1500)
          })
          .catch(() => {
            this.registering = false
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.accept-invitation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;

  .invitation-card {
    width: 500px;
    max-width: 90%;
  }

  .error-message {
    text-align: center;
    padding: 20px;

    i {
      font-size: 48px;
      color: #f56c6c;
      margin-bottom: 20px;
    }

    h3 {
      margin-bottom: 20px;
      color: #606266;
    }
  }

  .invitation-content {
    padding: 20px;

    h2 {
      margin-bottom: 20px;
      text-align: center;
    }

    p {
      margin-bottom: 15px;
      color: #606266;
    }

    .user-exists {
      text-align: center;
      margin-top: 30px;
    }

    .register-form {
      margin-top: 30px;
    }
  }
}
</style>
