<template>
  <div class="terms-container">
    <div class="terms-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="SwapMyMood Logo" class="logo">
      </div>

      <div class="terms-content">
        <h1 class="title">Terms and Conditions</h1>
        <p class="last-updated">Last updated: 22/04/2026</p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using SwapMyMood ("the Platform"), you accept and agree to be bound by these terms and conditions.
          If you do not agree to these terms, you must not access or use the Platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          SwapMyMood provides a platform where users may share selected emotional and behavioral data with trusted individuals
          ("Linked Accounts") through a web-based dashboard. As an invited user, your access is limited to viewing the data
          shared with you and does not include access to the mobile application.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          You agree to notify us immediately of any unauthorized use of your account.
        </p>

        <h2>4. Privacy and Data Protection</h2>
        <p>
          We are committed to protecting personal data. The information you access may include sensitive emotional or behavioral data
          belonging to another user. You agree to treat this information as strictly confidential and to access it only for its intended purpose.
          Data is handled in accordance with our Privacy Policy and applicable laws.
        </p>

        <h2>5. Linked Accounts and Shared Data</h2>
        <p>
          Your access to the Platform is granted through an invitation from another user. By accepting this invitation,
          you acknowledge that the original user has chosen to share specific data with you. You may only view the data provided
          and must not copy, distribute, or use it for any purpose outside the intended use. The original user may revoke your access at any time.
        </p>

        <h2>6. User Responsibilities</h2>
        <p>
          You agree to use the Platform only for lawful purposes and in a manner that respects the privacy and rights of others.
          You must not misuse, reproduce, or exploit any data accessed through the Platform.
        </p>

        <h2>7. No Professional Relationship</h2>
        <p>
          Access to user data through the Platform does not establish any medical, psychological, or professional relationship
          between you and the user who shared the data.
        </p>

        <h2>8. Medical Disclaimer</h2>
        <p>
          SwapMyMood is not a substitute for professional medical advice, diagnosis, or treatment. Any information accessed
          through the Platform should not be used as a basis for medical decisions.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, SwapMyMood and its affiliates shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages arising from your use of the Platform or access to shared data.
        </p>

        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the Platform after such changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>11. Termination</h2>
        <p>
          We may suspend or terminate your access at any time if you violate these terms or misuse the Platform.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          If you have any questions about these Terms and Conditions, please contact us at: [Contact Email]
        </p>
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
