<script setup>

const icpFilingUrl = import.meta.env.VITE_ICP_FILING_URL
const publicSecurityFilingUrl = import.meta.env.VITE_PUBLIC_SECURITY_FILING_URL
const publicSecurityNumber = import.meta.env.VITE_PUBLIC_SECURITY_NUMBER
const siteUrl = import.meta.env.VITE_SITE_URL
const siteName = import.meta.env.VITE_SITE_NAME
</script>

<template>
  <footer
      class="bg-white border-t border-gray-100 dark:bg-[#0d1117] dark:border-gray-800 transition-colors duration-300 relative z-40 mt-auto">
    <div
        class="w-full mx-auto max-w-screen-2xl py-8 px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <!-- 版权信息 -->
      <div class="text-sm text-gray-500 text-center md:text-left dark:text-gray-400">
        © 2025 <a :href="siteUrl"
                  class="font-medium hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{{ siteName }}</a>.
        All Rights Reserved.
      </div>

      <!-- 备案信息列表 -->
      <div class="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
        <!-- 萌ICP -->
        <a class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hover:underline decoration-sky-600/30"
           href="https://icp.gov.moe/?keyword=20250716"
           target="_blank">
          萌ICP备20250716号
        </a>

        <!-- 工信部ICP -->
        <a class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors hover:underline decoration-sky-600/30"
           href="https://beian.miit.gov.cn/"
           target="_blank">
          {{ icpFilingUrl || '鲁ICP备2025142845号-1' }}
        </a>

        <!-- 公安备案 -->
        <a :href="publicSecurityFilingUrl || 'https://beian.mps.gov.cn/#/query/webSearch?code=37172402000442'"
           class="flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors hover:underline decoration-sky-600/30"
           target="_blank">
          <!-- 图标 -->
          <img alt="备案图标" class="w-4 h-4 mr-1.5" src="@/assets/image/备案图标.png">
          <span>{{ publicSecurityNumber || '鲁公网安备37172402000442号' }}</span>
        </a>
      </div>

    </div>
  </footer>
</template>

<style scoped>
/* 样式已全部迁移至 Tailwind Utility Classes */
</style>