<template>
  <div class="accept-invitation-container">
    <div class="invitation-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="SwapMyMood Logo" class="logo">
      </div>
      <div v-if="error" class="error-message">
        <i class="el-icon-warning" />
        <h3>{{ error }}</h3>
        <el-button type="primary" @click="$router.push('/login')">Go to Login</el-button>
      </div>

      <div v-else-if="validationResult && !loading" class="invitation-content">
        <!-- Introductory text -->
        <p class="invitation-text">
          You've been invited by
          <strong v-if="validationResult && validationResult.inviterName">
            {{ validationResult.inviterName }}
          </strong>
          <span v-else>a user</span>
          to follow his experience using SwapMyMood.
        </p>
        <p class="invitation-text">
          This app helps people solve problems and regulate emotions.
        </p>
        <div v-if="validationResult.recipientUserExists" class="user-exists">
          <p class="invitation-text">An account with email <strong>{{ validationResult.recipientEmail }}</strong> already exists.</p>
          <p class="invitation-text">Please log in to accept this invitation.</p>
          <el-button type="primary" @click="goToLogin">Log In</el-button>
        </div>

        <div v-else class="register-form">
          <p class="form-instruction">Please complete this form to stay in contact</p>

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

            <el-form-item prop="email">
              <el-input
                v-model="registerData.email"
                placeholder="Email"
                autocomplete="off"
                disabled
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

            <el-form-item prop="acceptTerms" class="terms-checkbox">
              <el-checkbox v-model="registerData.acceptTerms">
                I ACCEPT THE <span class="terms-link" @click.prevent="showTermsDialog = true">TERMS AND CONDITIONS</span>
              </el-checkbox>
            </el-form-item>

            <el-form-item prop="acceptPrivacy" class="terms-checkbox">
              <el-checkbox v-model="registerData.acceptPrivacy">
                I ACCEPT THE <span class="terms-link" @click.prevent="showPrivacyDialog = true">PRIVACY POLICY</span>
              </el-checkbox>
            </el-form-item>

            <el-button type="warning" :loading="registering" class="submit-button" @click.prevent="handleRegister">
              SUBMIT
            </el-button>
          </el-form>
        </div>
      </div>
    </div>

    <!-- Terms and Conditions Dialog -->
    <el-dialog
      title="Terms and Conditions"
      :visible.sync="showTermsDialog"
      width="80%"
      top="5vh"
      custom-class="terms-dialog"
    >
      <div class="terms-dialog-content">
        <p v-if="termsContent" style="white-space: pre-wrap;">{{ termsContent }}</p>
        <p v-else style="color: rgba(255,255,255,0.5);">No content available yet.</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="showTermsDialog = false">Close</el-button>
      </span>
    </el-dialog>

    <!-- Privacy Policy Dialog -->
    <el-dialog
      title="Privacy Policy"
      :visible.sync="showPrivacyDialog"
      width="80%"
      top="5vh"
      custom-class="terms-dialog"
    >
      <div class="terms-dialog-content">
        <p v-if="privacyContent" style="white-space: pre-wrap;">{{ privacyContent }}</p>
        <p v-else style="color: rgba(255,255,255,0.5);">No content available yet.</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="showPrivacyDialog = false">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import linkedAccountsService from '@/services/linkedAccounts'
import legalService from '@/services/legal'
import logo from '@/assets/images/logo_transparent.png'

export default {
  name: 'AcceptInvitation',
  data () {
    const validateConfirmPassword = (_rule, value, callback) => {
      if (value !== this.registerData.password) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }

    const validateTerms = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('You must accept the terms and conditions'))
      } else {
        callback()
      }
    }

    const validatePrivacy = (_rule, value, callback) => {
      if (!value) {
        callback(new Error('You must accept the privacy policy'))
      } else {
        callback()
      }
    }

    return {
      logo,
      loading: true,
      registering: false,
      error: null,
      token: null,
      validationResult: null,
      termsContent: '',
      privacyContent: '',
      registerData: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        acceptPrivacy: false
      },
      rules: {
        firstname: [
          { required: true, message: 'First name is required', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: 'Last name is required', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password is required', trigger: 'blur' },
          { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: 'Please confirm your password', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        acceptTerms: [
          { validator: validateTerms, trigger: 'change' }
        ],
        acceptPrivacy: [
          { validator: validatePrivacy, trigger: 'change' }
        ]
      },
      showTermsDialog: false,
      showPrivacyDialog: false
    }
  },
  created () {
    this.loadLegalContent()
    this.token = this.$route.query.token

    if (process.env.NODE_ENV === 'development' && !this.token) {
      this.validationResult = {
        recipientEmail: 'dev@test.com',
        recipientUserExists: false,
        inviterName: 'Dev User',
        invitationId: 'dev-mock-id',
        recipientRole: 'linkedAccount'
      }
      this.registerData.email = 'dev@test.com'
      this.loading = false
      return
    }

    if (!this.token) {
      this.error = 'Invalid invitation link. No token provided.'
      this.loading = false
      return
    }

    this.validateToken()
  },
  methods: {
    loadLegalContent () {
      legalService.getTerms().then(res => { this.termsContent = res.content || '' })
      legalService.getPrivacy().then(res => { this.privacyContent = res.content || '' })
    },

    validateToken () {
      this.loading = true
      linkedAccountsService.validateInvitation(this.token)
        .then(result => {
          this.validationResult = result
          this.registerData.email = result.recipientEmail
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
      appearance: none;
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

    .el-form-item__label {
      color: #FEC171 !important;
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
  }

  .el-checkbox__label {
    color: $light_gray !important;
    font-size: 12px;
    font-weight: bold;
  }
}

.terms-dialog {
  .el-dialog__header {
    background: #2d3a4b;
    .el-dialog__title {
      color: #eee;
      font-weight: bold;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #eee;
    }
  }

  .el-dialog__body {
    background: #2d3a4b;
    max-height: 60vh;
    overflow-y: auto;
  }

  .el-dialog__footer {
    background: #2d3a4b;
  }

  .terms-dialog-content {
    color: #eee;

    .last-updated {
      font-size: 13px;
      color: rgba(255,255,255,0.6);
      margin-bottom: 20px;
    }

    h3 {
      color: #FEC171;
      font-size: 16px;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 12px;
      text-align: justify;
    }
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

  .logo-container {
    width: 100%;
    overflow: hidden;
    text-align: center;
    margin-bottom: 20px;
  }

  .logo {
    display: block;
    width: 60%;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .logo {
      width: 75%;
    }
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
    padding: 20px 0;

    .invitation-text {
      font-size: 18px;
      color: $light_gray;
      margin-bottom: 20px;
    }

    .form-instruction {
      font-size: 14px;
      color: $light_gray;
      margin-bottom: 20px;
    }

    .user-exists {
      margin-top: 30px;

      .el-button {
        display: block;
        margin: 0 auto;
      }
    }

    .register-form {
      margin-top: 30px;

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-button {
        margin-top: 10px;
      }

      .form-label .el-form-item__label {
        color: #FEC171;
        font-weight: bold;
        font-size: 12px;
        letter-spacing: 0.5px;
        margin-bottom: 5px;
      }

      .terms-checkbox {
        margin-bottom: 20px;
        border: none !important;
        background: transparent !important;
      }

      .terms-link {
        color: #FEC171;
        text-decoration: underline;
        font-weight: bold;
      }

      .submit-button {
        width: 100%;
        font-size: 16px;
        font-weight: bold;
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
      padding: 15px 0;

      .invitation-text {
        font-size: 16px;
      }

      .form-instruction {
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
