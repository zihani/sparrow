<template>
  <el-card class="api-debugger-card">
    <div class="request-line">
      <el-select v-model="method" class="method-select">
        <el-option
          v-for="item in methodsOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <el-input
        v-model="url"
        :type="isMultiline ? 'textarea' : 'text'"
        :rows="isMultiline ? 3 : undefined"
        placeholder="请输入请求 URL (http:// 或 https://)"
        class="url-input"
        :class="{ 'is-error': urlError }"
      >
        <template #suffix>
          <el-icon v-if="urlError" class="el-input__icon"><Warning /></el-icon>
        </template>
      </el-input>

      <el-switch v-model="isMultiline" active-text="多行" inactive-text="单行" />

      <el-button type="primary" :disabled="false" @click="sendRequest">发送</el-button>
    </div>
    <div class="save-line">
      <el-button type="warning" @click="saveToLocal">存储到本地</el-button>
      <el-button @click="clearData">重制</el-button>
    </div>
    <div v-if="urlError" class="url-error-tip">{{ urlError }}</div>
    
    <el-tabs v-model="activeRequestTab" class="request-tabs">
      <el-tab-pane label="Params" name="params">
         {{ requestConfig.params }}
        <ParamsEditor v-model:params="requestConfig.params" />
      </el-tab-pane>
      <el-tab-pane label="Authorization" name="authorization">
         {{ requestConfig.authorization }}
        <AuthorizationConfig v-model:authConfig="requestConfig.authorization" />
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
         {{ requestConfig.headers }}
        <HeadersEditor v-model:headers="requestConfig.headers" />
      </el-tab-pane>
      <el-tab-pane label="Body" name="body">
         {{ requestConfig.body }}
        <BodyEditor v-model:body="requestConfig.body" :method="method" />
      </el-tab-pane>
    </el-tabs>

    <el-divider />

    <h3>返回数据格式</h3>
    <el-tabs v-model="activeResponseTab" class="response-tabs">
      <el-tab-pane label="Body" name="responseBody">
        <ResponseDisplay :data="responseData" />
      </el-tab-pane>
      <el-tab-pane label="Headers" name="responseHeaders">
        <ResponseHeadersDisplay :headers="responseHeaders" />
      </el-tab-pane>
      <el-tab-pane label="Info" name="responseInfo">
        <ResponseInfoDisplay :status="responseStatus" :time="responseTime" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { ElMessage, ElCard, ElInput, ElButton, ElSelect, ElOption, ElTabs, ElTabPane, ElDivider, ElIcon } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';

// 假设我们有这些子组件，它们需要单独实现
import ParamsEditor from '../apiPost/ParamsEditor.vue';
import AuthorizationConfig from '../apiPost/AuthorizationConfig.vue';
import HeadersEditor from '../apiPost/HeadersEditor.vue';
import BodyEditor from '../apiPost/BodyEditor.vue';
import ResponseDisplay from '../apiPost/ResponseDisplay.vue';
import ResponseHeadersDisplay from '../apiPost/ResponseHeadersDisplay.vue';
import type { RequestConfig, ApiResponse } from '../../interface/interface-apiPost';
import type from 'typescript';
import { useApiPostStore } from '@/stores/useApiPostStore'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { attach401Redirect } from '@/api/public'
// --- 类型定义 ---

// 定义支持的 HTTP 方法
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';


// --- 核心逻辑 ---

// 1. URL 和方法
const methodsOptions: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];
const method = ref<HttpMethod>('GET');
const url = ref<string>('');
const isMultiline = ref<boolean>(false);

// HTTP/HTTPS 正则表达式
// 匹配 http:// 或 https:// 开头，后面跟着至少一个字符 (域名/IP)
const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;

const urlError = computed(() => {
  const value = url.value;
  if (!isMultiline.value) {
    if (value.length === 0) return 'URL 不能为空';
    return urlRegex.test(value) ? '' : 'URL 格式不正确，请确保以 http:// 或 https:// 开头';
  }
  const lines = value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return '至少填写一行 URL';
  const invalid = lines.find(l => !urlRegex.test(l));
  return invalid ? '存在格式错误的 URL 行' : '';
});

// 2. 请求配置
const activeRequestTab = ref('params');
const requestConfig = ref<RequestConfig>({
  params: [{ key: '', value: '', description: '' }],
  authorization: { type: 'None', token: '' },
  headers: [{ key: '', value: '', description: '' }],
  body: { type: 'raw', content: '{\n  \n}' },
});
const route = useRoute()
onMounted(() => {
  try {
    const raw = localStorage.getItem('apiPost:last')
    const payload = raw ? JSON.parse(raw) : null
    if (payload) {
      method.value = payload.method
      url.value = payload.url
      requestConfig.value = payload.config as RequestConfig
    }
  } catch {}
})

// 3. 响应结果
const activeResponseTab = ref('responseBody');
const responseData = ref<any>(null);
const responseHeaders = ref<Record<string, string>>({});
const responseStatus = ref<number | null>(null);
const responseTime = ref<number | null>(null);


/**
 * 模拟发送请求
 */
const sendRequest = async () => {
  if (urlError.value) {
    ElMessage.error(urlError.value);
    return;
  }
  const targetUrl = isMultiline.value
    ? (url.value.split('\n').map(l => l.trim()).filter(Boolean)[0] || '')
    : url.value;
  if (!targetUrl) {
    ElMessage.error('URL 不能为空');
    return;
  }

  // 构建 headers
  const headers: Record<string, string> = {};
  for (const h of requestConfig.value.headers) {
    if (h.key && h.value) headers[h.key] = h.value;
  }
  // Authorization 映射
  const auth = requestConfig.value.authorization;
  if (auth?.type === 'Bearer Token' || auth?.type === 'JWT Bearer') {
    headers['Authorization'] = `Bearer ${auth.token}`;
  } else if (auth?.type === 'Basic Auth') {
    headers['Authorization'] = `Basic ${auth.token}`;
  } else if (auth?.type === 'API Key' && !headers['x-api-key']) {
    headers['x-api-key'] = auth.token;
  }

  // 构建 params
  const params: Record<string, string> = {};
  for (const p of requestConfig.value.params) {
    if (p.key && p.value !== undefined) params[p.key] = p.value;
  }

  // 构建 body
  let data: any = undefined;
  const bodyType = requestConfig.value.body.type;
  if (bodyType === 'raw') {
    data = requestConfig.value.body.content as string;
    if (!headers['Content-Type']) headers['Content-Type'] = 'text/plain';
  } else if (bodyType === 'x-www-form-urlencoded') {
    const rows = requestConfig.value.body.content as { key: string; value: string }[];
    const formStr = (rows || [])
      .filter(r => r.key)
      .map(r => `${encodeURIComponent(r.key)}=${encodeURIComponent(r.value ?? '')}`)
      .join('&');
    data = formStr;
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (bodyType === 'form-data') {
    const rows = requestConfig.value.body.content as { key: string; value: string; description?: string; type?: string; fileName?: string }[];
    const fd = new FormData();
    (rows || []).forEach(r => {
      if (!r.key) return;
      fd.append(r.key, r.value ?? '');
    });
    data = fd;
    // Content-Type 由浏览器自动设置为 multipart/form-data，含边界
    delete headers['Content-Type'];
  } else if (bodyType === 'binary') {
    const bc = requestConfig.value.body.content as { fileName?: string; file?: File };
    if (bc?.file) {
      data = bc.file;
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/octet-stream';
    } else {
      data = '';
    }
  } else {
    data = undefined;
  }

  // 创建 axios 实例
  const client = axios.create({
    // 不设置 baseURL，允许完整 URL 直发；如需统一 base，可改用 import.meta.env.VITE_API_BASE
    timeout: 10000,
    headers,
  });
  attach401Redirect(client);

  const started = performance.now();
  try {
    const res = await client.request({
      method: method.value,
      url: targetUrl,
      params,
      data,
    });
    const elapsed = Math.round(performance.now() - started);
    responseData.value = res.data;
    responseHeaders.value = Object.fromEntries(Object.entries(res.headers || {}).map(([k, v]) => [k, String(v)]));
    responseStatus.value = res.status;
    responseTime.value = elapsed;
    ElMessage.success('请求成功');
    activeResponseTab.value = 'responseBody';
  } catch (e: any) {
    const elapsed = Math.round(performance.now() - started);
    responseData.value = e?.response?.data ?? { message: e?.message ?? 'Request failed' };
    responseHeaders.value = Object.fromEntries(Object.entries(e?.response?.headers || {}).map(([k, v]) => [k, String(v)]));
    responseStatus.value = e?.response?.status ?? null;
    responseTime.value = elapsed;
    ElMessage.error('请求失败');
    activeResponseTab.value = 'responseBody';
  }
};

const saveToLocal = () => {
  if (urlError.value) {
    ElMessage.error(urlError.value);
    return;
  }
  const store = useApiPostStore()
  const payload = {
    method: method.value,
    url: url.value,
    config: JSON.parse(JSON.stringify(requestConfig.value)) as RequestConfig,
    savedAt: new Date().toISOString(),
  }
  store.setLastRequest(payload)
  store.pushHistory(payload)
  try {
    localStorage.setItem('apiPost:last', JSON.stringify(payload))
    ElMessage.success('已存储到本地与状态管理')
  } catch {
    ElMessage.error('存储失败')
  }
}

const clearData = () => {
  method.value = 'GET'
  url.value = ''
  requestConfig.value = {
    params: [{ key: '', value: '', description: '' }],
    authorization: { type: 'None', token: '' },
    headers: [{ key: '', value: '', description: '' }],
    body: { type: 'raw', content: '' },
  }
  try {
    localStorage.removeItem('apiPost:last')
  } catch {}
  ElMessage.success('已清空输入数据')
}
// 监听 URL 变化，方便调试时查看验证效果
// watch(url, (newVal) => {
//   console.log('URL 验证结果:', urlError.value ? '错误' : '通过');
// });
</script>

<style scoped>
.api-debugger-card {
  max-width: 100%;
  margin: 20px auto;
}

.request-line {
  display: flex;
  gap: 10px;
  align-items: center;
}

.method-select {
  width: 120px;
  flex-shrink: 0;
}

.url-input {
  flex-grow: 1;
}

/* 错误样式 */
.is-error :deep(.el-input__inner) {
  border-color: var(--el-color-danger);
}

.url-error-tip {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.request-tabs,
.response-tabs {
  margin-top: 15px;
}
</style>
