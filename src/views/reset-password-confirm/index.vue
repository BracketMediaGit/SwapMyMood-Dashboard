<template>
  <div class="reset-password-confirm-container">
    <div class="reset-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="SwapMyMood Logo" class="logo">
      </div>

      <div v-if="error" class="error-message">
        <i class="el-icon-warning" />
        <h3>{{ error }}</h3>
        <el-button type="primary" @click="goToLogin">Go to Login</el-button>
      </div>

      <div v-else-if="success" class="success-message">
        <i class="el-icon-circle-check" />
        <h3>Your password has been updated.</h3>
        <el-button type="primary" @click="goToLogin">Go to Login</el-button>
      </div>

      <div v-else class="reset-form">
        <p class="form-instruction">Enter a new password for your account.</p>

        <el-form ref="resetForm" :model="formData" :rules="rules">
          <el-form-item prop="newPassword">
            <el-input
              v-model="formData.newPassword"
              type="password"
              placeholder="New Password"
              autocomplete="off"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              autocomplete="off"
              show-password
              @keyup.enter.native="handleSubmit"
            />
          </el-form-item>

          <el-button type="warning" :loading="submitting" class="submit-button" @click.prevent="handleSubmit">
            RESET PASSWORD
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import userService from '@/services/user'
import logo from '@/assets/images/logo_transparent.png'

export default {
  name: 'ResetPasswordConfirm',
  data () {
    const validateConfirmPassword = (_rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        callback(new Error('Passwords do not match'))
      } else {
        callback()
      }
    }

    return {
      logo,
      token: null,
      error: null,
      success: false,
      submitting: false,
      formData: {
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
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
    this.token = this.$route.query.oobCode || this.$route.query.token

    if (!this.token) {
      this.error = 'Invalid or expired reset link.'
    }
  },
  methods: {
    goToLogin () {
      this.$router.push('/login')
    },
    handleSubmit () {
      this.$refs.resetForm.validate(valid => {
        if (!valid) return

        this.submitting = true
        userService.confirmResetPassword({ token: this.token, newPassword: this.formData.newPassword })
          .then(() => {
            this.success = true
          })
          .catch(err => {
            this.$message.error(err.detail || 'Error resetting password')
          })
          .finally(() => {
            this.submitting = false
          })
      })
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .reset-password-confirm-container .el-input input {
    color: $cursor;
  }
}

.reset-password-confirm-container {
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
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$light_gray:#eee;

.reset-password-confirm-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .reset-card {
    width: 420px;
    max-width: 100%;
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

  .error-message,
  .success-message {
    text-align: center;
    padding: 20px;

    i {
      font-size: 48px;
      margin-bottom: 20px;
    }

    h3 {
      margin-bottom: 20px;
      color: $light_gray;
    }
  }

  .error-message i {
    color: #f56c6c;
  }

  .success-message i {
    color: #67c23a;
  }

  .reset-form {
    padding: 20px 0;

    .form-instruction {
      font-size: 14px;
      color: $light_gray;
      margin-bottom: 20px;
    }

    .submit-button {
      width: 100%;
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
    }
  }
}
</style>
