
export function generateVue3OptionsTemplate() {
  return `<!-- Vue3选项式API模板 -->
<template>
  <div class="app-container">
    <h1>{{ title }}</h1>
    <p>状态值: {{ counter }}</p>
    <button @click="increment">增加</button>
    <p>计算属性: {{ formattedCounter }}</p>
  </div>
</template>

<script>
export default {
  name: 'Vue3OptionsDemo',
  data() {
    return {
      title: 'Vue3选项式API示例',
      counter: 0
    }
  },
  computed: {
    formattedCounter() {
      return \`当前值: \${this.counter}\`
    }
  },
  methods: {
    increment() {
      this.counter++
    }
  },
  watch: {
    counter(newVal) {
      console.log('计数器变化:', newVal)
    }
  },
  mounted() {
    console.log('组件已挂载')
  }
}
</script>

<style scoped>
.app-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial;
}
button {
  background: #42b983;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>`
}