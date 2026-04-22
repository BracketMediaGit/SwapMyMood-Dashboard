<template>
  <div class="terms-container">
    <div class="terms-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="SwapMyMood Logo" class="logo">
      </div>

      <div class="terms-content">
        <h1 class="title">Terms and Conditions</h1>
        <p class="last-updated">Last updated: [TO BE DEFINED]</p>

        <div class="terms-text">
          <h2>⚠️ TEMPORARY CONTENT</h2>
          <p>
            This is a placeholder for Terms and Conditions. The final legal content must be provided and reviewed before production release.
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>

          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <p>
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra,
            est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
          </p>

          <p>
            Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.
            Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue.
          </p>

          <p>
            [THIS TEXT IS A PLACEHOLDER – DO NOT USE IN PRODUCTION]
          </p>

          <div class="buttons-container">
            <el-button type="primary" @click="goBack">Go Back</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import logo from '@/assets/images/logo_transparent.png'

export default {
  name: 'TermsAndConditions',
  data () {
    return {
      logo
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$light_gray: #eee;

.terms-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: auto;
  display: flex;
  justify-content: center;
  padding: 40px 20px;

  .terms-card {
    width: 800px;
    max-width: 100%;
    background: transparent;
  }

  .logo-container {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo {
    width: 154px;
    height: auto;
  }

  .terms-content {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 40px;
    color: $light_gray;

    .title {
      font-size: 32px;
      color: $light_gray;
      margin: 0 0 10px 0;
      text-align: center;
      font-weight: bold;
    }

    .last-updated {
      text-align: center;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 30px;
    }

    .terms-text {
      h2 {
        font-size: 20px;
        color: #FEC171;
        margin-top: 25px;
        margin-bottom: 10px;
        font-weight: bold;
      }

      p {
        font-size: 15px;
        line-height: 1.6;
        color: $light_gray;
        margin-bottom: 15px;
        text-align: justify;
      }

      .buttons-container {
        margin-top: 40px;
        text-align: center;
      }
    }
  }

  // Mobile responsive styles
  @media (max-width: 768px) {
    padding: 20px 10px;

    .terms-content {
      padding: 20px;

      .title {
        font-size: 24px;
      }

      .terms-text {
        h2 {
          font-size: 18px;
        }

        p {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
