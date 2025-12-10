<template>
  <div
      class="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <div class="max-w-lg w-full text-center space-y-8">

      <!-- 图标插画区域 -->
      <div class="relative mx-auto w-48 h-48 animate__animated animate__bounceIn">
        <!-- 背景光晕 -->
        <div
            class="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full filter blur-xl opacity-70 animate-pulse"></div>

        <!-- 锁图标 -->
        <div class="relative flex items-center justify-center w-full h-full">
          <svg class="w-32 h-32 text-red-500 dark:text-red-400 drop-shadow-xl" fill="none" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path
                class="opacity-30"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"/>
            <path d="M12 15V17" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            <path
                d="M12 15C12.8284 15 13.5 14.3284 13.5 13.5C13.5 12.6716 12.8284 12 12 12C11.1716 12 10.5 12.6716 10.5 13.5C10.5 14.3284 11.1716 15 12 15Z"
                fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"/>
            <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
            <path
                d="M6 11H18C19.1046 11 20 11.8954 20 13V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V13C4 11.8954 4.89543 11 6 11Z"
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          </svg>
        </div>
      </div>

      <!-- 文字内容区域 -->
      <div class="animate__animated animate__fadeInUp animate__delay-500ms">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl mb-2">
          访问被拒绝
        </h1>
        <p class="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {{ message || '抱歉，您当前的权限不足以访问此页面。' }}
        </p>

        <!-- 权限标签 -->
        <div v-if="requiredPermission" class="mt-6 flex justify-center">
            <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50 transition-colors">
                <svg class="mr-1.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"/>
                </svg>
                所需权限：{{ requiredPermission }}
            </span>
        </div>
      </div>

      <!-- 按钮操作区域 -->
      <div
          class="flex flex-col sm:flex-row justify-center gap-4 mt-8 animate__animated animate__fadeInUp animate__delay-1s">
        <button
            class="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200"
            @click="goBack">
          <svg class="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
          返回上一页
        </button>

        <button
            class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:-translate-y-0.5"
            @click="goHome">
          <svg class="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"/>
          </svg>
          返回首页 <span v-if="autoRedirect" class="ml-1 opacity-80 text-xs">({{ countdown }}s)</span>
        </button>
      </div>

      <!-- 底部提示 -->
      <div v-if="showContact"
           class="text-sm text-gray-400 dark:text-gray-500 animate__animated animate__fadeIn animate__delay-1s">
        如果您认为这是一个错误，请 <a class="text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300 underline underline-offset-4 decoration-sky-600/30 hover:decoration-sky-600 transition-all"
                                     href="mailto:admin@example.com">联系管理员</a>
      </div>

    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps({
  message: String,          // 自定义提示信息
  requiredPermission: String, // 需要的权限标识
  showContact: {            // 是否显示联系按钮
    type: Boolean,
    default: true
  },
  autoRedirect: {           // 是否开启自动跳转首页
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const countdown = ref(10)
let timer = null

const goBack = () => {
  stopTimer()
  router.go(-1)
}

const goHome = () => {
  stopTimer()
  router.push('/')
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(() => {
  if (props.autoRedirect) {
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        goHome()
      }
    }, 1000)
  }
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped>
/* 如果项目未全局引入 animate.css，可以在这里添加简单的关键帧动画
但根据之前的分析，项目中已经引入了 animate.css，所以直接使用类名即可
*/
</style>