<template>
  <footer class="bg-white mt-5 dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl py-6 px-4 md:flex md:items-center md:justify-between">
            <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a :href="siteUrl"
                                                                                            class="hover:underline">{{ siteName }}</a>. All Rights Reserved.
            </span>
      <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li class="mr-3">
          备案号：
          <a href="https://icp.gov.moe/?keyword=20250716" class="hover:underline">萌ICP备20250716号</a>
        </li>
        <li>
          <a href="https://beian.miit.gov.cn/" class="mr-4 hover:underline md:mr-6 ">{{ icpFilingUrl }}</a>
        </li>
        <li class="beian">
          <img style="width: 25px;height: 25px" src="@/assets/image/备案图标.png" alt="#">
          <a :href="publicSecurityFilingUrl" class="mr-4 hover:underline md:mr-6 ">{{ publicSecurityNumber }}</a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const icpFilingUrl =  import.meta.env.VITE_ICP_FILING_URL
const publicSecurityFilingUrl = import.meta.env.VITE_PUBLIC_SECURITY_FILING_URL
const publicSecurityNumber = import.meta.env.VITE_PUBLIC_SECURITY_NUMBER
const siteUrl = import.meta.env.VITE_SITE_URL
const siteName = import.meta.env.VITE_SITE_NAME

</script>

<style scoped>
li.beian img {
  float: left;
  width: 50%;
}

</style>
