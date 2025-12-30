<template>
  <Header></Header>

  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto px-4 md:px-6 py-8 min-h-[80vh]">
    <!-- grid 表格布局，分为 12 列 -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- 左边栏，占用 9 列 -->
      <div class="col-span-1 lg:col-span-9 space-y-6">
        <!-- 分类列表容器 -->
        <div
          class="w-full p-6 md:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">

          <!-- 分类标题 -->
          <h2
            class="flex items-center mb-8 text-2xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
            <span class="p-2 mr-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
              <!-- 文件夹图标 -->
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </span>
            全部分类
            <span
              class="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              共 {{ categories.length }} 个
            </span>
          </h2>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex flex-wrap gap-4 animate-pulse">
            <div v-for="n in 12" :key="n" class="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>

          <!-- 分类列表 (Flex 布局) -->
          <div v-else class="flex flex-wrap gap-4">
            <router-link v-for="(category, index) in categories" :key="index"
              :to="{ path: '/category/article/list', query: { id: category.id, name: category.name } }"
              class="group relative inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-all duration-300 border select-none
                      bg-gray-50 text-gray-700 border-transparent
                      hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-blue-600 dark:hover:to-indigo-600 dark:hover:text-white">
              <span class="relative z-10 flex items-center">
                {{ category.name }}
              </span>

              <!-- 文章数徽章 -->
              <span class="ml-2.5 text-xs font-bold opacity-80 bg-white text-gray-600 px-2 py-0.5 rounded-full transition-colors
                           group-hover:bg-white/20 group-hover:text-white
                           dark:bg-gray-600 dark:text-gray-300">
                {{ category.articlesTotal }}
              </span>
            </router-link>
          </div>

          <!-- 空状态 -->
          <div v-if="!loading && (!categories || categories.length === 0)" class="py-16 text-center">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 text-gray-400">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                </path>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400 text-lg">暂无分类数据</p>
          </div>
        </div>
      </div>

      <!-- 右边侧边栏，占用 3 列 -->
      <aside class="col-span-1 lg:col-span-3 space-y-6">
        <div class="sticky top-[5.5rem] space-y-6">
          <!-- 博主信息 -->
          <UserInfoCard class="animate__animated animate__fadeInRight" />

          <!-- 标签 (虽然这是分类页，但展示标签云也是合理的导航补充) -->
          <TagListCard class="animate__animated animate__fadeInRight animate__delay-200ms" />
        </div>
      </aside>
    </div>

  </main>

  <!-- 返回顶部 -->
  <ScrollToTopButton></ScrollToTopButton>

  <Footer></Footer>
</template>

<script setup>
import Header from '@/layouts/frontend/components/Header.vue'
import Footer from '@/layouts/frontend/components/Footer.vue'
import UserInfoCard from '@/layouts/frontend/components/UserInfoCard.vue'
import TagListCard from '@/layouts/frontend/components/TagListCard.vue'
import ScrollToTopButton from '@/layouts/frontend/components/ScrollToTopButton.vue'
import { getCategoryList } from '@/api/frontend/category'
import { ref, onMounted } from 'vue'

// 加载状态
const loading = ref(true)
// 所有分类
const categories = ref([])

onMounted(() => {
  fetchCategories()
})

const fetchCategories = () => {
  loading.value = true
  getCategoryList({}).then((res) => {
    if (res.success) {
      categories.value = res.data
    }
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
/* 可以在这里补充一些特定的过渡效果样式 */
</style>
