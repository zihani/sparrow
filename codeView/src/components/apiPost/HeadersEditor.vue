<template>
  <el-table :data="localHeaders" style="width: 100%">
    <el-table-column label="Key" prop="key">
      <template #default="scope">
        <el-select
          v-model="scope.row.key"
          filterable
          remote
          :remote-method="onQueryHeaders"
          reserve-keyword
          allow-create
          default-first-option
          clearable
          placeholder="Key"
          style="width: 100%"
        >
          <el-option
            v-for="item in headerKeyOptions"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="Value" prop="value">
      <template #default="scope">
        <el-select
          v-model="scope.row.value"
          filterable
          remote
          :remote-method="makeValueQuery(scope.$index)"
          reserve-keyword
          allow-create
          default-first-option
          clearable
          placeholder="Value"
          style="width: 100%"
        >
          <el-option
            v-for="opt in (valueOptionsMap[scope.$index] || [])"
            :key="opt"
            :label="opt"
            :value="opt"
          />
        </el-select>
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
import { ElTable, ElTableColumn, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';

interface HeaderRow {
  key: string;
  value: string;
  description: string;
}

const props = defineProps<{
  headers: HeaderRow[];
}>();

const emit = defineEmits(['update:headers']);

const localHeaders = ref<HeaderRow[]>(props.headers);

const headerKeyOptions: string[] = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Access-Control-Request-Headers',
  'Access-Control-Request-Method',
  'Authorization',
  'Cache-Control',
  'Content-MD5',
  'Content-Length',
  'Content-Transfer-Encoding',
  'Content-Type',
  'Cookie',
  'Cookie 2',
  'Date',
  'Expect',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Keep-Alive',
  'Max-Forwards',
  'Origin',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'TE',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'User-Agent',
  'Via',
  'Warning',
  'X-Requested-With',
  'X-Do-Not-Track',
  'DNT',
  'x-api-key',
  'x-mock-match-request-body',
  'x-mock-match-request-headers',
  'x-mock-response-id',
  'x-mock-response-name',
  'x-mock-response-code',
  'x-mock-response-delay',
  'Connection',
];

const headerKeyOptionsAll = [...headerKeyOptions];

const mimeTypesAll: string[] = [
  'application/atom+xml',
  'application/ecmascript',
  'application/json',
  'application/vnd.api+json',
  'application/javascript',
  'application/octet-stream',
  'application/ogg',
  'application/pdf',
  'application/postscript',
  'application/rdf+xml',
  'application/rss+xml',
  'application/soap+xml',
  'application/font-woff',
  'application/x-yaml',
  'application/xhtml+xml',
  'application/xml',
  'application/xml-dtd',
  'application/xop+xml',
  'application/zip',
  'application/gzip',
  'application/graphql',
  'application/x-www-form-urlencoded',
  'audio/basic',
  'audio/L24',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/vorbis',
  'audio/vnd.rn-realaudio',
  'audio/vnd.wave',
  'audio/webm',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'message/http',
  'message/imdn+xml',
  'message/partial',
  'message/rfc822',
  'multipart/mixed',
  'multipart/alternative',
  'multipart/related',
  'multipart/form-data',
  'multipart/signed',
  'multipart/encrypted',
  'text/cmd',
  'text/css',
  'text/csv',
  'text/html',
  'text/plain',
  'text/vcard',
  'text/xml',
];

const valueOptionsMap = ref<Record<number, string[]>>({});

const baseOptionsForKey = (key: string): string[] => {
  const k = (key || '').toLowerCase();
  return k === 'content-type' || k === 'accept' ? mimeTypesAll : [];
};

watch(localHeaders, (newVal) => {
  emit('update:headers', newVal);
}, { deep: true });

watch(localHeaders, (rows) => {
  rows.forEach((row, index) => {
    valueOptionsMap.value[index] = baseOptionsForKey(row.key);
  });
}, { deep: true, immediate: true });

const addRow = () => {
  localHeaders.value.push({ key: '', value: '', description: '' });
  const idx = localHeaders.value.length - 1;
  valueOptionsMap.value[idx] = baseOptionsForKey(localHeaders.value[idx].key);
};

const removeRow = (index: number) => {
  localHeaders.value.splice(index, 1);
  delete valueOptionsMap.value[index];
};

const isFuzzyMatch = (query: string, target: string) => {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();
  if (!q) return true;
  if (t.includes(q)) return true;
  let ti = 0;
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    ti = t.indexOf(ch, ti);
    if (ti === -1) return false;
    ti++;
  }
  return true;
};

const onQueryHeaders = (query: string) => {
  const q = query ?? '';
  (headerKeyOptions as string[]).splice(0, headerKeyOptions.length, ...headerKeyOptionsAll.filter((opt) => isFuzzyMatch(q, opt)));
};

const onQueryValue = (query: string, index: number) => {
  const base = baseOptionsForKey(localHeaders.value[index]?.key || '');
  const q = query ?? '';
  valueOptionsMap.value[index] = base.filter((opt) => isFuzzyMatch(q, opt));
};

const makeValueQuery = (index: number) => {
  return (q: string) => onQueryValue(q, index);
};
</script>
