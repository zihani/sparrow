import type { vue3TemplateOption } from '@/interface/vue3TemplateComposition';
// Vue3组合式API模板生成器
export const Vue3TemplateComposition = function generateVue3Template(option: vue3TemplateOption): string{
  if(!Reflect.has(option, 'componentName')){
      option['componentName'] = 'MyComponent'
  }
  if(!Reflect.has(option, 'props')){
      option['props'] = []
  }
  if(!Reflect.has(option, 'setupReturn')){
      option['setupReturn'] = []
  }
  if(!Reflect.has(option, 'imports')){
      option['imports'] = ["ref", "computed"]
  }
  if(!Reflect.has(option, 'lifecycleHooks')){
      option['lifecycleHooks'] = ["onMounted"]
  }
  if(!Reflect.has(option, 'methods')){
      option['methods'] = []
  }
  if(!Reflect.has(option, 'template')){
      option['template'] = ''
  }
  if(!Reflect.has(option, 'variable')){
      option['variable'] = ''
  }
  const { variable, template, methods, lifecycleHooks, imports, setupReturn, props, componentName } = option
  const codeType = 'ts'
  // 生成import语句
  const importStatements = imports.length > 0 
    ? `import { ${imports.join(', ')} } from 'vue'`
    : '';

  // 生成props类型定义
  const propsDeclaration = props.length > 0
    ? `const props = defineProps({\n${props.map(p => `  ${p.name}: ${p.type}`).join(',\n')}\n})`
    : '';

  // 生成setup返回内容
  const setupReturnContent = setupReturn.length > 0
    ? `return {\n${setupReturn.map(item => `  ${item}`).join(',\n')}\n}`
    : '';

  // 生成生命周期钩子
  const lifecycleCode = lifecycleHooks.map(hook => {
    return `  ${hook}(() => {\n    // ${hook} 逻辑\n  })`;
  }).join('\n');

  // 生成方法
  const methodsCode = methods.map(method => {
    return `  const ${method.name} = ${method.isAsync ? 'async ' : ''}() => {\n    ${method.body || '// 方法实现'}\n  }`;
  }).join('\n\n');
  
  // 生成变量
  const variableAny = variable
  return `<script setup${codeType === 'ts' ? ' lang="ts"':''}>
${importStatements}
${propsDeclaration}
${variableAny}
${methodsCode}
${lifecycleCode}
${setupReturnContent}
</script>

<template>
  ${template}
</template>

<style scoped>
/* 组件样式 */
</style>`;
}