<template>
  <section class="relative h-[94vh] flex items-center justify-center overflow-hidden">
    <!-- 背景图层 -->
    <div class="absolute inset-0 z-0">
      <!-- 背景图片：使用 fixed 实现视差滚动感 -->
      <div class="relative w-full h-full">
        <GridDistortion
            :grid="15"
            :imageSrc="backgroundImage"
            :mouse="0.1"
            :relaxation="0.9"
            :strength="0.15"
            className="custom-class"
        />
      </div>
    </div>

    <!-- 内容容器 -->
    <div class="relative z-20 container mx-auto px-4 text-center">
      <!-- 站点标题 -->
      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight drop-shadow-xl animate__animated animate__fadeInDown">
        {{ siteName }}
      </h1>

      <!-- 打字机文本 -->
      <TextType
          :deletingSpeed="80"
          :pauseDuration="1500"
          :showCursor="true"
          :text="texts"
          :typingSpeed="135"
          class="text-xl md:text-3xl text-gray-100 font-light"
          cursorCharacter="|"
      />
    </div>

    <!-- 下滑引导 -->
    <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
         @click="scrollToContent">
      <div class="flex flex-col items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
        <span class="text-xs md:text-sm text-gray-300 uppercase tracking-widest font-light">下滑查看更多</span>
        <!-- 鼠标动画图标 -->
        <div class="w-[26px] h-[42px] border-2 border-white rounded-full flex justify-center p-1 box-border">
          <div class="w-1 h-2 bg-white rounded-full animate-scroll-wheel"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {onMounted, onUnmounted} from 'vue'
import GridDistortion from "@/components/GridDistortion.vue";
import TextType from "@/components/TextType.vue";
import backgroundImage from '@/assets/image/bgxn.jpg'

const siteName = import.meta.env.VITE_SITE_NAME

const texts = [
  "欢迎来到我的博客！",
  "分享技术与生活的点滴。",
  "一起探索网络空间的奥秘。"
]
let timerId = null // 用于存储定时器 ID

// 平滑滚动到内容区域
const scrollToContent = () => {
  window.scrollTo({
    top: window.innerHeight - 60, // 减去头部导航的高度
    behavior: 'smooth'
  });
}

onMounted(() => {
})

// 优化：组件销毁时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timerId) {
    clearTimeout(timerId)
  }
})
</script>

<style scoped>
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 鼠标滚轮动画 */
@keyframes scroll-wheel {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

.animate-scroll-wheel {
  animation: scroll-wheel 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
}
</style>