<template>
  <div class="app-container">
    <el-form ref="ruleForm" v-loading="loading" :model="ruleForm" :rules="rules" label-width="5rem" class="demo-ruleForm">
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">Send Email</el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userService from '@/services/user'

export default {
  data () {
    return {
      loading: false,
      ruleForm: {
        email: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          userService.resetPassword(this.ruleForm.email)
            .then(res => {
              this.loading = false
              this.$refs[formName].resetFields()
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
