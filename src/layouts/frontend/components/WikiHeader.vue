<template>
  <header class="sticky top-0 z-10">
    <nav class="bg-white border-gray-200 border-b dark:bg-[#0d1117] dark:border-gray-800">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- 博客 LOGO 、博客名称 -->
        <a class="flex items-center" href="/public">
          <img :src="blogSettingsStore.blogSettings.logo" alt="Flowbite Logo" class="h-8 mr-3 rounded-full"/>
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-gray-400">{{
              blogSettingsStore.blogSettings.name
            }}</span>
        </a>
        <div class="flex items-center md:order-2">
          <button aria-controls="navbar-search" aria-expanded="false"
                  class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
                  data-collapse-toggle="navbar-search"
                  type="button">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <span class="sr-only">Search</span>
          </button>
          <div class="relative hidden mr-2 md:block">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-4 h-4 text-gray-500 dark:text-gray-400"
                   fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
              <span class="sr-only">Search icon</span>
            </div>
            <input id="search-navbar"
                   class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="请输入关键词..."
                   type="text">
          </div>

          <!-- 登录 -->
          <div v-if="!isLogined" class="text-gray-900 ml-1 mr-1 hover:text-blue-700"
               @click="$router.push('/login')">登录
          </div>
          <!-- 已经登录，展示用户头像 -->
          <button v-else id="dropdownDefaultButton"
                  class="text-white ml-2 mr-2 md:mr-0 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  data-dropdown-toggle="dropdown"
                  type="button">
            <!-- 用户登录头像 -->
            <img :src="blogSettingsStore.blogSettings.avatar" alt="user photo" class="w-8 h-8 rounded-full">
          </button>

          <!-- Dropdown menu -->
          <div id="dropdown"
               class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
            <ul aria-labelledby="dropdownDefaultButton" class="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <a class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                   @click="router.push('/admin/index')">
                  <svg aria-hidden="true"
                       class="inline w-3 h-3 mb-[2px] mr-1 text-gray-700 dark:text-white" fill="none"
                       viewBox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M10 14v4m-4 1h8M1 10h18M2 1h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"
                        stroke="currentColor" stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"/>
                  </svg>
                  进入后台
                </a>
              </li>
              <li>
                <a class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                   data-modal-target="popup-modal" data-modal-toggle="popup-modal"
                   href="#">
                  <svg aria-hidden="true"
                       class="inline w-3 h-3 mb-[2px] mr-1 text-gray-700 dark:text-white" fill="none"
                       viewBox="0 0 16 16"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"/>
                  </svg>
                  退出登录
                </a>
              </li>
            </ul>
          </div>


          <button aria-controls="navbar-search" aria-expanded="false"
                  class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  data-collapse-toggle="navbar-search" type="button">
            <span class="sr-only">Open main menu</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 17 14"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div id="navbar-search" class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <div class="relative mt-3 md:hidden">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-4 h-4 text-gray-500 dark:text-gray-400"
                   fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
            </div>
            <input id="search-navbar"
                   class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                   placeholder="请输入搜索关键词..."
                   type="text">
          </div>
          <ul
              class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a :class="[currPath === '/' ? 'text-blue-700' : 'text-gray-900']"
                 aria-current="page"
                 class="block py-2 pl-3 pr-4  rounded md:bg-transparent md:p-0 md:dark:text-blue-500"
                 @click="router.push('/')">首页</a>
            </li>
            <li>
              <a :class="[currPath === '/category/list' ? 'text-blue-700' : 'text-gray-900']"
                 class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                 @click="router.push('/category/list')">分类</a>
            </li>

            <li>
              <a :class="[currPath === '/tag/list' ? 'text-blue-700' : 'text-gray-900']"
                 class="block py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                 @click="router.push('/tag/list')">标签</a>
            </li>
            <li>
              <a class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                 @click="router.push('/archive/list')">归档</a>
            </li>
            <li>
              <a :class="[currPath.startsWith('/wiki') ? 'text-sky-600 md:border-b-2 md:border-sky-600 dark:text-sky-500 dark:md:border-sky-600' : 'text-gray-900 dark:text-gray-400']"
                 class="block py-2 pl-3 pr-4 rounded md:rounded-none hover:bg-gray-100 md:hover:bg-transparent md:hover:text-sky-600 md:p-0 md:dark:hover:text-sky-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                 @click="router.push('/wiki/list')">知识库</a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  </header>

  <!-- 退出登录 -->
  <div id="popup-modal"
       class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
       tabindex="-1">
    <div class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <button
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
            type="button">
          <svg aria-hidden="true" class="w-3 h-3" fill="none" viewBox="0 0 14 14"
               xmlns="http://www.w3.org/2000/svg">
            <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"/>
          </svg>
          <span class="sr-only">Close modal</span>
        </button>
        <div class="p-6 text-center">
          <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
               fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"/>
          </svg>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">是否确定退出登录?
          </h3>
          <button
              class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              data-modal-hide="popup-modal" type="button"
              @click="logout">
            确定
          </button>
          <button
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              data-modal-hide="popup-modal"
              type="button">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {initCollapses, initDropdowns, initModals} from 'flowbite'
import {useBlogSettingsStore} from '@/stores/blogsettings.js'
import {useUserStore} from '@/stores/user.js'
import {useRoute, useRouter} from 'vue-router'
import {showMessage} from "@/composables/utils.js";

const router = useRouter()

const route = useRoute()

// 当前路由地址
const currPath = ref(route.path)

// 初始化 flowbit 相关组件
onMounted(() => {
  initCollapses();
  initDropdowns();
  initModals()
})

// 引入博客设置信息 store
const blogSettingsStore = useBlogSettingsStore()

// 是否登录，通过 userStore 中的 userInfo 对象是否有数据来判断
const userStore = useUserStore()
// 获取 userInfo 对象所有属性名称的数组
const keys = Object.keys(userStore.userInfo)
// 若大于零，则表示用户已登录
const isLogined = ref(keys.length > 0)

// 退出登录
const logout = () => {
  userStore.logout()
  // 标记为未登录
  isLogined.value = false
  showMessage('退出登录成功')
}
</script>

