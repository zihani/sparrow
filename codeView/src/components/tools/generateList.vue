<script setup lang="ts">
import { onMounted, onUnmounted, ref,type Ref, watch, reactive } from "vue";
import type { PropType } from 'vue';
import { useToolsStore } from '@/stores/useToolsStore'
import draggable from 'vuedraggable'
import type { FormInstance } from '@hc/element-plus'
import useClipboard from 'vue-clipboard3'
import { Vue3TemplateComposition } from '@/template/vue3-Composition.ts'
// import { formatCode } from '@/template/parser.ts'
import type { CreateTable } from '@/interface/interface-generate-list'
const toolsStore = useToolsStore()
const { toClipboard } = useClipboard()
defineProps({
  config: {
    type: Object as PropType<{
      type: string;
      status: string;
      loding: Boolean;
    }>,
    required: true
  }
});

const refCode = ref('')
const emit = defineEmits(['submit', 'update'])
const tableData = ref([{id:0}])
const show = ref(true)
// 读取状态管理
const activeName = ref('view')
const code = ref('div')
const createTable:Ref<Array<CreateTable>> = ref([{prop:"",label:"",showHeader: true}])
const onAddRow = (()=>{
    toolsStore.addTableRow({field:"",fieldName:"",rowShow:true})
})
const onDragEnd = (() =>{
    try {
     //拖拽开始
    } catch (error) {
        console.log(error)
    }
})
const arrow = (() =>{
    try {
       show.value = !show.value
     //拖拽开始
    } catch (error) {
        console.log(error)
    }
})
const formRef = ref<FormInstance>()
const createTableComponent = (formEl: FormInstance | undefined) =>{
        try {
              if (!formEl) return
              formEl.validate((valid:boolean) => {
                    if (valid) {
                        let tableColumns = []
                        createTable.value = []
                        // 选择一个vue 版本 2x 3x
                        // 选择一个组合式api 选择式api
                        // 使用的组件库 
                        // 跳转到代码显示页面 添加拷贝按钮提升开发效率
                        for (const item of toolsStore.tableRow) {
                            // console.log(item)
                            createTable.value.push({prop: item.field,label:item.fieldName,showHeader:item.rowShow})
                            tableColumns.push(`<el-table-column prop="${item.field}" label="${item.fieldName}" />`)
                        }
                        show.value = false
                        createTable.value
                        let template:string = tableColumns.join('\n')
                        code.value = Vue3TemplateComposition({template})
                    } else {
                        console.log('error submit!')
                        return false
                    }
               })
            // 使用模版字符串生成代码结构
        } catch (error) {
            console.log(error)
        }
}

const copyBtn = async ()=>{
    try {
         await toClipboard(refCode.value);
    } catch (e) {
        console.error(e)
    }
}

</script>
<template>
    <div style="color:black;">
        <img @click="arrow" style="margin-top: 10px; margin-left: 10px;" src="@/assets/img/arrow-left.svg" alt="">
          <draggable 
            v-model="toolsStore.tableRow" 
            item-key="id"
            @end="onDragEnd"
            v-if="show"
            >
            <template #item="{ element }">
                 <div>
                    <el-form :model="element" label-width="120px" v-show="true" ref="formRef" >
                        <el-row>
                            <el-col :span="6">  
                                <el-form-item label="字段:" prop="field" :rules="[{
                                    type: 'string',
                                    required: true,
                                    message: '请填写字段!',
                                    trigger: 'blur'
                                }]">
                                    <el-input v-model="element.field" placeholder="请输入字段!" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="字段名称:"  prop="fieldName"  :rules="[{
                                    type: 'string',
                                    required: true,
                                    message: '请填写字段名称!',
                                    trigger: 'blur'
                                }]">
                                    <el-input v-model="element.fieldName" placeholder="请输入字段名称！" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否显示:"  >
                                     <el-switch v-model="element.rowShow" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                 </div>
            </template>
        </draggable>
            <!-- <el-row v-for="(item, key ) in addrow" :key="key">
                <el-col :span="6">  
                    <el-form-item label="字段:" :rules="[{
                        type: 'field',
                        required: true,
                        message: '请填写字段!',
                        trigger: 'blur'
                    }]">
                        <el-input v-model="item.field" placeholder="Please input" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="字段名称:"  :rules="[{
                        type: 'fieldName',
                        required: true,
                        message: '请填写字段名称!',
                        trigger: 'blur'
                    }]">
                        <el-input v-model="item.fieldName" placeholder="Please input" />
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row  v-if="show">
                <el-col :span="6">  
                     <el-button type="primary" @click="onAddRow">新增列</el-button> 
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="createTableComponent(formRef)">生成列表代码</el-button> 
                </el-col>
            </el-row>
            <el-tabs style="margin-left: 10px; margin-top: 10px;" v-if="!show" v-model="activeName" class="demo-tabs">
                <el-tab-pane label="预览" name="view"> 
                    <el-table  :data="tableData" style="width: 100%;">
                       <el-table-column v-for="(item , key) in createTable"  :key="key" :prop="item.prop" :label="item.label" :show-header="item.showHeader" width="180" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="代码" name="code">
                    <el-button @click="copyBtn"> 一键复制 </el-button> 
                    <!-- <div> 111 </div> -->
                     <div  ref="refCode">
                        <highlightjs 
                        class="refCode"
                        language="javascript"
                        :autodetect="false"
                        :code="code"
                        />
                     </div>
                </el-tab-pane>
            </el-tabs>
           
    </div>
</template>
<style scoped>
  
</style>