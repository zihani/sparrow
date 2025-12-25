<template>
  <div class="auth-config">
    <el-row :gutter="16">
      <el-col :span="8">
        <el-form label-position="top">
          <el-form-item label="auth type">
            <el-select
              v-model="localAuth.type"
              filterable
              clearable
              placeholder="选择认证类型"
              @change="emitUpdate"
            >
              <el-option v-for="opt in authTypes" :key="opt" :label="opt" :value="opt" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="16">
        <el-form label-position="top">
          <el-form-item label="credential">
            <el-input
              v-model="localAuth.token"
              placeholder="输入凭证或令牌"
              @input="emitUpdate"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElRow, ElCol, ElForm, ElFormItem, ElSelect, ElOption, ElInput } from 'element-plus'
import type { AuthType } from '@/interface/interface-apiPost'

const props = defineProps<{
  authConfig: { type: AuthType, token: string }
}>()
const emit = defineEmits(['update:authConfig'])

const authTypes: AuthType[] = [
  'Basic Auth',
  'Bearer Token',
  'JWT Bearer',
  'Digest Auth',
  'OAuth 1.0',
  'OAuth 2.0',
  'Hawk Authentication',
  'AWS Signature',
  'NTLM Authentication',
  'API Key',
  'Akamai EdgeGrid',
  'ASAP (AtIassian)',
  'None',
]

const localAuth = ref<{ type: AuthType, token: string }>(props.authConfig)
watch(() => props.authConfig, (v) => {
  localAuth.value = v
}, { deep: true })

const emitUpdate = () => {
  emit('update:authConfig', { ...localAuth.value })
}
</script>

<style scoped>
.auth-config {
  padding: 8px 0;
}
</style>
