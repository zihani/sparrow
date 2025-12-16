<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const formRef = ref<FormInstance>()
const formModel = reactive({
  username: '',
  password: '',
  remember: true,
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' },
  ],
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    setTimeout(() => {
      loading.value = false
      ElMessage.success('登录成功（示例）')
    }, 800)
  })
}
</script>

<template>
  <div class="login-page">
    <div class="bg" aria-hidden="true"></div>
    <div class="glass-card">
      <div class="brand">
        <div class="logo">SV</div>
        <div class="title">Sparrow · 登录</div>
        <div class="subtitle">欢迎回来，请登录以继续</div>
      </div>

      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-position="top"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formModel.username"
            size="large"
            placeholder="请输入用户名或邮箱"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formModel.password"
            size="large"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <div class="actions">
          <el-checkbox v-model="formModel.remember">记住我</el-checkbox>
          <el-link type="primary">忘记密码？</el-link>
        </div>

        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :loading="loading"
          @click="onSubmit"
        >登录</el-button>

        <div class="hint">
          这是一个示例登录页，仅包含前端样式与校验。
        </div>
      </el-form>
    </div>
  </div>
  
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(1200px 600px at 0% 0%, #e0ffe6 0%, transparent 60%),
              radial-gradient(1200px 600px at 100% 0%, #e9f1ff 0%, transparent 60%),
              radial-gradient(1200px 600px at 0% 100%, #fff0f5 0%, transparent 60%),
              radial-gradient(1200px 600px at 100% 100%, #f0fff4 0%, transparent 60%),
              linear-gradient(135deg, #fefefe 0%, #f6f9ff 100%);
}

.bg::before,
.bg::after {
  content: '';
  position: absolute;
  inset: -30% -10% -10% -30%;
  background: conic-gradient(from 180deg at 50% 50%, #7cd5ff, #a0ffa5, #ffc7e6, #7cd5ff);
  filter: blur(90px);
  opacity: 0.25;
  animation: float 12s linear infinite;
}
.bg::after {
  inset: -10% -30% -30% -10%;
  filter: blur(110px);
  opacity: 0.2;
  animation-duration: 16s;
}
@keyframes float {
  0% { transform: translate3d(0, 0, 0) rotate(0deg); }
  50% { transform: translate3d(10px, -6px, 0) rotate(2deg); }
  100% { transform: translate3d(0, 0, 0) rotate(0deg); }
}

.glass-card {
  width: 420px;
  max-width: 92vw;
  border-radius: 18px;
  padding: 28px 26px;
  background: rgba(255, 255, 255, 0.65);
  box-shadow: 0 20px 40px rgba(24, 39, 75, 0.12), 0 8px 16px rgba(24, 39, 75, 0.08);
  backdrop-filter: saturate(160%) blur(10px);
  border: 1px solid rgba(240, 240, 240, 0.8);
}

.brand {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
  text-align: center;
}
.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 6px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 700;
  letter-spacing: 1px;
  color: #0f172a;
  background: linear-gradient(135deg, #7cd5ff, #a0ffa5);
  box-shadow: inset 0 -2px 10px rgba(255,255,255,0.4), 0 8px 18px rgba(124, 213, 255, 0.25);
}
.title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}
.subtitle {
  font-size: 13px;
  color: #64748b;
}

.login-form {
  margin-top: 8px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0 16px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
}

.hint {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
}
</style>