<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { getCaptcha, createFixedIPClient } from '@/api/public'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'vue-router'

const loading = ref(false)
const router = useRouter()
const formRef = ref<FormInstance>()
const formModel = reactive({
  username: '',
  password: '',
  remember: true,
  captcha: '',
  captchaId: ''
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
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

const captchaImage = ref<string>('') // data url
const fetchCaptcha = async () => {
  try {
    formModel.captcha = ''
    const { data } = await getCaptcha()
    console.log(data.data)
    captchaImage.value = data.data.image || ''
    formModel.captchaId = data.data.captchaId || ''
  } catch (e) {
    captchaImage.value = ''
    formModel.captchaId = ''
  }
}
onMounted(fetchCaptcha)

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    loading.value = true
    const userStore = useUserStore()
    const client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE || '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    try {
      const res = await client.post('/api/public/login', {
        username: formModel.username,
        password: formModel.password,
        captchaId: formModel.captchaId,
        captchaCode: formModel.captcha,
      })
      const token = res?.data?.data?.token
      const userData = res?.data?.data?.user || { id: formModel.username, username: formModel.username }
      if (token) {
        userStore.setToken(token)
      }
      if (userData) {
        userStore.setCurrentUser(userData)
      }
      if (token) {
        const secureClient = createFixedIPClient({ token })
        try {
          const res2 = await secureClient.get('/api/secure/list')
          if (res2.status === 200) {
            ElMessage.success('登录成功')
            debugger
            router.push('/home')
          } else {
            ElMessage.error('Token 验证失败')
          }
        } catch {
          ElMessage.error('Token 验证失败')
        }
      } else {
        ElMessage.error('未获取 token')
      }
    } catch (e: any) {
      ElMessage.error('登录失败')
    } finally {
      loading.value = false
    }
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

        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="formModel.captcha"
              size="large"
              placeholder="请输入右侧验证码"
              class="captcha-input"
              clearable
            />
            <img :src="captchaImage" class="captcha-img" @click="fetchCaptcha" alt="captcha" />
            <el-link type="primary" @click="fetchCaptcha" class="captcha-refresh">换一张</el-link>
          </div>
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
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --el-color-primary: #f5b301;
  --el-color-primary-light-3: #ffd666;
  --el-color-primary-light-5: #ffe08e;
  --el-color-primary-light-7: #fff0b8;
  --el-color-primary-light-8: #fff6cc;
  --el-color-primary-light-9: #fff9db;
  --el-color-primary-dark-2: #b88200;
  background: radial-gradient(1200px 600px at 0% 0%, #fff6cc 0%, transparent 60%),
              radial-gradient(1200px 600px at 100% 0%, #fff2b3 0%, transparent 60%),
              radial-gradient(1200px 600px at 0% 100%, #fff9db 0%, transparent 60%),
              radial-gradient(1200px 600px at 100% 100%, #ffefb0 0%, transparent 60%),
              linear-gradient(135deg, #fffaf0 0%, #fff6dd 100%);
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
  background: linear-gradient(135deg, #ffe08e, #f5b301);
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

.captcha-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
}
.captcha-input {
  width: 100%;
}
.captcha-img {
  width: 120px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(24,39,75,0.12);
  cursor: pointer;
}
.captcha-refresh {
  white-space: nowrap;
  color: var(--el-color-primary);
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
