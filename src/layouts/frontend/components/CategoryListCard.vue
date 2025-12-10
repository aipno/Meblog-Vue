<template>
  <div v-if="categories && categories.length > 0"
       class="w-full p-5 mb-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">

    <!-- 标题栏 -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="flex items-center text-base font-bold text-gray-800 uppercase dark:text-gray-100">
        <!-- 文件夹图标 (保留原 SVG，微调 Margin) -->
        <svg class="inline icon w-5 h-5 mr-2" height="200" p-id="21572"
             version="1.1" viewBox="0 0 1024 1024" width="200" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M938.666667 464.592593h-853.333334v-265.481482c0-62.577778 51.2-113.777778 113.777778-113.777778h128.948148c15.17037 0 28.444444 3.792593 41.718519 11.377778l98.607407 64.474074h356.503704c62.577778 0 113.777778 51.2 113.777778 113.777778v189.62963z"
              fill="#3A69DD" p-id="21573"></path>
          <path
              d="M805.925926 398.222222h-587.851852v-125.155555c0-24.651852 20.859259-45.511111 45.511111-45.511111h496.82963c24.651852 0 45.511111 20.859259 45.511111 45.511111V398.222222z"
              fill="#D9E3FF" p-id="21574"></path>
          <path
              d="M843.851852 417.185185h-663.703704v-98.607407c0-28.444444 22.755556-53.096296 53.096296-53.096297h559.407408c28.444444 0 53.096296 22.755556 53.096296 53.096297V417.185185z"
              fill="#FFFFFF" p-id="21575"></path>
          <path
              d="M786.962963 938.666667h-549.925926c-83.437037 0-151.703704-68.266667-151.703704-151.703704V341.333333s316.681481 37.925926 430.45926 37.925926c189.62963 0 422.874074-37.925926 422.874074-37.925926v445.62963c0 83.437037-68.266667 151.703704-151.703704 151.703704 151.703704z"
              fill="#5F7CF9" p-id="21576"></path>
          <path
              d="M559.407407 512h-75.851851c-20.859259 0-37.925926-17.066667-37.925926-37.925926s17.066667-37.925926 37.925926-37.925926h75.851851c20.859259 0 37.925926 17.066667 37.925926 37.925926s-17.066667 37.925926-37.925926 37.925926z"
              fill="#F9D523" p-id="21577"></path>
        </svg>
        分类
      </h2>

      <!-- 查看更多 -->
      <a class="flex items-center justify-center w-7 h-7 text-gray-400 bg-gray-50 rounded-full hover:bg-sky-100 hover:text-sky-600 transition-all duration-300 cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
         title="查看更多"
         @click="router.push('/category/list')">
        <svg aria-hidden="true" class="w-3.5 h-3.5" fill="none" viewBox="0 0 8 14" xmlns="http://www.w3.org/2000/svg">
          <path d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"/>
        </svg>
      </a>

    </div>

    <!-- 分类列表 (Grid 布局) -->
    <div class="grid grid-cols-2 gap-3">
      <a v-for="(category, index) in categories" :key="index"
         class="group flex items-center justify-between px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-lg hover:bg-sky-50 hover:border-sky-200 transition-all duration-200 cursor-pointer dark:bg-gray-700/50 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500"
         @click="goCategoryArticleListPage(category.id, category.name)">

        <!-- 分类名称 -->
        <span
            class="text-gray-600 font-medium truncate mr-2 group-hover:text-sky-600 dark:text-gray-300 dark:group-hover:text-sky-300 transition-colors">
            {{ category.name }}
        </span>

        <!-- 文章数量 -->
        <span
            class="flex-shrink-0 inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1 text-[10px] font-semibold text-gray-500 bg-gray-200 rounded group-hover:bg-sky-200 group-hover:text-sky-700 transition-colors dark:bg-gray-600 dark:text-gray-400 dark:group-hover:bg-sky-900 dark:group-hover:text-sky-300">
            {{ category.articlesTotal }}
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import {getCategoryList} from '@/api/frontend/category'
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

// 跳转分类文章列表页
const goCategoryArticleListPage = (id, name) => {
  // 跳转时通过 query 携带参数（分类 ID、分类名称）
  router.push({path: '/category/article/list', query: {id, name}})
}

// 所有分类
const categories = ref([])
// 一次显示的分类数
const size = ref(10)

getCategoryList({size: size.value}).then((res) => {
  if (res.success) {
    categories.value = res.data
  }
})
</script>