<template>
  <section style="height: 94vh" class="bg-gradient-to-r text-white flex items-center justify-center">
    <!-- 固定背景图 -->
    <div class="hero-background"></div>

    <!-- 内容容器 -->
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ siteName }}</h1>
      <p ref="typewriterText" class="text-lg md:text-xl mb-8 relative h-6">
        <span class="inline-block min-w-full">{{ currentText }}</span>
      </p>

      <!-- 下滑查看更多按钮 -->
      <a class="block text-center cursor-pointer group absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <!-- 提示文字 -->
        <span class="mt-2 text-sm text-white opacity-80 group-hover:opacity-100 transition-opacity">
            下滑查看更多
          </span>
        <div class="flex flex-col items-center animate-bounce-slow">
          <!-- 向下箭头 -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"/>
          </svg>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from 'vue'

const siteName = import.meta.env.VITE_SITE_NAME

const typewriterText = ref(null)
const texts = [
  "欢迎来到我的博客！",
  "分享技术与生活的点滴。",
  "一起探索网络空间的奥秘。"
]
const currentTextIndex = ref(0)
const currentCharIndex = ref(0)
const isDeleting = ref(false)
const currentText = ref('')

const typingSpeed = 100
const deletingSpeed = 50
const pauseBetween = 1000

let animationFrame = null

const typeWriter = () => {
  const currentText = texts[currentTextIndex.value]

  if (!isDeleting.value && currentCharIndex.value <= currentText.length) {
    typewriterText.value.textContent = currentText.slice(0, currentCharIndex.value)
    currentCharIndex.value++
  } else if (isDeleting.value && currentCharIndex.value >= 0) {
    // 修改这里实现逐个字符消失效果
    typewriterText.value.textContent = currentText.slice(0, currentCharIndex.value)
    currentCharIndex.value--
  }

  if (currentCharIndex.value > currentText.length) {
    isDeleting.value = true
    setTimeout(() => {
      typeWriter()
    }, pauseBetween)
    return
  }

  // 当前文本完全消失后，开始下一个文本的显示
  if (currentCharIndex.value === 0 && isDeleting.value) {
    isDeleting.value = false
    currentTextIndex.value = (currentTextIndex.value + 1) % texts.length
  }

  const speed = isDeleting.value ? deletingSpeed : typingSpeed
  animationFrame = setTimeout(typeWriter, speed)
}

onMounted(() => {
  typeWriter()
})
</script>

<style scoped>
/* 光标闪烁效果 */
.typing-cursor::after {
  content: '|';
  display: inline-block;
  width: 2px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0;
  }
}

/* 缓慢上下浮动动画 */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* 背景图样式 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/image/bgxn.jpg'); /* 示例图片，可替换为你自己的图片地址 */
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* 关键属性：背景固定不随滚动动 */
  background-repeat: no-repeat;
  filter: brightness(0.6); /* 可选：让背景暗一点，突出文字 */
  z-index: -1;
}
</style>
