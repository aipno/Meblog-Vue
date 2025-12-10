<template>
  <section class="relative h-[94vh] flex items-center justify-center overflow-hidden">
    <!-- 背景图层 -->
    <div class="absolute inset-0 z-0">
      <!-- 背景图片：使用 fixed 实现视差滚动感 -->
      <div class="hero-background absolute inset-0 w-full h-full"></div>
      <!-- 遮罩层：从黑到透明的渐变，或者是半透明黑色，保证文字清晰度 -->
      <div class="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
    </div>

    <!-- 内容容器 -->
    <div class="relative z-20 container mx-auto px-4 text-center">
      <!-- 站点标题 -->
      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 text-white tracking-tight drop-shadow-xl animate__animated animate__fadeInDown">
        {{ siteName }}
      </h1>

      <!-- 打字机文本 -->
      <div class="h-8 md:h-12 flex justify-center items-center animate__animated animate__fadeIn animate__delay-1s">
        <p class="text-xl md:text-3xl text-gray-100 font-light tracking-wide">
          <span ref="typewriterText" class="typing-text"></span><span class="typing-cursor">|</span>
        </p>
      </div>
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
import {onMounted, onUnmounted, ref} from 'vue'

const siteName = import.meta.env.VITE_SITE_NAME

// 打字机相关逻辑
const typewriterText = ref(null)
const texts = [
  "欢迎来到我的博客！",
  "分享技术与生活的点滴。",
  "一起探索网络空间的奥秘。"
]
const currentTextIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)

const typingSpeed = 150 // 打字速度稍慢一点，更有质感
const deletingSpeed = 60
const pauseBetween = 1500 // 停留时间

let timerId = null // 用于存储定时器 ID

const typeWriter = () => {
  // 增加防御性判断，防止组件卸载后 ref 为空导致报错
  if (!typewriterText.value) return;

  const currentText = texts[currentTextIndex.value]

  if (!isDeleting.value && currentCharIndex.value <= currentText.length) {
    // 输入过程
    typewriterText.value.textContent = currentText.slice(0, currentCharIndex.value)
    currentCharIndex.value++
  } else if (isDeleting.value && currentCharIndex.value >= 0) {
    // 删除过程
    typewriterText.value.textContent = currentText.slice(0, currentCharIndex.value)
    currentCharIndex.value--
  }

  // 状态切换逻辑
  let nextSpeed = isDeleting.value ? deletingSpeed : typingSpeed;

  if (!isDeleting.value && currentCharIndex.value > currentText.length) {
    // 完成输入，准备删除
    isDeleting.value = true
    nextSpeed = pauseBetween
  } else if (isDeleting.value && currentCharIndex.value === 0) {
    // 完成删除，准备输入下一句
    isDeleting.value = false
    currentTextIndex.value = (currentTextIndex.value + 1) % texts.length
    nextSpeed = 500 // 开始下一句前的小停顿
  }

  timerId = setTimeout(typeWriter, nextSpeed)
}

// 平滑滚动到内容区域
const scrollToContent = () => {
  window.scrollTo({
    top: window.innerHeight - 60, // 减去头部导航的高度
    behavior: 'smooth'
  });
}

onMounted(() => {
  typeWriter()
})

// 优化：组件销毁时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timerId) {
    clearTimeout(timerId)
  }
})
</script>

<style scoped>
/* 背景图样式 */
.hero-background {
  background-image: url('@/assets/image/bgxn.jpg'); /* 请确保此图片存在，或者替换为网络图片 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 视差滚动核心 */
  background-repeat: no-repeat;
  /* 移除原有的 filter，改用 Overlay 层来处理亮度，性能更好且不影响背景边缘 */
}

/* 光标闪烁动画 */
.typing-cursor {
  display: inline-block;
  color: white;
  margin-left: 2px;
  font-weight: 100;
  animation: blink 1s step-end infinite;
}

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