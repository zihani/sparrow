<template>
  <div class="body-editor">
    <el-radio-group v-model="localBody.type" @change="onTypeChange">
      <el-radio-button label="form-data">form-data</el-radio-button>
      <el-radio-button label="x-www-form-urlencoded">x-www-form-urlencoded</el-radio-button>
      <el-radio-button label="raw">raw</el-radio-button>
      <el-radio-button label="binary">binary</el-radio-button>
    </el-radio-group>
    <div class="body-content">
      <template v-if="localBody.type === 'form-data'">
        <el-table :data="formDataRows" style="width: 100%">
          <el-table-column label="Type" prop="type" width="140">
            <template #default="scope">
              <el-select v-model="scope.row.type" placeholder="Type" @change="syncFormData()" style="width: 120px">
                <el-option label="text" value="text" />
                <el-option label="file" value="file" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Key" prop="key">
            <template #default="scope">
              <el-input v-model="scope.row.key" placeholder="Key" @input="syncFormData()" />
            </template>
          </el-table-column>
          <el-table-column label="Value" prop="value">
            <template #default="scope">
              <template v-if="scope.row.type === 'text'">
                <el-input v-model="scope.row.value" placeholder="Value" @input="syncFormData()" />
              </template>
              <template v-else>
                <input type="file" @change="onFileChange($event, scope.$index)" />
                <div class="file-name" v-if="scope.row.fileName">文件：{{ scope.row.fileName }}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="Description" prop="description">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="Description" @input="syncFormData()" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="danger" link @click="removeRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" link @click="addRow" style="margin-top: 10px;">+ 添加</el-button>
      </template>
      <template v-else-if="localBody.type === 'x-www-form-urlencoded'">
        <el-table :data="urlEncodedRows" style="width: 100%">
          <el-table-column label="Key" prop="key">
            <template #default="scope">
              <el-input v-model="scope.row.key" placeholder="Key" @input="syncUrlEncoded()" />
            </template>
          </el-table-column>
          <el-table-column label="Value" prop="value">
            <template #default="scope">
              <el-input v-model="scope.row.value" placeholder="Value" @input="syncUrlEncoded()" />
            </template>
          </el-table-column>
          <el-table-column label="Description" prop="description">
            <template #default="scope">
              <el-input v-model="scope.row.description" placeholder="Description" @input="syncUrlEncoded()" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="danger" link @click="removeUrlRow(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" link @click="addUrlRow" style="margin-top: 10px;">+ 添加</el-button>
        <div class="encoded-preview">预览：{{ encodedPreview }}</div>
      </template>
      <el-input
        v-if="localBody.type === 'raw'"
        v-model="textContent"
        type="textarea"
        :rows="10"
        placeholder="Body content"
        @input="syncTextContent"
      />
      <template v-else-if="localBody.type === 'binary'">
        <div class="upload-row">
          <input type="file" @change="onBinaryChange" />
          <div class="file-name" v-if="binaryContent.fileName">已选择：{{ binaryContent.fileName }}</div>
        </div>
      </template>
      <div v-else-if="localBody.type === 'none'" class="placeholder">当前类型不支持编辑</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElRadioGroup, ElRadioButton, ElInput, ElTable, ElTableColumn, ElButton, ElSelect, ElOption } from 'element-plus'
import type { RequestConfig, FormDataRow, UrlEncodedRow, BinaryContent } from '@/interface/interface-apiPost'
const props = withDefaults(defineProps<{
  body: RequestConfig['body']
}>(), {
  body: { type: 'none', content: '' } as any
})
const emit = defineEmits(['update:body'])
const localBody = ref<RequestConfig['body']>(props.body)
const formDataRows = ref<FormDataRow[]>(
  Array.isArray(localBody.value.content)
    ? (localBody.value.content as FormDataRow[])
    : [{ key: '', value: '', description: '', type: 'text' }]
)
const urlEncodedRows = ref<UrlEncodedRow[]>(
  Array.isArray(localBody.value.content)
    ? (localBody.value.content as UrlEncodedRow[])
    : [{ key: '', value: '', description: '' }]
)
const textContent = ref<string>(typeof localBody.value.content === 'string' ? (localBody.value.content as string) : '')
const binaryContent = ref<BinaryContent>({ fileName: '' })
watch(() => props.body, (b) => {
  localBody.value = b
  if (b.type === 'form-data') {
    formDataRows.value = Array.isArray(b.content)
      ? (b.content as FormDataRow[])
      : [{ key: '', value: '', description: '', type: 'text' }]
  } else if (b.type === 'x-www-form-urlencoded') {
    urlEncodedRows.value = Array.isArray(b.content)
      ? (b.content as UrlEncodedRow[])
      : [{ key: '', value: '', description: '' }]
  } else if (b.type === 'binary') {
    binaryContent.value = (b.content as BinaryContent) ?? { fileName: '' }
  }
  textContent.value = typeof b.content === 'string' ? (b.content as string) : ''
}, { deep: true })
const emitUpdate = () => {
  if (localBody.value.type === 'form-data') {
    localBody.value = { ...localBody.value, content: [...formDataRows.value] }
  } else if (localBody.value.type === 'x-www-form-urlencoded') {
    localBody.value = { ...localBody.value, content: [...urlEncodedRows.value] }
  } else if (localBody.value.type === 'raw') {
    localBody.value = { ...localBody.value, content: textContent.value }
  } else if (localBody.value.type === 'binary') {
    localBody.value = { ...localBody.value, content: { ...binaryContent.value } }
  }
  emit('update:body', { ...localBody.value })
}
const onTypeChange = (val: string | number | boolean) => {
  const type = String(val) as RequestConfig['body']['type']
  if (type === 'form-data') {
    formDataRows.value = Array.isArray(localBody.value.content)
      ? (localBody.value.content as FormDataRow[])
      : [{ key: '', value: '', description: '', type: 'text' }]
    syncFormData()
  } else if (type === 'x-www-form-urlencoded') {
    urlEncodedRows.value = Array.isArray(localBody.value.content)
      ? (localBody.value.content as UrlEncodedRow[])
      : [{ key: '', value: '', description: '' }]
    syncUrlEncoded()
  } else if (type === 'raw') {
    textContent.value = typeof localBody.value.content === 'string' ? (localBody.value.content as string) : ''
    syncTextContent()
  } else {
    emitUpdate()
  }
}
const onBinaryChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    binaryContent.value = { fileName: file.name, file }
    emitUpdate()
  }
}
const syncTextContent = () => {
  if (localBody.value.type === 'raw' || localBody.value.type === 'x-www-form-urlencoded') {
    localBody.value = { ...localBody.value, content: textContent.value }
    emitUpdate()
  }
}
const syncFormData = () => {
  if (localBody.value.type === 'form-data') {
    localBody.value = { ...localBody.value, content: [...formDataRows.value] }
    emitUpdate()
  }
}
const onFileChange = (e: Event, index: number) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    formDataRows.value[index].fileName = file.name
    formDataRows.value[index].value = file.name
    syncFormData()
  }
}
const addRow = () => {
  formDataRows.value.push({ key: '', value: '', description: '', type: 'text' })
  syncFormData()
}
const removeRow = (index: number) => {
  formDataRows.value.splice(index, 1)
  syncFormData()
}
const syncUrlEncoded = () => {
  if (localBody.value.type === 'x-www-form-urlencoded') {
    localBody.value = { ...localBody.value, content: [...urlEncodedRows.value] }
    emitUpdate()
  }
}
const addUrlRow = () => {
  urlEncodedRows.value.push({ key: '', value: '', description: '' })
  syncUrlEncoded()
}
const removeUrlRow = (index: number) => {
  urlEncodedRows.value.splice(index, 1)
  syncUrlEncoded()
}
const encodedPreview = computed(() => {
  if (localBody.value.type !== 'x-www-form-urlencoded') return ''
  return urlEncodedRows.value
    .filter(r => r.key)
    .map(r => `${encodeURIComponent(r.key)}=${encodeURIComponent(r.value)}`)
    .join('&')
})
</script>

<style scoped>
.body-editor {
  display: grid;
  gap: 12px;
}
.body-content {
  margin-top: 6px;
}
.placeholder {
  color: #64748b;
  font-size: 13px;
}
</style>
