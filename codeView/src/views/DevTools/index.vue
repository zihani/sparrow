<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const openGenerateList = (()=>{
    router.push('/generate');
});
const openDevTools = (()=>{
    router.push('/apiPost');
});
</script>
<template>
    <div class="DevTools">
        <div class="container" style="padding-top: 80px;">
            <el-row :gutter="20">
                <el-col :span="6">
                     <div class="card" @click="openGenerateList()">
                         <div class="card-header">
                            <img src="@/assets/wrench.svg" alt="扳手">
                        </div>
                        <div class="card-content">
                            <div>
                                <h3 class="card-title">组件生成工具</h3>
                                <p class="card-desc">内置了vue 版本和ui组件的选择</p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="card" @click="openDevTools()">
                        <div class="card-header">
                            <img src="@/assets/wrench.svg" alt="扳手">
                        </div>
                        <div class="card-content">
                            <div>
                                <h3 class="card-title">apiPost</h3>
                                <p class="card-desc">API 请求调试工具</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<style scoped >
 .card-header {
    height: 180px;
    overflow: hidden;
 }
.card-header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}
.item {

}
.card {
    margin: 20px;
    width: 280px;
    height: 280px;
    border-radius: 15px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
    background: #ffffff;
    display: flex;
    flex-direction: column;
}

.card-content {
    padding: 20px;
    color: #fff;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    font-size: 1.4rem;
    margin-bottom: 10px;
    color: #000000;
}

.card-desc {
    font-size: 0.9rem;
    color: #000000;
    line-height: 1.5;
}

/* 边框效果 */
.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    padding: 3px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.7;
    transition: opacity 0.5s ease, background 0.5s ease;
}

/* 悬浮效果 */
.card:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.card:hover::before {
    opacity: 1;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    animation: border-animation 3s linear infinite;
}

.card:hover .card-header img {
    transform: scale(1.1);
}

.card:hover .card-btn::before {
    left: 0;
}

.card:hover .card-btn {
    color: white;
}

/* 边框动画 */
@keyframes border-animation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

h1 {
    text-align: center;
    color: white;
    margin-bottom: 40px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    width: 100%;
    font-size: 2.5rem;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
