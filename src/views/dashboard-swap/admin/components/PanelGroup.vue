<template>
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(64,158,255,0.12);color:#409EFF">
        <svg-icon icon-class="peoples" />
      </div>
      <div class="stat-info">
        <count-to :start-val="0" :end-val="statistics.usersCount || 0" :duration="2600" class="stat-number" />
        <div class="stat-label">Users</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(103,194,58,0.12);color:#67C23A">
        <svg-icon icon-class="stop" />
      </div>
      <div class="stat-info">
        <count-to :start-val="0" :end-val="statistics.swapsCount || 0" :duration="3000" class="stat-number" />
        <div class="stat-label">SWAPS</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(230,93,110,0.12);color:#E65D6E">
        <svg-icon icon-class="heart" />
      </div>
      <div class="stat-info">
        <count-to :start-val="0" :end-val="statistics.emotionCyclesCount || 0" :duration="3200" class="stat-number" />
        <div class="stat-label">Emotional Cycles</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(254,193,113,0.15);color:#d4900a">
        <svg-icon icon-class="link" />
      </div>
      <div class="stat-info">
        <count-to :start-val="0" :end-val="statistics.usersWithLinkedAccountsCount || 0" :duration="3400" class="stat-number" />
        <div class="stat-label">Users w/ Linked Accounts</div>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-icon" style="background:rgba(48,176,143,0.12);color:#30B08F">
        <svg-icon icon-class="user2" />
      </div>
      <div class="stat-info">
        <count-to :start-val="0" :end-val="statistics.totalLinkedAccountsCount || 0" :duration="3600" class="stat-number" />
        <div class="stat-label">Total Linked Accounts</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CountTo from 'vue-count-to'

export default {
  components: { CountTo },
  computed: {
    ...mapGetters(['statistics'])
  }
}
</script>

<style lang="scss" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.stat-icon {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  min-width: 0;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.1;
  letter-spacing: -0.5px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #8a94a6;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
