<template>
  <!-- 占位 div，防止 header fixed 后内容被遮挡 -->
  <div class="h-[64px] w-full"></div>

  <!-- Header 头部 -->
  <header class="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
    <nav
        class="bg-white/90 backdrop-blur-md border-b border-gray-100 dark:bg-[#0d1117]/90 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div class="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-4 h-[64px]">

        <!-- 左侧：博客 LOGO 与名称 -->
        <a class="flex items-center gap-3 group" href="/">
          <div
              class="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 w-9 h-9 transition-transform group-hover:scale-105">
            <img :src="blogSettingsStore.blogSettings.logo" alt="Logo" class="w-full h-full object-cover"/>
          </div>
          <span
              class="self-center text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 transition-colors group-hover:text-sky-600">
              {{ blogSettingsStore.blogSettings.name }} <span class="text-gray-400 font-normal text-sm ml-1">Wiki</span>
          </span>
        </a>

        <!-- 右侧功能区 -->
        <div class="flex items-center gap-2 md:gap-4">

          <!-- 搜索按钮 (PC & Mobile 通用) -->
          <button
              class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none flex items-center gap-2"
              @click="clickSearchBtn">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="2"/>
            </svg>
            <span class="hidden md:inline text-sm font-medium">搜索...</span>
            <span
                class="hidden lg:block px-1.5 py-0.5 text-xs font-sans font-medium text-gray-400 bg-gray-50 border border-gray-200 rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">Ctrl K</span>
          </button>

          <!-- 分隔线 -->
          <div class="h-5 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>

          <!-- 登录/用户头像 -->
          <div v-if="!isLogined" class="hidden md:block">
            <button
                class="text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                @click="$router.push('/login')">
              登录
            </button>
          </div>
          <!-- 已经登录，展示用户头像 -->
          <button v-else id="dropdownDefaultButton"
                  class="relative flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all hover:ring-2 hover:ring-sky-200"
                  data-dropdown-toggle="dropdown"
                  type="button">
            <span class="sr-only">Open user menu</span>
            <img :src="blogSettingsStore.blogSettings.avatar" alt="user photo"
                 class="w-9 h-9 rounded-full object-cover">
          </button>

          <!-- 移动端登录按钮 -->
          <button v-if="!isLogined"
                  class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  @click="$router.push('/login')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>

        </div>
      </div>
    </nav>
  </header>

  <!-- 用户下拉菜单 (PC端) -->
  <div id="dropdown"
       class="z-50 hidden bg-white divide-y divide-gray-100 rounded-xl shadow-lg w-44 dark:bg-gray-700 dark:divide-gray-600 border border-gray-100 dark:border-gray-600 animate__animated animate__fadeIn animate__faster">
    <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
      <div class="font-medium truncate">管理员</div>
    </div>
    <ul aria-labelledby="dropdownDefaultButton" class="py-1 text-sm text-gray-700 dark:text-gray-200">
      <li>
        <a class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors"
           @click="router.push('/admin/index')">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"></path>
          </svg>
          进入后台
        </a>
      </li>
      <li>
        <a class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer transition-colors text-red-500 hover:text-red-600"
           data-modal-target="popup-modal"
           data-modal-toggle="popup-modal">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2"></path>
          </svg>
          退出登录
        </a>
      </li>
    </ul>
  </div>

  <!-- 退出登录确认弹窗 -->
  <div id="popup-modal"
       class="fixed top-0 left-0 right-0 z-50 hidden p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm bg-black/30"
       tabindex="-1">
    <div class="relative w-full max-w-md max-h-full">
      <div class="relative bg-white rounded-2xl shadow-xl dark:bg-gray-800 transform transition-all">
        <button
            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
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
          <div
              class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg aria-hidden="true" class="w-6 h-6" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </div>
          <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">确定要退出登录吗?</h3>
          <div class="flex justify-center gap-3">
            <button
                class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-colors"
                data-modal-hide="popup-modal"
                type="button">
              取消
            </button>
            <button
                class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center transition-colors shadow-md shadow-red-500/20"
                data-modal-hide="popup-modal" type="button"
                @click="logout">
              确定退出
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 站内搜索 Modal (复用首页搜索组件逻辑) -->
  <div id="search-modal" aria-hidden="true"
       class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm bg-black/40"
       tabindex="-1">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
      <!-- Modal content -->
      <div
          class="relative bg-white rounded-2xl shadow-2xl dark:bg-gray-800 overflow-hidden transform transition-all scale-100">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b dark:border-gray-700">
          <!-- 搜索框 -->
          <form class="w-full mr-3 relative group" @submit.prevent>
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <!-- Loading 动画 -->
              <div v-if="searchLoading" class="animate-spin text-sky-600" role="status">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"></path>
                </svg>
              </div>
              <svg v-else aria-hidden="true"
                   class="w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors"
                   fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </div>
            <input id="search" ref="searchInputRef" v-model="searchWord"
                   autocomplete="off"
                   class="block w-full p-4 ps-11 text-base text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700/50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500 transition-all shadow-inner"
                   placeholder="搜索知识库文章..." required type="search">
          </form>

          <!-- 关闭 Modal -->
          <button
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-colors"
              type="button"
              @click="searchModal.hide()">
            <span class="sr-only">Close modal</span>
            <kbd
                class="hidden md:inline-block px-2 py-0.5 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Esc</kbd>
            <svg aria-hidden="true" class="w-3 h-3 md:hidden" fill="none" viewBox="0 0 14 14"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- Modal body -->
        <div class="p-4 md:p-5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div v-if="searchArticles && searchArticles.length > 0">
            <div class="flex items-center justify-between mb-3 px-2">
              <span class="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">搜索结果</span>
              <span class="text-xs text-gray-400">{{ total }} 篇相关文章</span>
            </div>
            <ul class="space-y-2">
              <li v-for="(article, index) in searchArticles" :key="index">
                <a class="flex items-start p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors"
                   @click="jumpToArticleDetailPage(article.id)">
                  <!-- 封面图 -->
                  <div
                      class="flex-shrink-0 mr-4 h-16 w-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 hidden sm:block">
                    <img :src="article.cover"
                         class="h-full w-full object-cover transition-transform group-hover:scale-105">
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-medium text-gray-900 truncate dark:text-white group-hover:text-sky-600 transition-colors"
                        v-html="article.title"></h3>
                    <p class="text-xs text-gray-500 mt-1 dark:text-gray-400 line-clamp-2"
                       v-html="article.summary || '暂无摘要'"></p>
                    <div class="flex items-center mt-2 text-xs text-gray-400 gap-3">
                        <span class="flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"/></svg>
                            {{ article.createDate }}
                        </span>
                    </div>
                  </div>
                </a>
              </li>
            </ul>

            <!-- 分页 -->
            <div class="flex items-center justify-center mt-6 gap-2 pt-4 border-t dark:border-gray-700">
              <button v-if="current > 1"
                      class="flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                      @click="prePage">
                上一页
              </button>
              <button v-if="current < pages"
                      class="flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                      @click="nextPage">
                下一页
              </button>
            </div>
          </div>

          <!-- 未搜索到结果 / 初始状态 -->
          <div v-else class="flex flex-col items-center justify-center py-10 text-center">
            <div v-if="searchWord && !searchLoading">
              <div class="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"/>
                </svg>
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">没有找到相关文章</p>
              <p class="text-sm text-gray-400 mt-1">请尝试更换关键词搜索</p>
            </div>
            <div v-else-if="!searchWord" class="py-5">
              <p class="text-gray-400 text-sm">输入关键词搜索知识库...</p>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div
            class="px-5 py-3 border-t bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <div class="flex gap-4">
            <span class="flex items-center gap-1"><kbd
                class="font-sans px-1.5 py-0.5 bg-white border rounded shadow-sm dark:bg-gray-600 dark:border-gray-500">↵</kbd> 选择</span>
            <span class="flex items-center gap-1"><kbd
                class="font-sans px-1.5 py-0.5 bg-white border rounded shadow-sm dark:bg-gray-600 dark:border-gray-500">↑↓</kbd> 导航</span>
          </div>
          <span>Powered by <a class="hover:text-sky-600 hover:underline transition-colors"
                              href="#">MeBlog Wiki</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {initCollapses, initDropdowns, initModals, Modal} from 'flowbite'
import {useBlogSettingsStore} from '@/stores/blogsettings'
import {useUserStore} from '@/stores/user'
import {useRoute, useRouter} from 'vue-router'
import {showMessage} from '@/composables/utils'
import {getArticleSearchPageList} from '@/api/frontend/search'

const modalOptions = {
  placement: 'top-center',
  backdrop: 'dynamic',
  backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 backdrop-blur-sm',
  closable: true,
};

const instanceOptions = {
  id: 'searchModalEl',
  override: true
};

const searchModal = ref(null)

onMounted(() => {
  initCollapses();
  initDropdowns();
  initModals();

  const $modalElement = document.querySelector('#search-modal');
  searchModal.value = new Modal($modalElement, modalOptions, instanceOptions);

  window.addEventListener('keydown', handleKeyDown);
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
})

const searchInputRef = ref(null)
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'k') {
    event.preventDefault()
    searchModal.value.show()
    setTimeout(() => searchInputRef.value.focus(), 100)
  }
}

const router = useRouter()
const route = useRoute()

const blogSettingsStore = useBlogSettingsStore()
const userStore = useUserStore()
const keys = Object.keys(userStore.userInfo)
const isLogined = ref(keys.length > 0)

const logout = () => {
  userStore.logout()
  isLogined.value = false
  showMessage('退出登录成功')
  // 隐藏 Modal (同Header处理)
  const modalEl = document.getElementById('popup-modal')
  if (modalEl) {
    const modal = new Modal(modalEl);
    modal.hide();
    document.querySelectorAll('[modal-backdrop]').forEach(el => el.remove());
    document.body.classList.remove('overflow-hidden');
    modalEl.classList.add('hidden');
    modalEl.setAttribute('aria-hidden', 'true');
  }
}

const clickSearchBtn = () => {
  searchModal.value.show()
  setTimeout(() => {
    searchInputRef.value.focus()
  }, 100)
}

const searchArticles = ref([])
const current = ref(1)
const total = ref(0)
const size = ref(10) // 修正 size 为 10
const pages = ref(0)
const searchWord = ref('')
const searchLoading = ref(false)

watch(searchWord, (newText, oldText) => {
  if (newText && newText !== oldText) {
    renderSearchArticles({current: 1, size: size.value, word: newText})
  } else if (newText === '') {
    searchArticles.value = []
    total.value = 0
  }
})

function renderSearchArticles(data) {
  searchLoading.value = true
  getArticleSearchPageList(data).then(res => {
    if (res.success) {
      searchArticles.value = res.data
      current.value = res.current
      size.value = res.size
      total.value = res.total
      pages.value = res.pages
    }
  }).finally(() => searchLoading.value = false)
}

const nextPage = () => {
  renderSearchArticles({current: current.value + 1, size: size.value, word: searchWord.value})
}

const prePage = () => {
  renderSearchArticles({current: current.value - 1, size: size.value, word: searchWord.value})
}

const jumpToArticleDetailPage = (articleId) => {
  searchModal.value.hide()
  // Wiki 页面的跳转逻辑可能不同，这里假设先跳到 Wiki 详情页
  // 注意：如果是在 Wiki 内部搜索，这里可能需要调整为 wiki 路由
  // 这里暂时保持通用跳转
  router.push({path: '/wiki/' + route.params.wikiId, query: {articleId}})
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>