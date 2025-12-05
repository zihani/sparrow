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
        placeholder="请输入请求 URL (http:// 或 https://)"
        class="url-input"
        :class="{ 'is-error': urlError }"
      >
        <template #suffix>
          <el-icon v-if="urlError" class="el-input__icon"><Warning /></el-icon>
        </template>
      </el-input>

      <el-button type="primary" :disabled="false" @click="sendRequest">发送</el-button>
    </div>
    <div v-if="urlError" class="url-error-tip">{{ urlError }}</div>
    
    <el-tabs v-model="activeRequestTab" class="request-tabs">
      <el-tab-pane label="Params" name="params">
        <ParamsEditor v-model:params="requestConfig.params" />
      </el-tab-pane>
      <el-tab-pane label="Authorization" name="authorization">
        <AuthorizationConfig v-model:authConfig="requestConfig.authorization" />
      </el-tab-pane>
      <el-tab-pane label="Headers" name="headers">
         {{ requestConfig.headers }}
        <HeadersEditor v-model:headers="requestConfig.headers" />
      </el-tab-pane>
      <el-tab-pane label="Body" name="body">
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
import { ref, watch, computed } from 'vue';
import { ElMessage, ElCard, ElInput, ElButton, ElSelect, ElOption, ElTabs, ElTabPane, ElDivider, ElIcon } from 'element-plus';
import { Warning } from '@element-plus/icons-vue';

// 假设我们有这些子组件，它们需要单独实现
import ParamsEditor from '../apiPost/ParamsEditor.vue';
import AuthorizationConfig from '../apiPost/AuthorizationConfig.vue';
import HeadersEditor from '../apiPost/HeadersEditor.vue';
import BodyEditor from '../apiPost/BodyEditor.vue';
import ResponseDisplay from '../apiPost/ResponseDisplay.vue';
import ResponseHeadersDisplay from '../apiPost/ResponseHeadersDisplay.vue';
import KeyValueTable from '../apiPost/KeyValueTable.vue';

// --- 类型定义 ---

// 定义支持的 HTTP 方法
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';

// 请求配置的结构
interface RequestConfig {
  params: { key: string, value: string }[];
  authorization: { type: 'None' | 'Bearer Token', token: string };
  headers: { key: string, value: string }[];
  body: { type: 'none' | 'raw' | 'form-data', content: string };
}

// 响应结果的结构 (简化)
interface ApiResponse {
  status: number;
  time: number; // ms
  headers: Record<string, string>;
  data: any;
}


// --- 核心逻辑 ---

// 1. URL 和方法
const methodsOptions: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'CONNECT'];
const method = ref<HttpMethod>('GET');
const url = ref<string>('');

// HTTP/HTTPS 正则表达式
// 匹配 http:// 或 https:// 开头，后面跟着至少一个字符 (域名/IP)
const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;

const urlError = computed(() => {
  console.log('Validating URL:', url.value);
  console.log('Validating URL:', url.value);
  console.log('Validating URL:', url.value);
  if (url.value.length === 0) {
    return 'URL 不能为空';
  }
  if (!urlRegex.test(url.value)) {
    return 'URL 格式不正确，请确保以 http:// 或 https:// 开头';
  }
  return '';
});

// 2. 请求配置
const activeRequestTab = ref('params');
const requestConfig = ref<RequestConfig>({
  params: [{ key: '', value: '' }],
  authorization: { type: 'None', token: '' },
  headers: [{ key: '', value: '' }],
  body: { type: 'raw', content: '{\n  \n}' },
});

// 3. 响应结果
const activeResponseTab = ref('responseBody');
const responseData = ref<any>(null);
const responseHeaders = ref<Record<string, string>>({});
const responseStatus = ref<number | null>(null);
const responseTime = ref<number | null>(null);


/**
 * 模拟发送请求
 */
const sendRequest = () => {
  if (urlError.value) {
    ElMessage.error(urlError.value);
    return;
  }
  
  // 实际项目中，这里会调用 axios/fetch 等进行网络请求
  
  // 模拟 API 调用过程
  ElMessage.info(`正在发送 ${method.value} 请求到: ${url.value}`);
  console.log('请求配置:', JSON.parse(JSON.stringify(requestConfig.value)));
  
  // 模拟响应数据
  const mockResponse: ApiResponse = {
    status: 200,
    time: Math.floor(Math.random() * 500) + 100, // 100-600ms
    headers: {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Node.js',
    },
    data: {
      code: 0,
      message: 'Success',
      data: {
        id: 1,
        method: method.value,
        url: url.value,
        timestamp: new Date().toISOString()
      }
    }
  };

  // 更新响应状态
  responseData.value = mockResponse.data;
  responseHeaders.value = mockResponse.headers;
  responseStatus.value = mockResponse.status;
  responseTime.value = mockResponse.time;

  ElMessage.success('请求成功，请查看返回数据');
  activeResponseTab.value = 'responseBody'; // 切换到响应 Body 视图
};

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