<template>
  <div v-if="titles && titles.length > 0"
       class="sticky top-[5.5rem] w-full p-5 mb-5 bg-white border border-gray-100 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all duration-300">

    <!-- 目录标题 -->
    <h2 class="flex items-center mb-4 text-base font-bold text-gray-800 uppercase dark:text-gray-100">
      <!-- 目录图标 -->
      <svg class="inline icon w-5 h-5 mr-2" height="200" p-id="4043"
           version="1.1" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M857.6 25.6a76.8 76.8 0 0 1 76.8 76.8v819.2a76.8 76.8 0 0 1-76.8 76.8H166.4a76.8 76.8 0 0 1-76.8-76.8V102.4a76.8 76.8 0 0 1 76.8-76.8h691.2z m-102.4 678.4H473.6l-2.2528 0.064a38.4 38.4 0 0 0 0 76.672L473.6 780.8h281.6l2.2528-0.064a38.4 38.4 0 0 0 0-76.672L755.2 704z m0-230.4H473.6l-2.2528 0.064a38.4 38.4 0 0 0 0 76.672L473.6 550.4h281.6l2.2528-0.064a38.4 38.4 0 0 0 0-76.672L755.2 473.6z m0-230.4H473.6l-2.2528 0.064a38.4 38.4 0 0 0 0 76.672L473.6 320h281.6l2.2528-0.064a38.4 38.4 0 0 0 0-76.672L755.2 243.2z"
            fill="#6B57FE" p-id="4044"></path>
        <path
            d="M281.6 691.2a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4z m0-230.4a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4z m0-230.4a51.2 51.2 0 1 1 0 102.4 51.2 51.2 0 0 1 0-102.4z"
            fill="#FFBA00" p-id="4045"></path>
      </svg>
      文章目录
    </h2>

    <!-- 目录内容容器 -->
    <div class="toc-wrapper max-h-[70vh] overflow-y-auto custom-scrollbar relative pl-1">
      <!-- 左侧灰色竖线背景 -->
      <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-100 dark:bg-gray-700/50 rounded-full z-0"></div>

      <ul class="toc relative z-10">
        <!-- 一级标题 (h2) -->
        <li v-for="(h2, index) in titles" :key="index" class="relative">
          <div
              :class="[
              h2.index === activeHeadingIndex
                ? 'text-sky-600 border-sky-500 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-400 font-semibold'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
            ]"
              :title="h2.text"
              class="pl-4 py-2 text-sm leading-relaxed border-l-[2px] cursor-pointer transition-all duration-200 rounded-r-md select-none truncate"
              @click="scrollToView(h2.offsetTop)">
            {{ h2.text }}
          </div>

          <!-- 二级标题 (h3) -->
          <template v-if="h2.children && h2.children.length > 0">
            <ul class="mt-0.5">
              <li v-for="(child, childIndex) in h2.children" :key="childIndex">
                <div
                    :class="[
                    child.index === activeHeadingIndex
                      ? 'text-sky-600 border-sky-500 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-400 font-semibold'
                      : 'text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  ]"
                    :title="child.text"
                    class="pl-7 py-1.5 text-sm leading-relaxed border-l-[2px] cursor-pointer transition-all duration-200 rounded-r-md select-none truncate"
                    @click="scrollToView(child.offsetTop)">
                  {{ child.text }}
                </div>

                <!-- 三级标题 (h4及以下) -->
                <template v-if="child.children && child.children.length > 0">
                  <ul class="mt-0.5">
                    <li v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex">
                      <div
                          :class="[
                            grandChild.index === activeHeadingIndex
                              ? 'text-sky-600 border-sky-500 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-400 font-semibold'
                              : 'text-gray-400 border-transparent hover:text-gray-900 hover:border-gray-300 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:border-gray-600'
                          ]"
                          :title="grandChild.text"
                          class="pl-10 py-1.5 text-xs leading-relaxed border-l-[2px] cursor-pointer transition-all duration-200 rounded-r-md select-none truncate"
                          @click="scrollToView(grandChild.offsetTop)">
                        {{ grandChild.text }}
                      </div>
                    </li>
                  </ul>
                </template>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useDark} from '@vueuse/core'

// 是否是暗黑模式
const isDark = useDark()

// 响应式的目录数据
const titles = ref([])
onMounted(() => {
  // 通过 .artilce-content 样式来获取父级 div
  const container = document.querySelector('.article-content')

  // 使用 MutationObserver 监视 DOM 的变化
  const observer = new MutationObserver(mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // 先清空目录缓存数据
        titles.value = []
        // 计算目录数据
        initTocData(container)

        // 监听所有图片的加载事件
        const images = container.querySelectorAll('img');
        images.forEach(img => {
          img.addEventListener('load', () => {
            // 图片加载完成后重新计算标题的 offsetTop
            initTocData(container)
          })
        })

        // 添加滚动事件监听
        window.addEventListener('scroll', handleContentScroll);
      }
    }
  })

  // 配置监视子节点的变化
  const config = {childList: true, subtree: true}
  // 开始观察正文 div 的内容变化
  observer.observe(container, config)
})

// 记录当前被选中的标题下标
const activeHeadingIndex = ref(-1)

// 当前 Y 轴滚动的偏移量
const currScrollY = ref(0)

// 处理滚动事件
function handleContentScroll() {
  // 当前的滚动位置
  let scrollY = window.scrollY
  // 记录当前滚动的 Y 轴偏移量
  currScrollY.value = scrollY

  // 递归检查所有标题
  function checkTitles(titlesArray) {
    titlesArray.forEach(title => {
      // 获取每个标题的 offset
      let offsetTop = title.offsetTop
      // 如果当前位置大于等于标题位置，则标记选中，记录被选中标题的下标
      if (scrollY >= offsetTop) {
        activeHeadingIndex.value = title.index
      }

      // 递归检查子标题
      if (title.children && title.children.length > 0) {
        checkTitles(title.children)
      }
    })
  }

  // 检查所有标题
  checkTitles(titles.value)
}

// 移除滚动监听
onBeforeUnmount(() => window.removeEventListener('scroll', handleContentScroll))

// 滚动到指定的位置
function scrollToView(offsetTop) {
  window.scrollTo({top: offsetTop, behavior: "smooth"});
}

// 初始化标题数据
function initTocData(container) {
  // 只提取二级、三级、四级等标题
  let levels = ['h2', 'h3', 'h4', 'h5', 'h6']
  let headings = container.querySelectorAll(levels)

  // 存放组装后的目录标题数据
  let titlesArr = []

  // 下标
  let index = 1
  // 用于构建层级关系的栈
  let stack = []

  headings.forEach(heading => {
    // 标题等级， h2 -> 级别 2 ； h3 -> 级别3，以此类推
    let headingLevel = parseInt(heading.tagName.substring(1))
    // 标题文字
    let headingText = heading.innerText
    // 标题的位置（距离顶部的距离），减去 Header 高度和一些缓冲
    let offsetTop = heading.offsetTop - 95

    //创建当前标题节点
    let currentNode = {
      index,
      level: headingLevel,
      text: headingText,
      offsetTop,
      children: [] // 子标题
    }

    // 处理层级关系
    if (stack.length === 0) {
      // 栈为空，直接添加到根目录
      titlesArr.push(currentNode)
      stack.push(currentNode)
    } else {
      // 找到合适的父标题
      while (stack.length > 0 && stack[stack.length - 1].level >= headingLevel) {
        stack.pop()
      }

      if (stack.length > 0) {
        // 添加到父级的children中
        stack[stack.length - 1].children.push(currentNode)
      } else {
        // 没有合适的父级，添加到根目录
        titlesArr.push(currentNode)
      }

      stack.push(currentNode)
    }

    // 下标 +1
    index++
  })

  // 设置数据
  titles.value = titlesArr
}
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}
</style>