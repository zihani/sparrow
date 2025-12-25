<template>
  <el-table :data="localParams" style="width: 100%">
    <el-table-column label="Key" prop="key">
      <template #default="scope">
        <el-input v-model="scope.row.key" placeholder="Key"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="Value" prop="value">
      <template #default="scope">
        <el-input v-model="scope.row.value" placeholder="Value"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="Description" prop="description">
      <template #default="scope">
        <el-input v-model="scope.row.description" placeholder="Description"></el-input>
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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton } from 'element-plus';

interface ParamRow {
  key: string;
  value: string;
  description: string;
}

const props = defineProps<{
  params: ParamRow[];
}>();

const emit = defineEmits(['update:params']);

// 使用内部副本，通过 watch 同步到父组件
const localParams = ref<ParamRow[]>(props.params);

watch(localParams, (newVal) => {
  emit('update:params', newVal);
}, { deep: true });

const addRow = () => {
  localParams.value.push({ key: '', value: '', description: '' });
};

const removeRow = (index: number) => {
  localParams.value.splice(index, 1);
};
</script>