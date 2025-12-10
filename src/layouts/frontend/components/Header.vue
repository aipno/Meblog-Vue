<template>
  <!-- 占位 div，防止 header fixed 后内容被遮挡 -->
  <div class="h-[64px] w-full"></div>

  <!-- Header 头部 -->
  <header class="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
    <nav
        class="bg-white/90 backdrop-blur-md border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 h-[64px]">

        <!-- 左侧：博客 LOGO 与名称 -->
        <a class="flex items-center gap-3 group" href="/">
          <div
              class="relative overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 w-9 h-9 transition-transform group-hover:scale-105">
            <img :src="blogSettingsStore.blogSettings.logo" alt="Logo" class="w-full h-full object-cover"/>
          </div>
          <span
              class="self-center text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 transition-colors group-hover:text-sky-600">
              {{ blogSettingsStore.blogSettings.name }}
          </span>
        </a>

        <!-- 右侧移动端：汉堡菜单与搜索按钮 -->
        <div class="flex items-center md:order-2 gap-2">
          <!-- 移动端搜索按钮 -->
          <button aria-controls="navbar-search" aria-expanded="false"
                  class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2 transition-colors"
                  data-collapse-toggle="navbar-search"
                  type="button"
                  @click="clickSearchBtn">
            <svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 20 20"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
            <span class="sr-only">Search</span>
          </button>

          <!-- PC端功能区：暗黑模式、搜索框、登录 -->
          <div class="hidden md:flex items-center gap-3">
            <!-- 白天黑夜切换 -->
            <button aria-checked="false" aria-label="切换深色模式"
                    class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                    type="button" @click="toggleDark()">
              <!-- 太阳图标 -->
              <svg v-if="!isDark" aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      fill-rule="evenodd"></path>
              </svg>
              <!-- 月亮图标 -->
              <svg v-else aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>

            <!-- 搜索框 (PC) -->
            <button
                class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 border border-transparent hover:border-gray-300 rounded-full transition-all duration-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-600 group"
                type="button"
                @click="clickSearchBtn">
              <svg aria-hidden="true"
                   class="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                   fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
              <span class="mr-2">搜索...</span>
              <div
                  class="hidden lg:block px-1.5 py-0.5 text-xs font-sans font-medium text-gray-400 bg-white border border-gray-200 rounded shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-500">
                Ctrl K
              </div>
            </button>

            <!-- 分隔线 -->
            <div class="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <!-- 登录/用户头像 -->
            <div v-if="!isLogined">
              <button class="text-sm font-medium text-gray-700 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
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
          </div>

          <!-- 移动端：汉堡菜单按钮 -->
          <button aria-controls="navbar-search" aria-expanded="false"
                  class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 transition-colors"
                  data-collapse-toggle="navbar-search" type="button">
            <span class="sr-only">Open main menu</span>
            <svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 17 14"
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1h15M1 7h15M1 13h15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2"/>
            </svg>
          </button>
        </div>

        <!-- 导航菜单 -->
        <div id="navbar-search"
             class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 transition-all duration-300 ease-in-out">

          <!-- 移动端搜索框 (仅在汉堡菜单展开时显示) -->
          <div class="relative mt-3 md:hidden px-2 pb-2">
            <div class="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
              <svg aria-hidden="true" class="w-4 h-4 text-gray-500 dark:text-gray-400"
                   fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"/>
              </svg>
            </div>
            <input id="search-navbar"
                   class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-sky-500 dark:focus:border-sky-500"
                   placeholder="搜索文章..."
                   readonly
                   type="text" @click="clickSearchBtn">
            <!-- 移动端暗黑模式切换 -->
            <div class="mt-4 flex items-center justify-between px-1">
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">外观模式</span>
              <button class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300"
                      @click="toggleDark()">
                <span v-if="!isDark" class="flex items-center gap-2 text-xs">🌞 浅色</span>
                <span v-else class="flex items-center gap-2 text-xs">XR 深色</span>
              </button>
            </div>
            <!-- 移动端登录/退出 -->
            <div class="mt-3 border-t border-gray-100 dark:border-gray-700 pt-3 px-1">
              <div v-if="!isLogined" class="block py-2 text-center text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700"
                   @click="$router.push('/login')">
                立即登录
              </div>
              <div v-else class="flex items-center gap-3">
                <img :src="blogSettingsStore.blogSettings.avatar" class="w-8 h-8 rounded-full">
                <div class="flex-1">
                  <div class="text-sm font-medium dark:text-white">已登录</div>
                  <div class="text-xs text-gray-500" @click="router.push('/admin/index')">进入后台</div>
                </div>
                <button class="text-xs text-red-500" data-modal-target="popup-modal" data-modal-toggle="popup-modal">
                  退出
                </button>
              </div>
            </div>
          </div>

          <!-- 导航链接列表 -->
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-1 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li v-for="(item, index) in navLinks" :key="index">
              <a :class="[
                  isActive(item.path)
                    ? 'text-sky-600 bg-sky-50 dark:bg-sky-900/20 dark:text-sky-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                 ]"
                 class="block py-2 px-4 rounded-lg transition-all duration-200 text-sm md:text-[15px] font-medium cursor-pointer"
                 @click="router.push(item.path)">
                {{ item.name }}
              </a>
            </li>
          </ul>
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
            <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round"
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
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round"
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

  <!-- 站内搜索 Modal -->
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
                  <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
                   placeholder="搜索文章标题、内容..." required type="search">
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
              <path d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
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
                  <!-- 封面图 (可选，如果不需要可移除) -->
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"/></svg>
                            {{ article.createDate }}
                        </span>
                      <span v-if="article.category" class="flex items-center">
                             <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                                 d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke-linecap="round" stroke-linejoin="round"
                                 stroke-width="2"/></svg>
                             {{ article.category.name }}
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
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"/>
                </svg>
              </div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">没有找到相关文章</p>
              <p class="text-sm text-gray-400 mt-1">请尝试更换关键词搜索</p>
            </div>
            <div v-else-if="!searchWord" class="py-5">
              <p class="text-gray-400 text-sm">输入关键词开始探索...</p>
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
          <span>Powered by <a class="hover:text-sky-600 hover:underline transition-colors" href="#">MeBlog</a></span>
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
import {useDark, useToggle} from '@vueuse/core'

// 导航菜单配置，方便维护
const navLinks = [
  {name: '首页', path: '/'},
  {name: '分类', path: '/category/list'},
  {name: '标签', path: '/tag/list'},
  {name: '归档', path: '/archive/list'},
  {name: '知识库', path: '/wiki/list'},
]

const modalOptions = {
  placement: 'top-center', // 弹框位置
  backdrop: 'dynamic',
  backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40 backdrop-blur-sm',
  closable: true,
  onHide: () => {
    console.log('modal is hidden');
  },
  onShow: () => {
    console.log('modal is shown');
  },
  onToggle: () => {
    console.log('modal has been toggled');
  },
};

// instance options object
const instanceOptions = {
  id: 'searchModalEl',
  override: true
};

const searchModal = ref(null)

// 初始化 flowbit 相关组件
onMounted(() => {
  initCollapses();
  initDropdowns();
  initModals();

  // 初始化
  const $modalElement = document.querySelector('#search-modal');
  searchModal.value = new Modal($modalElement, modalOptions, instanceOptions);

  // 注册键盘事件监听器
  window.addEventListener('keydown', handleKeyDown);
})

onBeforeUnmount(() => {
  // 在组件销毁前移除事件监听器，防止内存泄漏
  window.removeEventListener('keydown', handleKeyDown);
})

// 搜索输入框引用
const searchInputRef = ref(null)
// 键盘监听
const handleKeyDown = (event) => {
  // 检查是否按下了 Ctrl 键和 K 键
  if (event.ctrlKey && event.key === 'k') {
    // 阻止激活浏览器本身的搜索框
    event.preventDefault()
    console.log('ctrl k 被按了')

    searchModal.value.show()

    // 激活搜索框
    searchInputRef.value.focus()
  }
}

const router = useRouter()
const route = useRoute()

// 判断菜单是否激活
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 当前路由地址
const currPath = ref(route.path)

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
  // 隐藏 Modal
  const modalEl = document.getElementById('popup-modal')
  if (modalEl) {
    // 使用 Flowbite 的方式或直接操作 DOM 隐藏
    const modal = new Modal(modalEl);
    modal.hide();
    // 也可以直接移除 backdrop
    document.querySelectorAll('[modal-backdrop]').forEach(el => el.remove());
    document.body.classList.remove('overflow-hidden');
    // 手动隐藏
    modalEl.classList.add('hidden');
    modalEl.setAttribute('aria-hidden', 'true');
  }
}

// 点击搜索框
const clickSearchBtn = () => {
  searchModal.value.show()
  // 激活搜索框
  // 稍作延迟以等待 modal 渲染
  setTimeout(() => {
    searchInputRef.value.focus()
  }, 100)
}

// 文章搜索结果
const searchArticles = ref([])
// 当前页码，给了一个默认值 1
const current = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const size = ref(1) // 注意：这里原代码是 1，可能是测试用，正常应该是 5 或 10
// 总共多少页
const pages = ref(0)
// 搜索关键词
const searchWord = ref('')

// 搜索 Loading
const searchLoading = ref(false)

watch(searchWord, (newText, oldText) => {
  console.log(`新值: ${newText}, 老值: ${oldText}`)
  if (newText && newText !== oldText) { // 若搜索关键词不为空，且和之前的值不相同
    renderSearchArticles({current: 1, size: size.value, word: newText}) // 搜索时重置为第一页
  } else if (newText === '') { // 搜索词为空
    // 置空
    searchArticles.value = []
    total.value = 0
  }
})

// 请求后台检索接口
function renderSearchArticles(data) {
  // 显示加载 Loading
  searchLoading.value = true
  getArticleSearchPageList(data).then(res => {
    console.log(res)
    if (res.success) {
      searchArticles.value = res.data
      current.value = res.current
      size.value = res.size
      total.value = res.total
      pages.value = res.pages
    }
  }).finally(() => searchLoading.value = false) // 隐藏加载 Loading
}

// 渲染下一页搜索结果
const nextPage = () => {
  renderSearchArticles({current: current.value + 1, size: size.value, word: searchWord.value})
}

// 渲染上一页搜索结果
const prePage = () => {
  renderSearchArticles({current: current.value - 1, size: size.value, word: searchWord.value})
}

// 点击搜索结果，跳转文章详情页
const jumpToArticleDetailPage = (articleId) => {
  // 隐藏搜索对话框
  searchModal.value.hide()
  // 路由跳转
  router.push('/article/' + articleId)
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
/* 自定义滚动条样式 */
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

/* 移除原有的 vt-switch 样式，因为已经换成了更简单的按钮实现 */
</style>