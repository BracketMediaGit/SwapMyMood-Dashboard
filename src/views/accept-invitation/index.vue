<template>
  <div class="accept-invitation-container">
    <div class="invitation-card">
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
          <p><strong>{{ validationResult.recipientEmail }}</strong></p>
          <!--todo check if can reuse register form from create user view -->
          <el-form ref="registerForm" :model="registerData" :rules="rules">
            <el-form-item prop="firstname">
              <el-input
                v-model="registerData.firstname"
                placeholder="First Name"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item prop="lastname">
              <el-input
                v-model="registerData.lastname"
                placeholder="Last Name"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerData.password"
                type="password"
                placeholder="Password"
                autocomplete="off"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerData.confirmPassword"
                type="password"
                placeholder="Confirm Password"
                autocomplete="off"
                show-password
              />
            </el-form-item>

            <el-button type="primary" :loading="registering" style="width: 100%; margin-bottom: 30px;" @click.prevent="handleRegister">
              Create Account & Accept Invitation
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
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

          // If user already exists AND is already logged in, accept invitation directly
          if (result.recipientUserExists && this.$store.getters.token) {
            this.acceptInvitationDirectly()
          }
        })
        .catch(err => {
          this.error = err.detail || 'Invalid or expired invitation link.'
          this.loading = false
        })
    },

    acceptInvitationDirectly () {
      this.loading = true
      const invId = this.validationResult && this.validationResult.invitationId
      linkedAccountsService.acceptInvitation(invId)
        .then(() => {
          this.$message.success('Invitation accepted successfully!')
          setTimeout(() => {
            this.$router.push('/user/index')
          }, 1500)
        })
        .catch(err => {
          this.$message.error(err.detail || 'Error accepting invitation')
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
          role: this.validationResult.recipientRole || 'linkedAccount'
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
          .catch(err => {
            this.$message.error(err.detail || err.message || 'Error creating account')
          })
          .finally(() => {
            this.registering = false
          })
      })
    }
  }
}
</script>

<style lang="scss">
/* Match login page input styles */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .accept-invitation-container .el-input input {
    color: $cursor;
  }
}

/* Reset element-ui css to match login */
.accept-invitation-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.accept-invitation-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .invitation-card {
    width: 520px;
    max-width: 100%;
    background: transparent;
    border: none;
    box-shadow: none;
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
      color: $light_gray;
    }
  }

  .invitation-content {
    padding: 20px 35px;

    h2 {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }

    p {
      margin-bottom: 15px;
      color: $light_gray;
      text-align: center;
      font-size: 14px;
    }

    .user-exists {
      text-align: center;
      margin-top: 30px;
    }

    .register-form {
      margin-top: 30px;

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-button {
        margin-top: 10px;
      }
    }
  }

  // Mobile responsive styles
  @media (max-width: 768px) {
    .invitation-card {
      width: 95%;
    }

    .invitation-content {
      padding: 15px 20px;

      h2 {
        font-size: 20px;
      }

      p {
        font-size: 13px;
      }
    }

    .register-form {
      .el-button {
        font-size: 14px;
      }
    }
  }
}
</style>
