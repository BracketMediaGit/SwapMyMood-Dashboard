<template>
  <div class="app-container">
    <el-form ref="ruleForm" v-loading="loading" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="First Name" prop="firstname">
        <el-input v-model="ruleForm.firstname" />
      </el-form-item>
      <el-form-item label="Last Name" prop="lastname">
        <el-input v-model="ruleForm.lastname" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email" />
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="ruleForm.password" type="password" />
      </el-form-item>
      <el-form-item label="Confirm" prop="confirmPassword">
        <el-input v-model="ruleForm.confirmPassword" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userService from '@/services/user'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('Passwords don\'t match!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        firstname: [
          { required: true, message: 'Please input first name', trigger: 'blur' }
        ],
        lastname: [
          { required: true, message: 'Please input last name', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please input password', trigger: 'blur' },
          { min: 6, message: 'Password must contain 6 character', trigger: 'blur' }
        ],
        confirmPassword: [
          { min: 6, message: 'Password must contain 6 character', trigger: 'blur' },
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          userService.createUser(this.ruleForm)
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
