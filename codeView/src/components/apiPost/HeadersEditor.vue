<template>
  <el-table :data="localData" style="width: 100%" size="small" class="key-value-table" :show-header="true">
    <el-table-column type="selection" width="55" />
    <el-table-column label="Key" prop="key" width="200">
      <template #header>
        <span class="table-header-key">Key</span>
      </template>
      <template #default="scope">
        <el-input v-model="scope.row.key" placeholder="Key" size="small" :disabled="scope.row.disabled" />
      </template>
    </el-table-column>
    <el-table-column label="Value" prop="value">
      <template #header>
        <span class="table-header-key">Value</span>
      </template>
      <template #default="scope">
        <el-input v-model="scope.row.value" placeholder="Value" size="small" :disabled="scope.row.disabled" />
      </template>
    </el-table-column>
    <el-table-column width="60">
      <template #default="scope">
        <el-button 
          type="danger" 
          :icon="Delete" 
          circle 
          plain 
          size="small"
          @click="removeRow(scope.$index)"
          :disabled="localData.length === 1 && scope.$index === 0"
        />
      </template>
    </el-table-column>
  </el-table>
  <div class="table-actions">
    <el-button type="primary" link @click="addRow">
      + 添加新行
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';

interface KeyValueRow {
  key: string;
  value: string;
  disabled?: boolean;
}

const props = defineProps<{
  modelValue: KeyValueRow[];
}>();

const emit = defineEmits(['update:modelValue']);

// 内部数据状态
const localData = ref<KeyValueRow[]>(props.modelValue && props.modelValue.length > 0 
  ? props.modelValue 
  : [{ key: '', value: '', disabled: false }]
);

// 监听 props 变化并同步到内部
watch(() => props.modelValue, (newVal) => {
  if (newVal !== localData.value) {
     localData.value = newVal && newVal.length > 0 
      ? newVal 
      : [{ key: '', value: '', disabled: false }];
  }
}, { deep: true, immediate: true });

// 监听内部变化并同步到父组件 (去除非空行)
watch(localData, (newVal) => {
  // 过滤掉 Key 和 Value 都为空的行，但保留至少一行用于编辑
  const filteredData = newVal.filter(row => row.key || row.value);
  emit('update:modelValue', filteredData);
}, { deep: true });

const addRow = () => {
  // 确保最后一行至少有一个空行可以编辑
  if (localData.value.length === 0 || localData.value[localData.value.length - 1].key !== '' || localData.value[localData.value.length - 1].value !== '') {
    localData.value.push({ key: '', value: '', disabled: false });
  }
};

const removeRow = (index: number) => {
  if (localData.value.length > 1) {
    localData.value.splice(index, 1);
  } else if (localData.value.length === 1) {
    // 如果是最后一行，则清空内容而不是删除
    localData.value[0].key = '';
    localData.value[0].value = '';
  }
};

// 初始加载时确保至少有一个空行
if (localData.value.length === 0) {
  addRow();
}
</script>

<style scoped>
.key-value-table {
  /* 移除 Element Plus 默认的底部边框，让表格更紧凑 */
  border-bottom: none;
}
:deep(.el-table__row) {
  height: 38px; /* 调整行高 */
}
:deep(.el-table__header) {
  background-color: #f7f7f7; /* 表头背景色 */
}
.table-header-key {
  font-weight: bold;
}
.table-actions {
  padding: 8px 0;
}
</style>