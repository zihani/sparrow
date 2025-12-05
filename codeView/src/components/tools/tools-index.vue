<script setup lang="ts">
import { onMounted,onUnmounted, ref,type Ref,watch,reactive ,markRaw} from "vue";
import BenerateList from '@/components/tools/generateList.vue'
import { useToolsStore } from '@/stores/useToolsStore'
import type { Config } from '@/interface/interface-tools-index'
const toolsStore = useToolsStore()
defineProps(['modelValue']);
let activeIndex = ref('table')
let config:Config = {
    type: activeIndex.value, // 菜单类型
    status: 'init',  // init 初始化  edit保证数据存储刷新不丢失  complete 生成完成
    loding: false  // false结束加载  true 加载中。。。 
}
let vueTypeOptions = ref([{value:"vue2",label:"vue2"},{value:"vue3",label:"vue3"}])
let vueApiTypeOptions = ref([{value:"Options",label:"Options API"},{value:"Composition",label:"Composition API"}])
let vueComponentsOptions = ref([{value:"element",label:"element"},{value:"element-plus",label:"element-plus"}])
const handleSelect = (key: string, keyPath: string[]) => {
  activeIndex.value = key
}
const visibleChangeVueType  = (() =>{
     if(toolsStore.form.vueType === 'vue2') {
        vueApiTypeOptions.value = [{value:"Options",label:"Options API"}]
        return
    }
     vueApiTypeOptions.value = [{value:"Options",label:"Options API"},{value:"Composition",label:"Composition API"}]
})
const handleSubmit = (payload:string) => {
  console.log(payload) // 接收子组件数据
}
</script>
<template>
     <div style="padding-top: 80px; color:black;">
       <el-form :model="toolsStore.form" label-width="120px">
            <el-row>
                <el-col :span="6">  
                    <el-form-item label="vue版本" :rules="[{
                        type: 'string',
                        required: true,
                        message: '请选择一个版本',
                        trigger: 'blur'
                    }]" prop="vueType">
                        <el-select
                            v-model="toolsStore.form.vueType"
                            class="m-2"
                            placeholder="Select"
                            size="large"
                            style="width: 240px"
                            @visible-change="visibleChangeVueType"
                        >
                            <el-option
                            v-for="item in vueTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="api模式" :rules="[{
                        type: 'string',
                        required: true,
                        message: '请选择api模式',
                        trigger: 'blur'
                    }]" prop="vueApiType">
                        <el-select
                            v-model="toolsStore.form.vueApiType"
                            class="m-2"
                            placeholder="Select"
                            size="large"
                            style="width: 240px"
                        >
                            <!---->
                            <el-option
                            v-for="item in vueApiTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="组件库" :rules="[{
                        type: 'string',
                        required: true,
                        message: '请选择组件库',
                        trigger: 'blur',
                    }]" prop="vueComponents">
                        <el-select
                        v-model="toolsStore.form.vueComponents"
                        class="m-2"
                        placeholder="Select"
                        size="large"
                        style="width: 240px"
                        >
                            <el-option
                            v-for="item in vueComponentsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="语言" :rules="[{
                        type: 'string',
                        required: true,
                        message: '请选择js/ts',
                        trigger: 'blur',
                    }]" prop="codeType">
                        <el-select
                        v-model="toolsStore.form.codeType"
                        class="m-2"
                        placeholder="Select"
                        size="large"
                        style="width: 240px"
                        >
                            <el-option label="javaScript" value="js"/>
                            <el-option label="TypeScript" value="ts"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
         <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
        >
            <el-menu-item index="table"> 表格设计生成 </el-menu-item>
            <el-menu-item index="from">表单设计</el-menu-item>
        </el-menu>
        <BenerateList @submit="handleSubmit" :config="config" v-if='activeIndex==="table"' />
     </div>
</template>
<style>
</style>