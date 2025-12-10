<template>
  <transition name="fade-slide">
    <div v-show="showScrollToTopBtn"
         class="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 group cursor-pointer"
         @click="scrollToTop">

      <!-- 按钮主体 -->
      <div class="flex items-center justify-center w-12 h-12 rounded-full bg-white text-gray-500 shadow-lg border border-gray-100
                  transform transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-xl hover:bg-sky-50 hover:text-sky-600 hover:border-sky-100
                  active:scale-95 active:shadow-md
                  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:shadow-gray-900/50
                  dark:hover:bg-gray-700 dark:hover:text-white dark:hover:border-gray-600">

        <!-- 图标 -->
        <svg class="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5" fill="none"
             stroke="currentColor" viewBox="0 0 24 24">
          <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/>
        </svg>

        <!-- 可选：添加进度圈或其他装饰（这里保持简洁，只做视觉优化） -->
      </div>

    </div>
  </transition>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'

// 是否展示返回顶部按钮
const showScrollToTopBtn = ref(false)

// 添加滚动监听
onMounted(() => window.addEventListener('scroll', handleScroll))

// 移除滚动监听
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll))

const handleScroll = () => {
  // 如果页面滚动超过300px，显示回到顶部按钮，否则隐藏
  showScrollToTopBtn.value = window.scrollY > 300
}

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0, // 距离顶部位置
    behavior: 'smooth' // 平滑滚动效果
  });
}
</script>

<style scoped>
/* 进场/离场动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>