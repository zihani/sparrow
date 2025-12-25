<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.currentUser)
const token = computed(() => userStore.token)
const goGenerate = () => router.push('/generate')
const goApiPost = () => router.push('/apiPost')
const gocoding = () => router.push('/coding')
</script>

<template>
  <div class="home">
    <div class="hero">
      <div class="title">Sparrow Home</div>
      <div class="subtitle">欢迎使用麻雀工作台</div>
    </div>
    <div class="cards">
      <el-card class="card">
        <div class="card-title">用户信息</div>
        <div class="card-content">
          <div>用户名：{{ user?.username || '未登录' }}</div>
          <div>昵称：{{ user?.nickname || '-' }}</div>
          <div>邮箱：{{ user?.email || '-' }}</div>
          <div>Token：{{ token ? '已获取' : '未获取' }}</div>
        </div>
      </el-card>
      <el-card class="card actions">
        <div class="card-title">快捷入口</div>
        <div class="btns">
          <el-button type="primary" @click="goGenerate">组件生成工具</el-button>
          <el-button @click="goApiPost">API 调试工具</el-button>
          <el-button @click="gocoding">代码分析工具</el-button>
        </div>
      </el-card>
      <el-card class="card actions">
        <div class="card-title">快捷入口</div>
        <div class="btns">
          导航 ai链接
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero {
  margin-bottom: 0;
}
.title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}
.subtitle {
  margin-top: 6px;
  color: #64748b;
  font-size: 13px;
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  flex: 1 1 280px;
}
.card-title {
  font-weight: 600;
  margin-bottom: 10px;
}
.card-content {
  display: grid;
  gap: 6px;
  color: #334155;
}
.actions .btns {
  display: flex;
  gap: 12px;
}
</style>
